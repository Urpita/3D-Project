import React, { useState } from 'react';
import { Monitor, Smartphone, Inbox, Code, Moon, Sun, Check, Copy, ExternalLink, Edit2, RotateCcw } from 'lucide-react';
import { CampaignEmail } from '../types/campaign';
import { generateResponsiveEmailHtml } from '../utils/htmlGenerator';

interface EmailPreviewCanvasProps {
  email: CampaignEmail;
  campaignTitle: string;
  onUpdateEmail: (updated: Partial<CampaignEmail>) => void;
}

export const EmailPreviewCanvas: React.FC<EmailPreviewCanvasProps> = ({
  email,
  campaignTitle,
  onUpdateEmail,
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'inbox' | 'html'>('desktop');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const activeSubject = email.subjectLines[email.selectedSubjectIndex]?.text || email.subjectLines[0]?.text || '';
  const heroImg = email.heroImageUrl || 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=80';

  const fullHtml = generateResponsiveEmailHtml(email, campaignTitle);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fullHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const updateBody = (field: keyof typeof email.bodyContent, value: any) => {
    onUpdateEmail({
      bodyContent: {
        ...email.bodyContent,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col h-full text-slate-100">
      
      {/* Top Preview Controls Bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* View Mode Selector Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile</span>
          </button>

          <button
            onClick={() => setViewMode('inbox')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'inbox'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Inbox className="h-3.5 w-3.5" />
            <span>Inbox Simulation</span>
          </button>

          <button
            onClick={() => setViewMode('html')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'html'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>HTML Code</span>
          </button>
        </div>

        {/* Right Tools: Dark Mode Simulator & Edit Mode */}
        <div className="flex items-center space-x-2">
          {viewMode !== 'html' && (
            <>
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Toggle Dark Mode Mail Client simulation"
                className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 transition cursor-pointer ${
                  isDarkMode
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                <span className="text-[11px] font-medium hidden sm:inline">
                  {isDarkMode ? 'Dark Client' : 'Light Client'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                  isEditing
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isEditing ? 'Editing Mode Active' : 'Edit Copy'}</span>
              </button>
            </>
          )}

          {viewMode === 'html' && (
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
            >
              {copiedHtml ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedHtml ? 'Copied HTML!' : 'Copy Code'}</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto flex items-start justify-center min-h-[500px]">
        
        {/* VIEW 1: INBOX SIMULATION */}
        {viewMode === 'inbox' && (
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Inbox header */}
            <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-bold text-slate-300 ml-2">Inbox Preview (Gmail / Apple Mail)</span>
              </div>
              <span className="text-[11px] text-slate-400">Primary Tab • 10:42 AM</span>
            </div>

            {/* Simulated Inbox Row */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-start space-x-3.5 hover:bg-slate-800/40 transition">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {campaignTitle.charAt(0) || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-slate-100 truncate">
                    {campaignTitle}
                  </span>
                  <span className="text-xs text-indigo-400 font-semibold shrink-0 ml-2">
                    {email.delayInfo || 'Today'}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white truncate mb-1">
                  {activeSubject}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {email.preheader || 'Exclusive preview notes for today’s edition...'}
                </div>
              </div>
            </div>

            {/* Expanded Mail Window Preview */}
            <div className="p-6 bg-slate-900">
              <div className="mb-4 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white mb-2">{activeSubject}</h2>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-200 font-semibold">{campaignTitle}</span>
                    <span>&lt;newsletter@{campaignTitle.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}.com&gt;</span>
                  </div>
                  <span>to me (VIP)</span>
                </div>
              </div>

              {/* Render actual email layout */}
              <div className="rounded-xl overflow-hidden border border-slate-800">
                {renderEmailContent(email, campaignTitle, isDarkMode, isEditing, onUpdateEmail, updateBody)}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: HTML CODE VIEWER */}
        {viewMode === 'html' && (
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs text-slate-400">
              <span>Production Inline HTML • Compatible with Klaviyo, Mailchimp, ConvertKit, SendGrid</span>
              <span>{fullHtml.length} characters</span>
            </div>
            <pre className="font-mono text-xs text-indigo-300 overflow-x-auto p-4 bg-slate-950 rounded-xl max-h-[600px] leading-relaxed selection:bg-indigo-600 selection:text-white">
              {fullHtml}
            </pre>
          </div>
        )}

        {/* VIEW 3: MOBILE FRAME (375px) */}
        {viewMode === 'mobile' && (
          <div className="w-[375px] shrink-0 bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 relative">
            {/* Mobile Notch / Dynamic Island */}
            <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900/60 mr-2" />
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Mobile Status Bar */}
            <div className="flex items-center justify-between px-3 text-[11px] font-bold text-slate-400 mb-2">
              <span>9:41</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px]">5G</span>
                <span className="text-[10px]">100%</span>
              </div>
            </div>

            {/* Mobile Screen Container */}
            <div className="rounded-[32px] overflow-hidden bg-slate-950 max-h-[640px] overflow-y-auto border border-slate-800">
              {renderEmailContent(email, campaignTitle, isDarkMode, isEditing, onUpdateEmail, updateBody, true)}
            </div>
          </div>
        )}

        {/* VIEW 4: DESKTOP EMAIL CANVAS (600px) */}
        {viewMode === 'desktop' && (
          <div className="w-full max-w-[620px] shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
            {renderEmailContent(email, campaignTitle, isDarkMode, isEditing, onUpdateEmail, updateBody, false)}
          </div>
        )}

      </div>

    </div>
  );
};

/**
 * Helper to render the email body layout in light/dark client modes with inline editing capabilities
 */
function renderEmailContent(
  email: CampaignEmail,
  campaignTitle: string,
  isDark: boolean,
  isEditing: boolean,
  onUpdateEmail: (updated: Partial<CampaignEmail>) => void,
  updateBody: (field: any, val: any) => void,
  isMobile: boolean = false
) {
  const bgMain = isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900';
  const bgCard = isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200/80';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';
  const heroImg = email.heroImageUrl || 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className={`${bgMain} transition-colors duration-200 font-sans`}>
      
      {/* Top Preheader bar */}
      <div className={`px-6 py-3 border-b flex items-center justify-between text-xs ${isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-100 bg-slate-50/60 text-slate-500'}`}>
        <span className="font-bold text-indigo-500 uppercase tracking-wider text-[11px]">
          {campaignTitle}
        </span>
        <span className="text-[11px]">
          {email.delayInfo}
        </span>
      </div>

      {/* Hero Image Banner with Resolution Pill */}
      <div className="relative group overflow-hidden bg-slate-950 aspect-[16/9] max-h-72">
        <img
          src={heroImg}
          alt={email.heroTitle}
          className="w-full h-full object-cover"
        />
        {email.heroImageSize && (
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-slate-700/80 shadow">
            Visual: {email.heroImageSize} HD (gemini-3-pro-image-preview)
          </div>
        )}
      </div>

      {/* Main Email Body Content */}
      <div className={`p-6 sm:p-8 ${isMobile ? 'p-5' : ''}`}>
        
        {/* Hero Title */}
        {isEditing ? (
          <div className="mb-3">
            <label className="text-[10px] uppercase font-bold text-indigo-400">Headline</label>
            <input
              type="text"
              value={email.heroTitle}
              onChange={(e) => onUpdateEmail({ heroTitle: e.target.value })}
              className={`w-full p-2 text-xl font-extrabold rounded-lg border outline-none ${isDark ? 'bg-slate-800 border-indigo-500 text-white' : 'bg-slate-100 border-indigo-400 text-slate-900'}`}
            />
          </div>
        ) : (
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 leading-tight">
            {email.heroTitle}
          </h1>
        )}

        {/* Hero Subtitle */}
        {isEditing ? (
          <div className="mb-4">
            <label className="text-[10px] uppercase font-bold text-indigo-400">Subtitle Hook</label>
            <input
              type="text"
              value={email.heroSubtitle}
              onChange={(e) => onUpdateEmail({ heroSubtitle: e.target.value })}
              className={`w-full p-2 text-sm rounded-lg border outline-none ${isDark ? 'bg-slate-800 border-indigo-500 text-white' : 'bg-slate-100 border-indigo-400 text-slate-900'}`}
            />
          </div>
        ) : (
          <p className={`text-base leading-relaxed mb-6 font-normal ${textMuted}`}>
            {email.heroSubtitle}
          </p>
        )}

        <div className={`border-t mb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

        {/* Greeting & Intro Paragraph */}
        <div className="mb-6 space-y-3">
          {isEditing ? (
            <div>
              <label className="text-[10px] uppercase font-bold text-indigo-400">Greeting</label>
              <input
                type="text"
                value={email.bodyContent.greeting}
                onChange={(e) => updateBody('greeting', e.target.value)}
                className={`w-full p-1.5 text-sm font-semibold rounded border outline-none mb-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100'}`}
              />
              <label className="text-[10px] uppercase font-bold text-indigo-400">Intro Body Copy</label>
              <textarea
                value={email.bodyContent.intro}
                onChange={(e) => updateBody('intro', e.target.value)}
                rows={3}
                className={`w-full p-2 text-sm rounded border outline-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100'}`}
              />
            </div>
          ) : (
            <>
              <p className="text-sm font-bold">{email.bodyContent.greeting}</p>
              <p className={`text-sm leading-relaxed ${textMuted}`}>
                {email.bodyContent.intro}
              </p>
            </>
          )}
        </div>

        {/* Key Benefits */}
        <div className={`rounded-xl p-4 sm:p-5 mb-6 border ${bgCard} space-y-3`}>
          {email.bodyContent.keyBenefits?.map((benefit, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <span className="text-xl shrink-0 mt-0.5">{benefit.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-indigo-400">{benefit.title}</h4>
                <p className={`text-xs mt-0.5 leading-relaxed ${textMuted}`}>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Special Offer Box */}
        {email.bodyContent.offerBox && (
          <div className="rounded-xl p-5 mb-6 text-center border bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/30">
            <span className="inline-block bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              {email.bodyContent.offerBox.badge}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold mb-1.5 text-indigo-300">
              {email.bodyContent.offerBox.headline}
            </h3>
            <p className="text-xs text-slate-300 mb-3 max-w-md mx-auto">
              {email.bodyContent.offerBox.details}
            </p>
            {email.bodyContent.offerBox.couponCode && (
              <div className="inline-block px-4 py-1.5 rounded-lg border-2 border-dashed border-indigo-400 font-mono text-sm font-bold text-indigo-300 bg-slate-900/80">
                Code: {email.bodyContent.offerBox.couponCode}
              </div>
            )}
          </div>
        )}

        {/* Social Proof */}
        {email.bodyContent.socialProof && (
          <div className="border-l-4 border-indigo-500 pl-4 py-1 mb-6 my-4 italic">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-1">
              {email.bodyContent.socialProof.quote}
            </p>
            <p className="text-xs font-bold text-white not-italic">
              — {email.bodyContent.socialProof.author}
              {email.bodyContent.socialProof.metric && (
                <span className="font-normal text-slate-400 ml-1.5">
                  ({email.bodyContent.socialProof.metric})
                </span>
              )}
            </p>
          </div>
        )}

        {/* Primary CTA Button */}
        <div className="text-center my-7">
          {isEditing ? (
            <div className="space-y-2 max-w-sm mx-auto">
              <label className="text-[10px] uppercase font-bold text-indigo-400">Button Text</label>
              <input
                type="text"
                value={email.bodyContent.callToAction.text}
                onChange={(e) =>
                  updateBody('callToAction', {
                    ...email.bodyContent.callToAction,
                    text: e.target.value,
                  })
                }
                className={`w-full p-2 text-center text-sm font-bold rounded-lg border outline-none ${isDark ? 'bg-slate-800 border-indigo-500' : 'bg-slate-100'}`}
              />
            </div>
          ) : (
            <a
              href={email.bodyContent.callToAction.url || '#'}
              className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 text-center"
            >
              {email.bodyContent.callToAction.text}
            </a>
          )}
          {email.bodyContent.callToAction.subtext && (
            <p className="text-[11px] text-slate-400 mt-2">
              {email.bodyContent.callToAction.subtext}
            </p>
          )}
        </div>

        {/* Secondary Offer */}
        {email.bodyContent.secondaryOffer && (
          <p className="text-center text-xs text-slate-400 mb-6">
            {email.bodyContent.secondaryOffer}
          </p>
        )}

        {/* P.S. Section */}
        {email.bodyContent.psLine && (
          <div className="rounded-xl p-3.5 mb-6 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-200 leading-relaxed">
            <strong className="font-bold text-amber-400">P.S. </strong>
            {email.bodyContent.psLine.replace(/^P\.S\.\s*/i, '')}
          </div>
        )}

        {/* Signoff */}
        <div className={`pt-4 border-t text-xs whitespace-pre-line leading-relaxed ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
          {email.bodyContent.signoff}
        </div>

      </div>

      {/* Footer & Compliance */}
      <div className={`p-6 border-t text-center text-[11px] leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-slate-100/70 border-slate-200 text-slate-400'}`}>
        <p className="mb-2">
          You are receiving this email as a confirmed subscriber of {campaignTitle}.
        </p>
        <div className="flex justify-center space-x-3 text-slate-500">
          <a href="#" className="hover:underline">Preferences</a>
          <span>•</span>
          <a href="#" className="hover:underline">Unsubscribe</a>
          <span>•</span>
          <a href="#" className="hover:underline">View in Browser</a>
        </div>
      </div>

    </div>
  );
}
