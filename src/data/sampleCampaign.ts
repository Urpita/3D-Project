import { Campaign } from '../types/campaign';

export const SAMPLE_CAMPAIGN: Campaign = {
  campaignTitle: 'Artisan Reserve Cold Brew Subscription Launch',
  campaignSummary: 'A 3-part product launch and conversion sequence designed for discerning coffee enthusiasts, highlighting single-origin flavor, micro-batch steep technology, and a 30% founder discount.',
  targetAudiencePersona: 'Coffee connoisseurs, remote knowledge workers, and lifestyle professionals aged 25-45 looking for cafe-grade cold brew without morning friction.',
  recommendedSchedule: 'Day 0: Big Reveal & Founder Access -> Day 2: Taste Science & Customer Stories -> Day 4: Final 12-Hour VIP Pricing Window',
  emails: [
    {
      id: 'email-1',
      sequenceStep: 'Email 1 of 3: The VIP Unveiling',
      delayInfo: 'Send Day 0 • 9:00 AM',
      selectedSubjectIndex: 0,
      subjectLines: [
        {
          text: 'The 18-hour steep is over (and your mornings just changed)',
          type: 'Curiosity',
          predictedOpenRateScore: '92%',
        },
        {
          text: 'Exclusive VIP access: ColdCraft Single-Origin Cold Brew is live',
          type: 'Benefit',
          predictedOpenRateScore: '88%',
        },
        {
          text: 'First 500 batches only: Claim 30% off your annual reserve',
          type: 'Urgency',
          predictedOpenRateScore: '85%',
        },
        {
          text: '{{first_name}}, the cafe queue in your kitchen is officially gone',
          type: 'Personalized',
          predictedOpenRateScore: '90%',
        },
      ],
      preheader: 'Slow-steeped Ethiopian Yirgacheffe notes of dark chocolate and bergamot.',
      heroTitle: 'Your morning ritual, elevated to high art.',
      heroSubtitle: 'Handcrafted single-origin cold brew, steeped for 18 hours in organic micro-batches and shipped straight to your doorstep.',
      heroVisualPrompt: 'An artisan glass of iced cold brew coffee with swirling cream, amber ice cubes, dark roast coffee beans scattered on a rustic walnut wood table, warm golden morning sunbeam streaming through a loft window, cinematic lighting, ultra-sharp 4K commercial photography',
      heroImageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=80',
      heroImageSize: '2K',
      bodyContent: {
        greeting: 'Hey {{first_name}},',
        intro: "If you're anything like us, average coffee doesn't cut it anymore. Between burnt supermarket concentrates and 15-minute lines at specialty cafes, premium cold brew shouldn't feel like a compromise.",
        keyBenefits: [
          {
            icon: '☕',
            title: '18-Hour Nitrogen Slow-Steep',
            description: 'Zero bitter acidity, releasing natural notes of dark cocoa, dried cherries, and caramelized citrus.',
          },
          {
            icon: '🌿',
            title: '100% Organic Direct-Trade Beans',
            description: 'Sourced directly from high-altitude regenerative farms in Yirgacheffe and Huila.',
          },
          {
            icon: '❄️',
            title: 'Ready to Pour on Tap',
            description: 'Keep the eco-friendly airtight tap cooler chilled in your fridge for fresh pours on demand.',
          },
        ],
        offerBox: {
          badge: 'FOUNDING MEMBER LAUNCH OFFER',
          headline: '30% OFF Your First 3 Months of Reserve Cold Brew',
          details: 'Includes our complimentary insulated matte black traveler tumbler ($42 value). Ships fresh to your door every two weeks.',
          couponCode: 'COLDRESERVE30',
        },
        socialProof: {
          quote: '"Hands down the smoothest cold brew I have ever tasted. Rich, silky, zero stomach acidity."',
          author: 'Marcus Vance — Specialty Coffee Association Judge',
          metric: '4.9/5 from 820 early beta tasters',
        },
        callToAction: {
          text: 'Unlock 30% Off Your Cold Brew Reserve →',
          url: 'https://coldcraftcoffee.com/vip-reserve',
          subtext: 'Free shipping worldwide • Cancel or pause anytime in 1 click',
        },
        secondaryOffer: 'Want to try a single sampler flight first? Order the 3-Can Discovery Pack here.',
        psLine: 'P.S. We cap each harvest run at 500 monthly subscribers to preserve peak steep quality. Once this batch sells through, the next allocation won’t open until next month.',
        signoff: 'Julian & the ColdCraft Roastery Team\nBrooklyn, NY',
      },
      spamAnalysis: {
        deliverabilityScore: 98,
        rating: 'Optimal Deliverability',
        spamTriggers: [],
        deliverabilityTips: [
          'High text-to-image ratio guarantees fast email client rendering.',
          'Subject line under 60 characters is fully visible on iOS & Android lock screens.',
          'Personalization token {{first_name}} boosts open engagement rate by ~18%.',
        ],
      },
    },
    {
      id: 'email-2',
      sequenceStep: 'Email 2 of 3: The Science & Taste Test',
      delayInfo: 'Send Day 2 • 10:30 AM',
      selectedSubjectIndex: 0,
      subjectLines: [
        {
          text: 'Why our cold brew has 67% less acid than your regular brew',
          type: 'Curiosity',
          predictedOpenRateScore: '94%',
        },
        {
          text: 'The blind taste test that shocked 40 baristas',
          type: 'Benefit',
          predictedOpenRateScore: '89%',
        },
        {
          text: 'Still thinking about that first morning pour?',
          type: 'Personalized',
          predictedOpenRateScore: '86%',
        },
      ],
      preheader: 'The secret is sub-zero temperature filtration and 18-hour continuous extraction.',
      heroTitle: 'Why our steep hits differently.',
      heroSubtitle: 'Most commercial cold brews boil beans fast or use bitter chemical concentrates. Here is how we unlocked 67% less acid and 2x smoother body.',
      heroVisualPrompt: 'Laboratory precision glass flask with dripping cold brew droplets, coffee chemistry aesthetic, clean slate background, crisp studio lighting, macro photography',
      heroImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      heroImageSize: '1K',
      bodyContent: {
        greeting: 'Hey {{first_name}},',
        intro: "Ever get that afternoon stomach jitter from acidic office coffee? That's chlorogenic acid breaking down under heat. When we engineered ColdCraft, our goal was simple: peak caffeine punch with velvety smoothness.",
        keyBenefits: [
          {
            icon: '🔬',
            title: 'Cryo-Filtered Water Profile',
            description: 'Custom mineralized water crafted specifically to extract deep chocolate aromatics.',
          },
          {
            icon: '⚡',
            title: 'Clean, Sustained Energy',
            description: '200mg natural caffeine per 8oz pour without crashes or bitter heartburn.',
          },
          {
            icon: '📦',
            title: 'Smart Subscription Flexibility',
            description: 'Pause for vacation, change delivery cadence, or switch origins in our mobile app.',
          },
        ],
        offerBox: {
          badge: 'BATCH 01 ALLOCATION UPDATE',
          headline: 'Only 140 Founding Reserve Memberships Left',
          details: 'Your code COLDRESERVE30 remains active for 48 hours. Don’t miss your guaranteed slot in this roast batch.',
          couponCode: 'COLDRESERVE30',
        },
        socialProof: {
          quote: '"I stopped spending $7/day at Starbucks. This arrives at my door and tastes 10x better."',
          author: 'Sarah Chen — Senior Designer, San Francisco',
          metric: 'Over 12,000 mornings energized',
        },
        callToAction: {
          text: 'Claim Your Batch 01 Allocation Now →',
          url: 'https://coldcraftcoffee.com/vip-reserve',
          subtext: 'Backed by our 100% "Love Your First Cup" Money-Back Guarantee',
        },
        psLine: 'P.S. Need decaf or half-caff? We have limited organic Swiss Water Process reserve cans in stock too!',
        signoff: 'Julian & the ColdCraft Roastery Team',
      },
      spamAnalysis: {
        deliverabilityScore: 97,
        rating: 'Optimal Deliverability',
        spamTriggers: [],
        deliverabilityTips: [
          'Strong social proof elements increase average reader click-through rate.',
          'Clear button styling with high contrast ensures WCAG AA accessibility compliance.',
        ],
      },
    },
    {
      id: 'email-3',
      sequenceStep: 'Email 3 of 3: Last Call for Founding Pricing',
      delayInfo: 'Send Day 4 • 6:00 PM',
      selectedSubjectIndex: 1,
      subjectLines: [
        {
          text: 'Closing tonight: Your 30% founder discount expires at midnight',
          type: 'Urgency',
          predictedOpenRateScore: '96%',
        },
        {
          text: 'Final call: 23 founder slots remaining for Batch 01',
          type: 'Urgency',
          predictedOpenRateScore: '93%',
        },
        {
          text: 'Leaving this here for tomorrow morning...',
          type: 'Curiosity',
          predictedOpenRateScore: '88%',
        },
      ],
      preheader: 'Midnight deadline: Tumbler bonus and 30% discount are locking down.',
      heroTitle: 'Tonight at midnight, the doors close.',
      heroSubtitle: 'This is the final window to lock in 30% off your first 3 months and receive the complimentary matte black travel tumbler.',
      heroVisualPrompt: 'A sleek matte black insulated coffee tumbler beside an iced pour of cold brew coffee, dramatic moody dark background with amber rim lighting, luxury lifestyle product shot, 4K resolution',
      heroImageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80',
      heroImageSize: '4K',
      bodyContent: {
        greeting: 'Hey {{first_name}},',
        intro: "In just a few hours, we're locking down Batch 01 to start roast packaging and shipping out founding subscriber boxes.",
        keyBenefits: [
          {
            icon: '🎁',
            title: 'Free $42 Matte Black Tumbler Included',
            description: 'Double-wall vacuum insulated to keep your cold brew icy for 24+ hours.',
          },
          {
            icon: '🔒',
            title: 'Price Locked In',
            description: 'Save 30% across your first 3 deliveries, even if retail prices increase.',
          },
          {
            icon: '🛡️',
            title: 'Zero Risk Trial',
            description: 'If it isn’t the smoothest coffee of your life, we’ll refund your first box in full.',
          },
        ],
        offerBox: {
          badge: 'FINAL HOURS • EXPIRES 11:59 PM',
          headline: 'Code COLDRESERVE30 Expires Tonight',
          details: 'Automatic discount applied at checkout. Free 2-day insulated delivery included.',
          couponCode: 'COLDRESERVE30',
        },
        socialProof: {
          quote: '"Subscribing was the best morning routine decision I made all year."',
          author: 'David Kim — Founder & Marathoner',
        },
        callToAction: {
          text: 'Lock In Your 30% Off Before Midnight →',
          url: 'https://coldcraftcoffee.com/vip-reserve',
          subtext: 'Secure 256-bit SSL Checkout • One-click subscription management',
        },
        psLine: 'P.S. Once the clock strikes 12, code COLDRESERVE30 will deactivate and future orders return to standard $38/box pricing. See you on the other side!',
        signoff: 'Julian\nFounder, ColdCraft Coffee Co.',
      },
      spamAnalysis: {
        deliverabilityScore: 95,
        rating: 'Very Good Deliverability',
        spamTriggers: ['Expires Tonight'],
        deliverabilityTips: [
          'Urgency words balanced with high reputation sender domain avoids spam quarantine.',
        ],
      },
    },
  ],
};
