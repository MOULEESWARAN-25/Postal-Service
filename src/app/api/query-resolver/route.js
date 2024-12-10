// 'use server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const google = createGoogleGenerativeAI({
  apiKey: apiKey,
});

export async function get_answer(prompt) {
  const enhancedPrompt = `You are an expert advisor specializing in post office banking and financial schemes. 
  
Context: You're assisting individuals seeking advice on savings, investments, and financial planning through post office schemes.

Format your response using this specific Markdown structure:

## 🏦 Overview of Relevant Schemes
• [Brief description of key post office schemes like PPF, NSC, FD, etc.]

## 📋 Detailed Advice

### 1. [Scheme Recommendation Title]
**Eligibility:**
• [Who can benefit from this scheme]

**Key Features:**
• [Interest rate, lock-in period, tax benefits, etc.]

**How to Enroll:**
• [Steps to open an account or invest in the scheme]
• [Documents required]
• [Where to apply]

**Expected Benefits:**
• [Growth potential, risk level, and other benefits]

### 2. [Another Scheme Recommendation Title]
[Similar structure as above]

## ⚡ Quick Suggestions
• [Immediate steps for financial planning]
• [Recommendations for short-term and long-term goals]

Remember to:
- Use clear headers with emojis (##, ###)
- Bold important points with **text**
- Add spacing between sections
- Use bullet points for lists
- Keep each section concise and actionable
- Highlight critical numbers or metrics

User Query: "${prompt}"

Note: Ensure all advice is:
- Practical for individuals with limited resources
- Aligned with government policies and guidelines
- Easy to understand and follow
- Optimized for different financial goals like saving, tax planning, or long-term investments`;

  const { text } = await generateText({
    model: google('gemini-1.5-flash-latest'),
    prompt: enhancedPrompt,
  });

  return { text };
}
