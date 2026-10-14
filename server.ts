import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini client with required User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Role definitions and system instructions for multi-turn chat
const CHATBOT_ROLES: Record<string, { model: string; systemInstruction: string; title: string; badge: string }> = {
  strategy_director: {
    model: 'gemini-4-argon',
    title: 'Senior Campaign Strategist',
    badge: 'Complex Reasoning (Gemini 4 Argon)',
    systemInstruction: `You are an elite Email Marketing Director & Customer Lifecycle Strategist.
Your expertise is in high-level campaign architecture, audience segmentation, conversion rate optimization (CRO), multi-touch attribution, and psychological triggers.
Analyze campaigns with rigorous strategic depth. When asked for recommendations, provide actionable, metric-driven rationale (expected lift, open rate impact, click-to-open ratios).
When you provide revisions for subject lines or email copy, format them clearly with distinct headers so the user can easily review and apply them.`,
  },
  copywriting_master: {
    model: 'gemini-3.8-flash',
    title: 'Master Email Copywriter',
    badge: 'General Copy & Creative (Gemini 3.8 Flash)',
    systemInstruction: `You are a world-renowned Direct Response Copywriter specializing in marketing emails.
You craft irresistible subject lines, curiosity hooks, emotional storytelling, vivid benefit framing, and high-converting calls-to-action.
You write in modern, human, non-slop prose that sounds authentic and drives action.
When suggesting alternative subject lines, provide 3-5 punchy variants categorized by angle (Curiosity, Benefit, Urgency, Contrast).
Always be constructive, creative, and ready to rewrite any section upon request.`,
  },
  speed_editor: {
    model: 'gemini-3.1-flash-lite',
    title: 'Rapid Polish & Deliverability Doctor',
    badge: 'Fast Tasks (Gemini 3.1 Flash Lite)',
    systemInstruction: `You are an ultra-fast email editor and deliverability specialist.
Your mission is rapid turnaround: fixing spam filter trigger words, trimming character counts for mobile previews, proofreading, punching up single sentences, and generating quick variations.
Provide direct, concise, zero-fluff edits immediately.`,
  },
};

/**
 * Endpoint 1: Generate Complete Email Campaign (Single Email or Multi-Email Sequence)
 */
