export const dynamic = 'force-dynamic';

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import connectToDatabase from "@/lib/mongoose";
import PersonalInfo from "@/models/personalInfo";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const google = createGoogleGenerativeAI({ apiKey });

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const {
      name,
      phoneNumber,
      aadhaarId,
      age,
      gender,
      occupation,
      education,
      maritalStatus,
      numberOfChildren,
      numberOfGirlChildrenUnder10,
      landOwnershipAcres,
      monthlyIncome,
      digitalUsage,
      address,
      location,
      area
    } = body;

    // --- Deterministic Rules & Weighted Scoring Engine ---
    const recommendations = [];

    // 1. Sukanya Samriddhi Yojana (SSA)
    if (gender === 'Female' && age <= 10) {
      const score = Math.min(98, 90 + (monthlyIncome < 15000 ? 8 : 2));
      recommendations.push({
        schemeCode: 'SSA',
        name: 'Sukanya Samriddhi Yojana (SSA)',
        score,
        drivers: ['✔ Target gender (Female)', '✔ Age is under 10', '✔ High interest savings (8.2%)']
      });
    } else if (numberOfGirlChildrenUnder10 > 0) {
      const score = Math.min(98, 88 + (monthlyIncome < 15000 ? 8 : 2));
      recommendations.push({
        schemeCode: 'SSA',
        name: 'Sukanya Samriddhi Yojana (SSA)',
        score,
        drivers: ['✔ Has girl child under 10', '✔ High interest savings (8.2%)', '✔ Tax deduction under Section 80C']
      });
    }

    // 2. Senior Citizen Savings Scheme (SCSS)
    if (age >= 60) {
      const score = Math.min(98, 88 + (digitalUsage === 'Low' ? 8 : 3));
      recommendations.push({
        schemeCode: 'SCSS',
        name: 'Senior Citizen Savings Scheme (SCSS)',
        score,
        drivers: ['✔ Age is 60+ (Senior Citizen)', '✔ High regular interest payouts (8.2%)', '✔ Sovereign security backing']
      });
    }

    // 3. Kisan Credit Card (KCC)
    if (occupation?.toLowerCase() === 'agriculture' || landOwnershipAcres > 0) {
      const score = Math.min(98, 85 + (landOwnershipAcres > 5 ? 10 : 3));
      recommendations.push({
        schemeCode: 'KCC',
        name: 'Kisan Credit Card (KCC)',
        score,
        drivers: ['✔ Owns agricultural land', '✔ Low-interest cultivation loans (7.0%)', '✔ Repayment aligned to harvest cycles']
      });
    }

    // 4. Public Provident Fund (PPF)
    if (age >= 18 && monthlyIncome > 15000) {
      const score = Math.min(98, 80 + (digitalUsage === 'High' ? 10 : 5));
      recommendations.push({
        schemeCode: 'PPF',
        name: 'Public Provident Fund (PPF)',
        score,
        drivers: ['✔ Age is 18+', '✔ Tax-free interest and maturity (7.1%)', '✔ Long-term wealth compounding']
      });
    }

    // 5. Recurring Deposit Scheme (RD)
    if (age >= 10) {
      const score = Math.min(95, 75 + (digitalUsage !== 'Low' ? 10 : 5));
      recommendations.push({
        schemeCode: 'RD',
        name: 'Recurring Deposit Scheme (RD)',
        score,
        drivers: ['✔ Age is 10+', '✔ Fixed monthly savings starting from ₹100', '✔ Safe compound interest (6.7%)']
      });
    }

    // 6. Post Office Savings Account (POSA)
    const posaScore = Math.min(95, 70 + (monthlyIncome < 10000 ? 15 : 5));
    recommendations.push({
      schemeCode: 'POSA',
      name: 'Post Office Savings Account (POSA)',
      score: posaScore,
      drivers: ['✔ Liquidity and safety', '✔ Low minimum balance of ₹500', '✔ Tax-free interest up to ₹10,000']
    });

    // 7. Mahila Samman Savings Certificate
    if (gender === 'Female' && age >= 18) {
      const score = Math.min(98, 82 + (monthlyIncome < 20000 ? 10 : 4));
      recommendations.push({
        schemeCode: 'MSSC',
        name: 'Mahila Samman Savings Certificate',
        score,
        drivers: ['✔ Target gender (Female)', '✔ Fixed 2-year tenure (7.5%)', '✔ Partial withdrawal option']
      });
    }

    // 8. Atal Pension Yojana (APY)
    if (age >= 18 && age <= 40) {
      const score = Math.min(98, 80 + (occupation?.toLowerCase() === 'agriculture' || occupation?.toLowerCase() === 'self-employed' ? 12 : 3));
      recommendations.push({
        schemeCode: 'APY',
        name: 'Atal Pension Yojana (APY)',
        score,
        drivers: ['✔ Age is between 18 and 40', '✔ Guaranteed pension after 60', '✔ Low-cost social security coverage']
      });
    }

    // Sort recommendations by score descending
    recommendations.sort((a, b) => b.score - a.score);
    const topRecommendations = recommendations.slice(0, 3);

    // Make sure we have 3 recommendations (pad with POSA/RD if needed)
    while (topRecommendations.length < 3) {
      topRecommendations.push({
        schemeCode: 'POSA',
        name: 'Post Office Savings Account (POSA)',
        score: 70,
        drivers: ['✔ Basic safe savings account']
      });
    }

    // --- AI Explainability Layer via Gemini ---
    let explanations = {};
    try {
      const explanationPrompt = `
You are the FinVista Decision Support System assistant. Explain why the following 3 post office schemes are recommended for a citizen with these attributes:
- Name: ${name || 'Citizen'}
- Age: ${age}
- Gender: ${gender}
- Occupation: ${occupation}
- Income: ₹${monthlyIncome}/month
- Land ownership: ${landOwnershipAcres} acres
- Children: ${numberOfChildren} (Girl children under 10: ${numberOfGirlChildrenUnder10})
- Digital usage: ${digitalUsage}

Top Recommended Schemes:
1. ${topRecommendations[0].name} (Score: ${topRecommendations[0].score}/100)
2. ${topRecommendations[1].name} (Score: ${topRecommendations[1].score}/100)
3. ${topRecommendations[2].name} (Score: ${topRecommendations[2].score}/100)

Write a short, professional, and convincing explainability paragraph (1-2 sentences) for EACH of the three schemes. Present it as direct advice to the postal official on why this matches the beneficiary's needs.
Return your answer as a JSON object strictly matching this format (no markdown blocks, just raw JSON):
{
  "explanation1": "[Explanation for scheme 1]",
  "explanation2": "[Explanation for scheme 2]",
  "explanation3": "[Explanation for scheme 3]"
}
`;

      const response = await generateText({
        model: google('gemini-2.0-flash'),
        prompt: explanationPrompt,
      });

      // Try parsing the JSON
      let text = response.text.trim();
      // Strip markdown code fences if Gemini added them
      if (text.startsWith("```")) {
        const matches = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (matches && matches[1]) {
          text = matches[1].trim();
        }
      }
      explanations = JSON.parse(text);
    } catch (err) {
      console.error("Gemini Explanation Generation failed, using fallbacks:", err);
      explanations = {
        explanation1: `${topRecommendations[0].name} matches the applicant's age profile of ${age} and financial capacity.`,
        explanation2: `${topRecommendations[1].name} is a stable option for their ${occupation} background.`,
        explanation3: `${topRecommendations[2].name} provides secondary savings and liquidity support.`
      };
    }

    // Attach explanations to top recommendations
    topRecommendations[0].explanation = explanations.explanation1;
    topRecommendations[1].explanation = explanations.explanation2;
    topRecommendations[2].explanation = explanations.explanation3;

    // --- Auto-Save New Citizen to Database ---
    if (aadhaarId) {
      const aadhaarNum = Number(aadhaarId);
      const existing = await PersonalInfo.findOne({ aadhaar_id: aadhaarNum });
      
      if (!existing) {
        console.log(`Aadhaar ${aadhaarId} not found, auto-creating citizen record...`);
        const newRecord = new PersonalInfo({
          Name: name || 'Unknown Citizen',
          PhoneNumber: phoneNumber || 'N/A',
          aadhaar_id: aadhaarNum,
          Age: Number(age),
          Gender: gender,
          Location: location || 'Erode',
          Area: area || 'Arasur',
          MaritalStatus: maritalStatus || 'Single',
          Occupation: occupation || 'Other',
          MonthlyIncome: Number(monthlyIncome),
          EducationLevel: education || 'Secondary',
          NoOfChildrenInTheHouse: Number(numberOfChildren || 0),
          NoOfGirlChildrenUnder10: Number(numberOfGirlChildrenUnder10 || 0),
          OwnLandForAgriculture: landOwnershipAcres > 0 ? 'Yes' : 'No',
          DigitalUsage: digitalUsage || 'Medium',
          CreditScore: 700,
          BankAccount: 'Yes',
          AlreadyInLoan: 'No',
          NeedNewLoan: 'No',
          TaxPayer: monthlyIncome > 25000 ? 'Yes' : 'No',
          NeedEducationLoan: 'No',
          RecommendedSchemes: topRecommendations.map(r => r.name),
          RecommendedScheme1: topRecommendations[0].name,
          RecommendedScheme2: topRecommendations[1].name,
          RecommendedScheme3: topRecommendations[2].name,
          Scheme1: 0,
          Scheme2: 0,
          Scheme3: 0,
          DaysLeftScheme1: 30,
          DaysLeftScheme2: 60,
          DaysLeftScheme3: 90,
          DateOfBirth: new Date(2026 - age, 5, 15).toISOString().split('T')[0],
          GirlChildAges: numberOfGirlChildrenUnder10 > 0 ? 5 : 0
        });
        await newRecord.save();
        console.log('Citizen created successfully.');
      }
    }

    return new Response(JSON.stringify({
      success: true,
      recommendations: topRecommendations
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
