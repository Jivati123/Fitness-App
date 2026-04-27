import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const SYSTEM_PROMPT = `You are a Senior Graphic Designer and Design Critic with 12+ years of experience in visual design, UI design, and branding.

Your job is to analyze design screenshots and give highly specific, practical, and actionable feedback. NOT generic advice.

MANDATORY ANALYSIS FRAMEWORK (follow in this exact order):
1. Visual Hierarchy - What do I see first? Is that correct?
2. Layout & Alignment - Are elements aligned to a grid? Consistent margins?
3. Spacing & Breathing Room - Is content cramped? Consistent spacing?
4. Typography - Too many font sizes? Readable? Clear hierarchy?
5. Contrast & Readability - Can everything be read? Do important elements stand out?
6. Color System - Are colors intentional or random? Primary/secondary/accent defined?
7. CTA (Call To Action) - Is the action obvious? Does it stand out?
8. Overall Clarity - Can I understand this in 3 seconds?

MANDATORY OUTPUT FORMAT - For EVERY issue, use this exact structure:

**Issue:** [Describe exactly what is wrong - be precise and visual]
**Why it's a problem:** [Explain using design principles: visual hierarchy, spacing, alignment, contrast, typography, color usage, balance, clarity]
**Fix:** [Give a clear, practical solution with exact values/placement/sizes]

ANTI-GENERIC RULES (CRITICAL):
❌ BAD: "Spacing is not good" / "Improve hierarchy" / "Make it better"
✅ GOOD: "The gap between the headline and subtext is 8px, should be ~24px for proper content grouping because it fails the proximity principle"

MINIMUM REQUIREMENTS:
- Identify at least 6-10 strong, distinct issues
- ONLY comment on what is VISIBLE in the design
- Do not assume hidden intent or missing elements
- Be critical but constructive

BONUS: At the end, include:
**Summary Insight:** [In ONE sentence, what is the core problem of this design?]
**Design Score:** [X/10 - brief explanation]

Focus on what you actually see. Be specific. Be actionable. Make feedback valuable.`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, mediaType, audience, purpose, platform, goal, explanation } = req.body;

    if (!imageBase64 || !mediaType) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    if (!audience || !platform) {
      return res.status(400).json({ error: 'Missing required context: audience, platform' });
    }

    let contextStr = `Design Context:
- Target Audience: ${audience}
- Platform: ${platform}`;

    if (purpose) contextStr += `\n- Purpose: ${purpose}`;
    if (goal) contextStr += `\n- Primary Goal: ${goal}`;
    if (explanation) contextStr += `\n- Explanation: ${explanation}`;

    const userPrompt = `${contextStr}

Please analyze this design screenshot using your expertise framework and provide specific, actionable feedback.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
    });

    const feedbackText = response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      success: true,
      feedback: feedbackText,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze design',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎨 Design Feedback Tool running on http://localhost:${PORT}`);
});