app.post('/api/campaign/generate', async (req, res) => {
  try {
    const {
      prompt,
      sequenceType = 'single', // 'single' or 'sequence'
      tone = 'persuasive',
      brandName = '',
      targetAudience = '',
      objective = 'launch',
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Campaign prompt is required.' });
    }

    const emailCount = sequenceType === 'sequence' ? 3 : 1;

    const systemInstruction = `You are an expert email marketing generator.
Generate a high-converting, professional email marketing campaign based on the user's brief.
Number of emails to generate: ${emailCount}.
Tone: ${tone}.
Campaign Objective: ${objective}.
${brandName ? `Brand/Product: ${brandName}` : ''}
${targetAudience ? `Target Audience Persona: ${targetAudience}` : ''}

For each email, provide:
1. sequenceStep: e.g. "Email 1: The Announcement" or "Email 1 of 1"
2. delayInfo: e.g. "Send Day 0" or "Immediate"
3. subjectLines: 4 high-performing subject line options with tags (Curiosity, Urgency, Benefit, Direct) and predicted open rate score (e.g. "89%")
4. preheader: Under 85 characters, enticing curiosity snippet
5. heroTitle: Catchy header for the email body
6. heroSubtitle: 1-2 sentence compelling value proposition hook
7. heroVisualPrompt: A detailed, photorealistic or modern graphic prompt suitable for generating a striking email hero image with an AI image generator (specify subject, lighting, composition, colors, mood).
8. bodyContent:
   - greeting: e.g. "Hey there," or "Hi {{first_name}},"
   - intro: 2-3 engaging opening sentences that agitate the pain point or build excitement
   - keyBenefits: 3-4 distinct bullet points, each with a bold title and 1 sentence explanation
   - offerBox: The core offer or incentive (discount, trial, bonus, feature highlight)
   - socialProof: Short customer testimonial or credible statistic
   - callToAction: { text: string, url: string, subtext: string }
   - secondaryOffer: Optional softer second call-to-action or link
   - psLine: High-converting P.S. note creating gentle FOMO or answering a top objection
   - signoff: Name and role (e.g. "Alex Rivers, Founder")
9. spamScore: Deliverability analysis (0-100 score where 95+ is great, list of spam trigger words detected if any, and deliverability tips).`;

    const userPrompt = `Campaign Brief:
${prompt}

Please return the response strictly adhering to the JSON schema.`;

    // Using gemini-3.8-flash for general high quality generation
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            campaignTitle: { type: Type.STRING },
            campaignSummary: { type: Type.STRING },
            targetAudiencePersona: { type: Type.STRING },
            recommendedSchedule: { type: Type.STRING },
            emails: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sequenceStep: { type: Type.STRING },
                  delayInfo: { type: Type.STRING },
                  subjectLines: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        type: { type: Type.STRING },
                        predictedOpenRateScore: { type: Type.STRING },
                      },
                      required: ['text', 'type', 'predictedOpenRateScore'],
                    },
                  },
                  preheader: { type: Type.STRING },
                  heroTitle: { type: Type.STRING },
                  heroSubtitle: { type: Type.STRING },
                  heroVisualPrompt: { type: Type.STRING },
                  bodyContent: {
                    type: Type.OBJECT,
                    properties: {
                      greeting: { type: Type.STRING },
                      intro: { type: Type.STRING },
                      keyBenefits: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            icon: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                          },
                          required: ['icon', 'title', 'description'],
                        },
                      },
                      offerBox: {
                        type: Type.OBJECT,
                        properties: {
                          badge: { type: Type.STRING },
                          headline: { type: Type.STRING },
                          details: { type: Type.STRING },
                          couponCode: { type: Type.STRING },
                        },
                        required: ['badge', 'headline', 'details'],
                      },
                      socialProof: {
                        type: Type.OBJECT,
                        properties: {
                          quote: { type: Type.STRING },
                          author: { type: Type.STRING },
                          metric: { type: Type.STRING },
                        },
                        required: ['quote', 'author'],
                      },
                      callToAction: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          url: { type: Type.STRING },
                          subtext: { type: Type.STRING },
                        },
                        required: ['text', 'url'],
                      },
                      secondaryOffer: { type: Type.STRING },
                      psLine: { type: Type.STRING },
                      signoff: { type: Type.STRING },
                    },
                    required: ['greeting', 'intro', 'keyBenefits', 'offerBox', 'callToAction', 'psLine', 'signoff'],
                  },
                  spamAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                      deliverabilityScore: { type: Type.INTEGER },
                      rating: { type: Type.STRING },
                      spamTriggers: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      deliverabilityTips: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ['deliverabilityScore', 'rating', 'spamTriggers', 'deliverabilityTips'],
                  },
                },
                required: ['sequenceStep', 'delayInfo', 'subjectLines', 'preheader', 'heroTitle', 'heroSubtitle', 'heroVisualPrompt', 'bodyContent', 'spamAnalysis'],
              },
            },
          },
          required: ['campaignTitle', 'campaignSummary', 'targetAudiencePersona', 'recommendedSchedule', 'emails'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating campaign:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate campaign',
      details: error.toString(),
    });
  }
});

/**
 * Endpoint 2: High-Quality Image Generation
 * Uses model gemini-3-pro-image-preview with 1K, 2K, 4K resolution options
 */
