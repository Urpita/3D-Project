import React from 'react';
import { Layers, Plus, Calendar, Clock, Sparkles } from 'lucide-react';
import { CampaignEmail } from '../types/campaign';

interface SequenceTabsProps {
  emails: CampaignEmail[];
  activeEmailIndex: number;
  onSelectEmail: (index: number) => void;
  onAddEmailToSequence: () => void;
}

export const SequenceTabs: React.FC<SequenceTabsProps> = ({
  emails,
  activeEmailIndex,
  onSelectEmail,
  onAddEmailToSequence,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        
        {/* Sequence Email Tabs */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center space-x-1 shrink-0">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Sequence Flow:</span>
          </span>

          {emails.map((email, idx) => {
            const isActive = activeEmailIndex === idx;
            return (
              <button
                key={email.id || idx}
                type="button"
                onClick={() => onSelectEmail(idx)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="text-left">
                  <div className="leading-tight truncate max-w-[140px] sm:max-w-[200px]">
                    {email.sequenceStep.split(':')[1]?.trim() || email.sequenceStep}
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal leading-tight">
                    {email.delayInfo}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Add Sequence Step */}
        <button
          type="button"
          onClick={onAddEmailToSequence}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition shrink-0 cursor-pointer"
          title="Add another email step to this nurture sequence"
        >
          <Plus className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Add Follow-up Email</span>
        </button>

      </div>
    </div>
  );
};
