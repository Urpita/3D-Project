import React, { useState } from 'react';
import { Campaign, CampaignEmail } from './types/campaign';
import { SAMPLE_CAMPAIGN } from './data/sampleCampaign';
import { CampaignHeader } from './components/CampaignHeader';
import { SequenceTabs } from './components/SequenceTabs';
import { HeroImageGenerator } from './components/HeroImageGenerator';
import { SubjectLineOptimizer } from './components/SubjectLineOptimizer';
import { SpamDeliverabilityAuditor } from './components/SpamDeliverabilityAuditor';
import { EmailPreviewCanvas } from './components/EmailPreviewCanvas';
import { CopilotChatDrawer } from './components/CopilotChatDrawer';
import { PromptModal } from './components/PromptModal';
import { DeliverabilityFlightGame } from './game/DeliverabilityFlightGame';
import { Sparkles, Layers, Target, Clock, AlertCircle } from 'lucide-react';

export default function App() {
  const [campaign, setCampaign] = useState<Campaign>(SAMPLE_CAMPAIGN);
  const [activeEmailIndex, setActiveEmailIndex] = useState(0);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);

  const activeEmail: CampaignEmail = campaign.emails[activeEmailIndex] || campaign.emails[0];

  // Handler to update the active email in the campaign sequence
  const handleUpdateActiveEmail = (updatedFields: Partial<CampaignEmail>) => {
    setCampaign((prev) => {
      const newEmails = [...prev.emails];
      newEmails[activeEmailIndex] = {
        ...newEmails[activeEmailIndex],
        ...updatedFields,
      };
      return {
        ...prev,
        emails: newEmails,
      };
    });
  };

  // Handler for image generated via gemini-3-pro-image-preview
  const handleImageGenerated = (imageUrl: string, size: '1K' | '2K' | '4K') => {
    handleUpdateActiveEmail({
      heroImageUrl: imageUrl,
      heroImageSize: size,
    });
    setBannerNotice(`Generated new ${size} HD hero visual for ${activeEmail.sequenceStep}!`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Handler to generate a brand new campaign from prompt
  const handleGenerateCampaign = async (params: {
    prompt: string;
    sequenceType: 'single' | 'sequence';
    tone: string;
    brandName: string;
    targetAudience: string;
    objective: string;
  }) => {
    setIsGeneratingCampaign(true);
    try {
      const response = await fetch('/api/campaign/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate campaign');
      }

      // Format into our Campaign structure
      const formattedEmails: CampaignEmail[] = (data.emails || []).map((em: any, idx: number) => ({
        id: `gen-email-${idx + 1}-${Date.now()}`,
        sequenceStep: em.sequenceStep || `Email ${idx + 1}`,
        delayInfo: em.delayInfo || `Day ${idx * 2}`,
        subjectLines: em.subjectLines || [
          { text: 'Exciting news inside...', type: 'Benefit', predictedOpenRateScore: '89%' },
        ],
        selectedSubjectIndex: 0,
        preheader: em.preheader || '',
        heroTitle: em.heroTitle || 'Your Announcement',
        heroSubtitle: em.heroSubtitle || 'Discover the latest update',
        heroVisualPrompt: em.heroVisualPrompt || 'Modern commercial marketing visual, cinematic lighting, 4K',
        heroImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
        heroImageSize: '2K',
        bodyContent: em.bodyContent || {
          greeting: 'Hey {{first_name}},',
          intro: 'We are thrilled to bring you something special today.',
          keyBenefits: [
            { icon: '✨', title: 'Top Feature', description: 'Engineered for exceptional performance.' },
          ],
          offerBox: {
            badge: 'LIMITED TIME',
            headline: 'Special Access Granted',
            details: 'Take advantage before window closes.',
          },
          socialProof: {
            quote: '"Truly transformational product."',
            author: 'Happy Customer',
          },
          callToAction: {
            text: 'Explore Now →',
            url: 'https://example.com',
          },
          psLine: 'P.S. Spots are strictly limited.',
          signoff: 'Warmly,\nThe Team',
        },
        spamAnalysis: em.spamAnalysis || {
          deliverabilityScore: 96,
          rating: 'Optimal Deliverability',
          spamTriggers: [],
          deliverabilityTips: ['Clean sender reputation maintained.'],
        },
      }));

      const newCampaign: Campaign = {
        campaignTitle: data.campaignTitle || params.brandName || 'New Email Campaign',
        campaignSummary: data.campaignSummary || params.prompt,
        targetAudiencePersona: data.targetAudiencePersona || params.targetAudience || 'Target Subscribers',
        recommendedSchedule: data.recommendedSchedule || 'Day 0 -> Day 2 -> Day 4',
        emails: formattedEmails,
      };

      setCampaign(newCampaign);
      setActiveEmailIndex(0);
      setIsPromptModalOpen(false);
      setBannerNotice(`Generated "${newCampaign.campaignTitle}" with ${formattedEmails.length} email(s)!`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: any) {
      console.error('Error in handleGenerateCampaign:', err);
      alert(`Generation Error: ${err.message || 'Something went wrong.'}`);
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  // Handler to add a follow-up email to the sequence
  const handleAddEmailToSequence = () => {
    const nextStepNum = campaign.emails.length + 1;
    const newEmail: CampaignEmail = {
      id: `email-${nextStepNum}-${Date.now()}`,
      sequenceStep: `Email ${nextStepNum} of ${nextStepNum}: Final Follow-Up`,
      delayInfo: `Send Day ${nextStepNum * 2} • 11:00 AM`,
      selectedSubjectIndex: 0,
      subjectLines: [
        {
          text: `Quick follow-up regarding ${campaign.campaignTitle}`,
          type: 'Direct',
          predictedOpenRateScore: '89%',
        },
        {
          text: 'Did you get a chance to see this?',
          type: 'Curiosity',
          predictedOpenRateScore: '92%',
        },
        {
          text: 'Last reminder: Special allocation closing today',
          type: 'Urgency',
          predictedOpenRateScore: '94%',
        },
      ],
      preheader: 'Just wanted to make sure you didn’t miss out on this founder opportunity.',
      heroTitle: 'Still thinking it over?',
      heroSubtitle: 'We saved a VIP spot for you, but the allocation window closes soon.',
      heroVisualPrompt: 'A minimalist elegant desk setup with an iPad displaying confirmation screen, soft ambient desk lamp, cinematic, clean 4K product photography',
      heroImageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      heroImageSize: '2K',
      bodyContent: {
        greeting: 'Hey {{first_name}},',
        intro: "I know how fast inboxes fill up, so I wanted to pop back into your feed before our current batch closes down tonight.",
        keyBenefits: [
          {
            icon: '⚡',
            title: 'Immediate Access',
            description: 'No waiting period; instant onboarding and priority shipping.',
          },
          {
            icon: '🔒',
            title: 'Price Lock Guaranteed',
            description: 'Your promotional discount remains active as long as you stay subscribed.',
          },
        ],
        offerBox: {
          badge: 'FINAL EXTENSION',
          headline: 'Your Invitation Remains Reserved',
          details: 'Use code COLDRESERVE30 at checkout before midnight.',
          couponCode: 'COLDRESERVE30',
        },
        socialProof: {
          quote: '"The smoothest experience I have ever had. Would recommend in a heartbeat."',
          author: 'Verified Customer Review',
        },
        callToAction: {
          text: 'Claim Your Reserved Allocation →',
          url: 'https://example.com/checkout',
          subtext: 'Guaranteed 30-day risk-free satisfaction',
        },
        psLine: 'P.S. Have questions? Simply hit reply to this email and our team will answer directly.',
        signoff: 'Warmly,\nThe Team',
      },
      spamAnalysis: {
        deliverabilityScore: 97,
        rating: 'Optimal Deliverability',
        spamTriggers: [],
        deliverabilityTips: ['Follow-up formatting promotes high reply rates.'],
      },
    };

    setCampaign((prev) => ({
      ...prev,
      emails: [...prev.emails, newEmail],
    }));
    setActiveEmailIndex(campaign.emails.length);
  };

  // Handler for returning from the 3D game
  const handleGameReturn = (perkApplied?: string) => {
    setIsGameActive(false);
    if (perkApplied) {
      setBannerNotice(`🏆 ${perkApplied} successfully applied to your campaign!`);
      const boostedSubjects = activeEmail.subjectLines.map((sl) => {
        const currentVal = parseInt(sl.predictedOpenRateScore, 10) || 88;
        const newVal = Math.min(99, currentVal + 5);
        return {
          ...sl,
          predictedOpenRateScore: `${newVal}%`,
        };
      });
      handleUpdateActiveEmail({
        subjectLines: boostedSubjects,
        spamAnalysis: {
          ...activeEmail.spamAnalysis,
          deliverabilityScore: 100,
          rating: '100% Certified Primary Inbox',
        },
      });
      setTimeout(() => setBannerNotice(null), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 3D Deliverability Flight Game Mode */}
      {isGameActive && (
        <DeliverabilityFlightGame
          onReturnToStudio={handleGameReturn}
          campaignTitle={campaign.campaignTitle}
        />
      )}

      {/* Top Main Navigation Header */}
      <CampaignHeader
        campaign={campaign}
        activeEmail={activeEmail}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        onOpenNewPrompt={() => setIsPromptModalOpen(true)}
        onLaunchGame={() => setIsGameActive(true)}
      />

      {/* Multi-Email Sequence Tabs */}
      <SequenceTabs
        emails={campaign.emails}
        activeEmailIndex={activeEmailIndex}
        onSelectEmail={setActiveEmailIndex}
        onAddEmailToSequence={handleAddEmailToSequence}
      />

      {/* Floating Banner Notification */}
      {bannerNotice && (
        <div className="bg-indigo-600 text-white text-xs font-semibold py-2 px-4 text-center shadow-md animate-fade-in flex items-center justify-center space-x-2">
          <Sparkles className="h-4 w-4" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Campaign Meta Overview Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2 truncate">
            <span className="font-bold text-slate-200">{campaign.campaignTitle}</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline truncate max-w-lg">{campaign.campaignSummary}</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0 text-[11px]">
            <span className="flex items-center space-x-1">
              <Target className="h-3 w-3 text-indigo-400" />
              <span className="hidden sm:inline">Audience:</span>
              <span className="text-slate-300 font-medium truncate max-w-[150px]">{campaign.targetAudiencePersona}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-purple-400" />
              <span className="text-slate-300 font-medium">{campaign.recommendedSchedule}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Workbench Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Tools & Optimization Lab (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Subject Line & Preheader Lab */}
            <SubjectLineOptimizer
              subjectLines={activeEmail.subjectLines}
              selectedIndex={activeEmail.selectedSubjectIndex}
              preheader={activeEmail.preheader}
              onSelectSubject={(idx) => handleUpdateActiveEmail({ selectedSubjectIndex: idx })}
              onUpdateSubjectText={(idx, newText) => {
                const updated = [...activeEmail.subjectLines];
                updated[idx] = { ...updated[idx], text: newText };
                handleUpdateActiveEmail({ subjectLines: updated });
              }}
              onUpdatePreheader={(text) => handleUpdateActiveEmail({ preheader: text })}
              onAddSubjectLines={(newLines) => {
                handleUpdateActiveEmail({
                  subjectLines: [...activeEmail.subjectLines, ...newLines],
                });
              }}
            />

            {/* 2. Hero Visual Generator (gemini-3-pro-image-preview with 1K, 2K, 4K) */}
            <HeroImageGenerator
              initialPrompt={activeEmail.heroVisualPrompt}
              currentImageUrl={activeEmail.heroImageUrl}
              currentImageSize={activeEmail.heroImageSize || '2K'}
              onImageGenerated={handleImageGenerated}
            />

            {/* 3. Spam Deliverability Guard */}
            <SpamDeliverabilityAuditor
              spamAnalysis={activeEmail.spamAnalysis}
              emailBodyText={`${activeEmail.heroTitle} ${activeEmail.bodyContent.intro} ${activeEmail.bodyContent.psLine}`}
              onCleanSpamResult={(cleaned) => {
                handleUpdateActiveEmail({
                  bodyContent: {
                    ...activeEmail.bodyContent,
                    intro: cleaned,
                  },
                });
              }}
              onLaunchGame={() => setIsGameActive(true)}
            />

          </div>

          {/* RIGHT COLUMN: Interactive Email Preview Canvas (7 Cols) */}
          <div className="lg:col-span-7 h-full min-h-[750px]">
            <EmailPreviewCanvas
              email={activeEmail}
              campaignTitle={campaign.campaignTitle}
              onUpdateEmail={handleUpdateActiveEmail}
            />
          </div>

        </div>
      </main>

      {/* Multi-turn Gemini Chatbot Drawer */}
      <CopilotChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeEmail={activeEmail}
        campaignTitle={campaign.campaignTitle}
      />

      {/* New Campaign Generator Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onGenerate={handleGenerateCampaign}
        isLoading={isGeneratingCampaign}
      />

    </div>
  );
}
