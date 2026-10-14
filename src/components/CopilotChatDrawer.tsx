import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Zap, Brain, MessageSquare, Trash2, ArrowUpRight } from 'lucide-react';
import { ChatMessage, ChatRoleInfo, ChatRoleKey, CampaignEmail } from '../types/campaign';

interface CopilotChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeEmail: CampaignEmail;
  campaignTitle: string;
  onApplySubjectSuggestion?: (subject: string) => void;
}

const CHAT_ROLES: ChatRoleInfo[] = [
  {
    id: 'strategy_director',
    name: 'Campaign Strategist',
    model: 'gemini-4-argon',
    taskLevel: 'complex',
    description: 'High-level campaign architecture, audience psychology & CRO audit',
    badge: 'Complex Reasoning (gemini-4-argon)',
  },
  {
    id: 'copywriting_master',
    name: 'Master Copywriter',
    model: 'gemini-3.8-flash',
    taskLevel: 'general',
    description: 'Creative hook writing, emotional resonance & newsletter copy',
    badge: 'General Tasks (gemini-3.8-flash)',
  },
  {
    id: 'speed_editor',
    name: 'Rapid Polish Doctor',
    model: 'gemini-3.1-flash-lite',
    taskLevel: 'fast',
    description: 'Lightning-fast subject lines, trimming & spam defense',
    badge: 'Fast Tasks (gemini-3.1-flash-lite)',
  },
];

const QUICK_PROMPTS = [
  {
    label: 'CRO Friction Audit',
    text: 'Analyze this email for conversion friction: where might a subscriber hesitate, and how can we eliminate that hesitation?',
    role: 'strategy_director' as ChatRoleKey,
  },
  {
    label: 'Punchier Opening Hook',
    text: 'Rewrite the first 2 sentences of the intro to be 2x more intriguing and emotionally gripping.',
    role: 'copywriting_master' as ChatRoleKey,
  },
  {
    label: 'Fast 3 Subject Lines',
    text: 'Generate 3 high-impact subject lines under 45 characters that provoke intense curiosity.',
    role: 'speed_editor' as ChatRoleKey,
  },
  {
    label: 'High-Conversion CTA',
    text: 'Give me 3 alternative high-converting CTA button texts tailored for impulse buyers.',
    role: 'copywriting_master' as ChatRoleKey,
  },
];

export const CopilotChatDrawer: React.FC<CopilotChatDrawerProps> = ({
  isOpen,
  onClose,
  activeEmail,
  campaignTitle,
  onApplySubjectSuggestion,
}) => {
  const [selectedRole, setSelectedRole] = useState<ChatRoleKey>('copywriting_master');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hello! I am your AI Email Marketing Copilot. I'm actively analyzing **"${activeEmail.heroTitle}"**.\n\nYou can switch my role anytime depending on your task:\n• **gemini-4-argon** for complex funnel strategy and deep CRO analysis.\n• **gemini-3.8-flash** for general copywriting, storytelling and creative hooks.\n• **gemini-3.1-flash-lite** for ultra-fast edits, subject lines and deliverability polish.\n\nHow can I help you elevate this campaign today?`,
      timestamp: 'Just now',
      modelUsed: 'gemini-3.8-flash',
      roleTitle: 'Master Email Copywriter',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const activeRoleInfo = CHAT_ROLES.find((r) => r.id === selectedRole) || CHAT_ROLES[0];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    // Prepare active email summary for contextual grounding
    const currentSubject = activeEmail.subjectLines[activeEmail.selectedSubjectIndex]?.text || '';
    const emailSummary = `
Campaign: ${campaignTitle}
Sequence Step: ${activeEmail.sequenceStep}
Active Subject: ${currentSubject}
Preheader: ${activeEmail.preheader}
Hero Title: ${activeEmail.heroTitle}
Hero Subtitle: ${activeEmail.heroSubtitle}
Intro: ${activeEmail.bodyContent.intro}
Key Benefits: ${activeEmail.bodyContent.keyBenefits?.map((b) => b.title).join(', ')}
Offer: ${activeEmail.bodyContent.offerBox?.headline} (${activeEmail.bodyContent.offerBox?.couponCode || 'No code'})
CTA Button: ${activeEmail.bodyContent.callToAction?.text}
P.S.: ${activeEmail.bodyContent.psLine}
`;

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          roleId: selectedRole,
          taskType: activeRoleInfo.taskLevel,
          currentEmailSummary: emailSummary,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to get chat reply');
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.content || 'I could not generate a response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || activeRoleInfo.model,
        roleTitle: data.roleTitle || activeRoleInfo.name,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content: `Sorry, I encountered an issue: ${err.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: activeRoleInfo.model,
        roleTitle: activeRoleInfo.name,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Chat history cleared. I'm ready to assist with **"${activeEmail.heroTitle}"** as your **${activeRoleInfo.name}**.`,
        timestamp: 'Just now',
        modelUsed: activeRoleInfo.model,
        roleTitle: activeRoleInfo.name,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-left text-slate-100">
      
      {/* Top Drawer Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>Campaign AI Copilot</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-[11px] text-slate-400">Multi-turn strategic & creative campaign assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleClearChat}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Role Selector with Model Badges (Required Feature) */}
      <div className="px-5 py-3 bg-slate-900 border-b border-slate-800">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          AI Role & Specialized Model
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {CHAT_ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1 text-xs font-bold text-slate-200 truncate">
                  {role.taskLevel === 'complex' && <Brain className="h-3 w-3 text-purple-400 shrink-0" />}
                  {role.taskLevel === 'general' && <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />}
                  {role.taskLevel === 'fast' && <Zap className="h-3 w-3 text-amber-400 shrink-0" />}
                  <span className="truncate">{role.name.split(' ')[0]}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                  {role.model}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 mt-2 flex items-center space-x-1">
          <span className="font-semibold text-slate-300">{activeRoleInfo.name}:</span>
          <span className="truncate">{activeRoleInfo.description}</span>
        </p>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedRole(qp.role);
              handleSendMessage(qp.text);
            }}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1"
          >
            <span>{qp.label}</span>
            <ArrowUpRight className="h-2.5 w-2.5 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow'
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Assistant Metadata Header */}
                {!isUser && msg.modelUsed && (
                  <div className="flex items-center space-x-2 mb-1.5 pb-1 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span className="font-semibold text-indigo-400">{msg.roleTitle || 'AI Copilot'}</span>
                    <span>•</span>
                    <span className="text-slate-400">{msg.modelUsed}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className={`mt-1.5 text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-500'} text-right`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="h-7 w-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-100" />
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-200" />
              <span className="ml-1 text-[11px] font-mono text-indigo-300">
                Thinking with {activeRoleInfo.model}...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-slate-950 border-t border-slate-800"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${activeRoleInfo.name} (${activeRoleInfo.model})...`}
            disabled={isLoading}
            className="w-full pl-3.5 pr-11 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>Active context: "{activeEmail.heroTitle}"</span>
          <span className="font-mono">{activeRoleInfo.badge}</span>
        </div>
      </form>

    </div>
  );
};