app.post('/api/image/generate', async (req, res) => {
  try {
    const {
      prompt,
      imageSize = '1K', // '1K' | '2K' | '4K'
      aspectRatio = '16:9', // '16:9' | '1:1' | '4:3' | '3:2'
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    // Validate size affordance
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    // Model required: gemini-3-pro-image-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `High quality marketing visual for an email campaign: ${prompt}. Professional studio commercial lighting, modern aesthetic, ultra sharp details, clean composition.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: chosenSize as any,
        },
      },
    });

    let imageUrl: string | null = null;
    let textFeedback: string | null = null;

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          textFeedback = part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image data returned from image generation model.',
        details: textFeedback,
      });
    }

    return res.json({
      imageUrl,
      modelUsed: 'gemini-3-pro-image-preview',
      imageSize: chosenSize,
      aspectRatio,
    });
  } catch (error: any) {
    console.error('Error generating image with gemini-3-pro-image-preview:', error);
    return res.status(500).json({
      error: error.message || 'Image generation failed',
      details: error.toString(),
    });
  }
});

/**
 * Endpoint 3: Multi-turn Chatbot Interface
 * Supports conversation history, scrollable thread, specific roles:
 * - gemini-4-argon for complex tasks (strategy, CRO, funnel design)
 * - gemini-3.8-flash for general tasks (creative copy, newsletter structure)
 * - gemini-3.1-flash-lite for fast tasks (deliverability check, subject line trimming, quick fixes)
 */
app.post('/api/chat/message', async (req, res) => {
  try {
    const {
      messages, // Array of { role: 'user' | 'model', content: string }
      roleId = 'strategy_director', // 'strategy_director' | 'copywriting_master' | 'speed_editor'
      taskType = 'general', // 'complex' | 'general' | 'fast'
      currentEmailSummary = '',
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Determine model and system instruction based on role or taskType
    let selectedRole = CHATBOT_ROLES[roleId] || CHATBOT_ROLES.copywriting_master;

    if (taskType === 'complex') {
      selectedRole = CHATBOT_ROLES.strategy_director;
    } else if (taskType === 'fast') {
      selectedRole = CHATBOT_ROLES.speed_editor;
    }

    // Enrich system instruction with active email context
    const enrichedSystemInstruction = `${selectedRole.systemInstruction}

ACTIVE EMAIL CONTEXT IN WORKBENCH:
${currentEmailSummary ? currentEmailSummary : 'No active campaign loaded yet.'}

Guidelines:
- If the user asks you to rewrite or create an element (e.g. subject lines, CTA button, paragraph, offer), provide the improved copy clearly.
- Highlight suggested changes in easy-to-read blocks.`;

    // Map conversation history into Gemini format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedRole.model,
      contents,
      config: {
        systemInstruction: enrichedSystemInstruction,
      },
    });

    const replyText = response.text || 'I could not generate a response.';

    return res.json({
      role: 'model',
      content: replyText,
      modelUsed: selectedRole.model,
      roleTitle: selectedRole.title,
    });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      error: error.message || 'Chat generation failed',
      details: error.toString(),
    });
  }
});

/**
 * Endpoint 4: Fast Refinement / Punch-up
 * e.g. Instant spam words cleanup or 5 alternate subject lines using gemini-3.1-flash-lite
 */
app.post('/api/campaign/quick-action', async (req, res) => {
  try {
    const { action, text, context = '' } = req.body;

    let prompt = '';
    let model = 'gemini-3.1-flash-lite'; // Fast model for quick edits

    if (action === 'clean_spam') {
      prompt = `Review this email copy and rewrite it to eliminate spam trigger words (like "100% FREE", "ACT NOW", excessive exclamation marks, spammy claims) while retaining high conversion persuasion:
Original Copy:
${text}

Return only the polished, deliverability-safe version.`;
    } else if (action === 'subject_lines') {
      prompt = `Generate 5 high-converting email subject lines for this campaign context: ${context || text}.
Include a mix of: 1) Curiosity gap, 2) Direct benefit, 3) Urgency/FOMO, 4) Ultra-short (under 30 chars), 5) Personalized.
Return as a clean numbered list with tags.`;
    } else if (action === 'shorten') {
      prompt = `Tighten this email body copy to make it 30% more concise and punchy for mobile skimmers without losing key benefits:
${text}`;
    } else {
      prompt = `Improve this email marketing text: ${text}`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return res.json({
      result: response.text || '',
      modelUsed: model,
    });
  } catch (error: any) {
    console.error('Error in quick-action:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Configure Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampaignForge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
