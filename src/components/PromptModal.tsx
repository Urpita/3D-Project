import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight, Zap, Target, Layers } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: {
    prompt: string;
    sequenceType: 'single' | 'sequence';
    tone: string;
    brandName: string;
    targetAudience: string;
    objective: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const PRESET_IDEAS = [
  {
    title: 'Artisan Cold Brew Launch',
    prompt: 'Launch campaign for artisanal slow-steeped organic cold brew subscription offering 30% off founder access with a free matte black tumbler.',
    tone: 'persuasive',
    objective: 'product_launch',
  },
  {
    title: 'SaaS AI Feature Announcement',
    prompt: 'Announce an AI Automated CRM Copilot feature that writes personalized customer replies in seconds, offering a 14-day free trial.',
    tone: 'b2b_professional',
    objective: 'feature_announcement',
  },
  {
    title: 'Black Friday 48h Flash Sale',
    prompt: 'Urgent Black Friday flash sale for premium noise-canceling headphones with 40% discount, free expedited shipping, and midnight deadline.',
    tone: 'urgent',
    objective: 'promotional_sale',
  },
  {
    title: 'Customer Re-Engagement / Win-Back',
    prompt: 'Re-engage inactive subscribers who have not opened an email in 60 days with a $20 store credit and sneak peek at new seasonal collections.',
    tone: 'conversational',
    objective: 're_engagement',
  },
];

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [sequenceType, setSequenceType] = useState<'single' | 'sequence'>('sequence');
  const [tone, setTone] = useState('persuasive');
  const [brandName, setBrandName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [objective, setObjective] = useState('product_launch');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate({
      prompt: prompt.trim(),
      sequenceType,
      tone,
      brandName: brandName.trim(),
      targetAudience: targetAudience.trim(),
      objective,
    });
  };

  const handleSelectPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setPrompt(preset.prompt);
    setTone(preset.tone);
    setObjective(preset.objective);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generate Complete Email Campaign</h2>
              <p className="text-xs text-slate-400">From a single prompt to high-converting copy, A/B subjects & visuals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Quick Preset Ideas */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Instant Inspiration Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(idea)}
                  className="text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition group cursor-pointer"
                >
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                    {idea.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {idea.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Brief Input */}
          <div>
            <label htmlFor="prompt-input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>What do you want this campaign to accomplish? <span className="text-pink-400">*</span></span>
              <span className="text-[11px] text-slate-400 font-normal">Product, offer, discount, or goal</span>
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Announce our new lightweight solar generator with 25% early-bird discount for camper van owners and weekend adventurers..."
              rows={3}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition"
            />
          </div>

          {/* Campaign Architecture & Tone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sequence Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                <span>Campaign Structure</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSequenceType('single')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                    sequenceType === 'single'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-200">Single Blast</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">1 High-impact email</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSequenceType('sequence')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                    sequenceType === 'sequence'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-200">3-Part Sequence</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Reveal • Proof • Urgency</div>
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Wand2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Brand Tone of Voice</span>
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="persuasive">Persuasive & High Conversion</option>
                <option value="conversational">Warm & Conversational</option>
                <option value="urgent">Urgent & FOMO-Driven</option>
                <option value="luxury">Luxury & Sophisticated</option>
                <option value="bold">Bold & Provocative</option>
                <option value="b2b_professional">B2B Professional & Authority</option>
              </select>
            </div>

          </div>

          {/* Optional Details (Brand Name & Target Audience) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Brand / Product Name (Optional)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Lumina Labs"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                <Target className="h-3 w-3 text-emerald-400" />
                <span>Target Audience Persona (Optional)</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Busy parents, enterprise CFOs, gamers"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Uses Gemini 3.8 Flash for structured email orchestration</span>
            </span>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Orchestrating Campaign...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Campaign</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
