import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { SpamAnalysis } from '../types/campaign';

interface SpamDeliverabilityAuditorProps {
  spamAnalysis: SpamAnalysis;
  emailBodyText: string;
  onCleanSpamResult: (cleanedText: string) => void;
  onLaunchGame?: () => void;
}

export const SpamDeliverabilityAuditor: React.FC<SpamDeliverabilityAuditorProps> = ({
  spamAnalysis,
  emailBodyText,
  onCleanSpamResult,
  onLaunchGame,
}) => {
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanFeedback, setCleanFeedback] = useState<string | null>(null);

  const score = spamAnalysis.deliverabilityScore || 95;
  const isOptimal = score >= 90;
  const hasTriggers = spamAnalysis.spamTriggers && spamAnalysis.spamTriggers.length > 0;

  const handleAutoClean = async () => {
    setIsCleaning(true);
    setCleanFeedback(null);
    try {
      const response = await fetch('/api/campaign/quick-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clean_spam',
          text: emailBodyText,
        }),
      });

      const data = await response.json();
      if (data.result) {
        onCleanSpamResult(data.result);
        setCleanFeedback('Spam triggers softened & deliverability optimized with Gemini 3.1 Flash Lite!');
        setTimeout(() => setCleanFeedback(null), 4000);
      }
    } catch (e) {
      console.error('Failed to clean spam words:', e);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-slate-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl border ${isOptimal ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Inbox Deliverability Guard</span>
            </h3>
            <p className="text-xs text-slate-400">Audited against major spam filter algorithms</p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <span className={`text-base font-extrabold ${isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
              {score}/100
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              {spamAnalysis.rating || 'Optimal'}
            </span>
          </div>
        </div>
      </div>

      {/* Spam Trigger Words Alert */}
      {hasTriggers ? (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-300">Potential Trigger Phrases Detected:</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {spamAnalysis.spamTriggers.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[11px] font-mono border border-amber-500/30"
                    >
                      "{word}"
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAutoClean}
              disabled={isCleaning}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold transition flex items-center space-x-1 shrink-0 ml-2 cursor-pointer shadow-sm"
            >
              {isCleaning ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
              <span>Auto-Fix</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4 flex items-center space-x-2.5">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-300 font-medium">
            Zero high-risk spam keywords detected. Your email passes standard inbox firewalls.
          </p>
        </div>
      )}

      {cleanFeedback && (
        <div className="mb-3 p-2 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs text-center font-medium animate-fade-in">
          {cleanFeedback}
        </div>
      )}

      {/* Deliverability Checklist */}
      <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Deliverability Best Practices
        </span>
        {spamAnalysis.deliverabilityTips?.map((tip, idx) => (
          <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
            <span className="leading-snug">{tip}</span>
          </div>
        ))}
      </div>

      {/* 3D Deliverability Flight Button */}
      {onLaunchGame && (
        <div className="pt-3 mt-3 border-t border-slate-800">
          <button
            onClick={onLaunchGame}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition cursor-pointer"
          >
            <span>🎮 Flight Test in 3D Server Matrix</span>
          </button>
        </div>
      )}

    </div>
  );
};
