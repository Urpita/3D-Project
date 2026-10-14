import React from 'react';
import { Mail, Sparkles, Download, Copy, Check, MessageSquare, Eye, Layers } from 'lucide-react';
import { Campaign, CampaignEmail } from '../types/campaign';
import { generateResponsiveEmailHtml } from '../utils/htmlGenerator';

interface CampaignHeaderProps {
  campaign: Campaign;
  activeEmail: CampaignEmail;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  onOpenNewPrompt: () => void;
  onLaunchGame: () => void;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaign,
  activeEmail,
  isChatOpen,
  setIsChatOpen,
  onOpenNewPrompt,
  onLaunchGame,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyHtml = () => {
    const html = generateResponsiveEmailHtml(activeEmail, campaign.campaignTitle);
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const html = generateResponsiveEmailHtml(activeEmail, campaign.campaignTitle);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeEmail.sequenceStep.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'campaign-email'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Mail className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                CampaignForge
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md hidden sm:block">
              {campaign.campaignTitle || 'AI-Powered Email Marketing Generator'}
            </p>
          </div>
        </div>

        {/* Center / Action Badges */}
        <div className="hidden lg:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>{campaign.emails.length} Email{campaign.emails.length > 1 ? 's in Sequence' : ''}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>1K-4K Visuals & Multi-turn Copilot Ready</span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenNewPrompt}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Campaign</span>
            <span className="sm:hidden">New</span>
          </button>

          <button
            onClick={handleCopyHtml}
            title="Copy Responsive HTML for Mailchimp, Klaviyo, SendGrid, etc."
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span className="hidden md:inline">{copied ? 'Copied HTML' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            title="Download Email HTML file"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs transition cursor-pointer hidden sm:flex items-center"
          >
            <Download className="h-4 w-4 text-slate-400" />
          </button>

          {/* 3D Deliverability Game Button */}
          <button
            onClick={onLaunchGame}
            title="Launch 3D Deliverability Flight Simulation Game"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/25 transition active:scale-95 cursor-pointer"
          >
            <span className="text-sm">🎮</span>
            <span className="hidden sm:inline">3D Flight Test</span>
            <span className="sm:hidden">Game</span>
          </button>

          {/* Chatbot Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isChatOpen
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-indigo-300" />
            <span>AI Copilot</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </button>
        </div>

      </div>
    </header>
  );
};
