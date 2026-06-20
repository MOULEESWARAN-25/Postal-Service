export const dynamic = 'force-dynamic';

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongoose";
import PersonalInfo from "@/models/personalInfo";
import { validateMetricsGrounding } from "@/lib/llmValidator";

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
    const currentTimestamp = new Date().toISOString().split('T')[0];

    const safeIncome = Number(monthlyIncome || 0);
    const safeAge = Number(age || 18);
    const safeLand = Number(landOwnershipAcres || 0);
    const safeChildren = Number(numberOfChildren || 0);
    const safeGirls = Number(numberOfGirlChildrenUnder10 || 0);

    // 1. Sukanya Samriddhi Account (SSA)
    if (gender === 'Female' && safeAge <= 10) {
      recommendations.push({
        schemeCode: 'SSA',
        name: 'Sukanya Samriddhi Account (SSA)',
        score: Math.min(98, 90 + (safeIncome < 15000 ? 8 : 2)),
        drivers: ['✔ Target gender (Female)', '✔ Age is under 10', '✔ High interest savings (8.2%)'],
        expectedImpact: 'Maturity benefits for child education/marriage goals',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    } else if (safeGirls > 0) {
      recommendations.push({
        schemeCode: 'SSA',
        name: 'Sukanya Samriddhi Account (SSA)',
        score: Math.min(98, 88 + (safeIncome < 15000 ? 8 : 2)),
        drivers: ['✔ Has girl child under 10', '✔ High interest savings (8.2%)', '✔ Tax deduction under Section 80C'],
        expectedImpact: 'Maturity benefits for child education/marriage goals',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 2. Post Office Savings Account (SB)
    recommendations.push({
      schemeCode: 'SB',
      name: 'Post Office Savings Account (SB)',
      score: Math.min(95, 75 + (safeAge >= 10 ? 15 : 5)),
      drivers: ['✔ Universal savings access', '✔ Minimal opening balance (₹500)', '✔ Sovereign liquidity guarantee'],
      expectedImpact: 'Basic savings repository and DBT links',
      source: 'Personal Profile DB + Scheme Rules',
      lastUpdated: currentTimestamp
    });

    // 3. National Savings Recurring Deposit (RD)
    recommendations.push({
      schemeCode: 'RD',
      name: 'National Savings Recurring Deposit (RD)',
      score: Math.min(95, 70 + (safeIncome < 20000 ? 15 : 5) + (safeAge >= 10 ? 5 : 0)),
      drivers: ['✔ Regular savings starting from ₹100/month', '✔ Safe fixed compound yield (6.7%)', '✔ Short-term 5-year lock-in'],
      expectedImpact: 'Guaranteed lump sum corpus at maturity',
      source: 'Personal Profile DB + Scheme Rules',
      lastUpdated: currentTimestamp
    });

    // 4. National Savings Time Deposit (TD)
    recommendations.push({
      schemeCode: 'TD',
      name: 'National Savings Time Deposit (TD)',
      score: Math.min(95, 65 + (occupation?.toLowerCase() === 'salaried' ? 15 : 5) + (safeIncome >= 15000 ? 10 : 0)),
      drivers: ['✔ Guaranteed fixed returns (1 to 5 years)', '✔ Higher interest than basic savings', '✔ Section 80C benefits for 5-year lock-in'],
      expectedImpact: 'Capital preservation and fixed income growth',
      source: 'Personal Profile DB + Scheme Rules',
      lastUpdated: currentTimestamp
    });

    // 5. Monthly Income Scheme (MIS)
    if (safeAge >= 50 || safeIncome > 20000) {
      recommendations.push({
        schemeCode: 'MIS',
        name: 'Monthly Income Scheme (MIS)',
        score: Math.min(95, 60 + (safeAge >= 60 ? 25 : 10)),
        drivers: ['✔ Regular monthly interest payouts', '✔ Low-risk sovereign capital guarantee', '✔ Suitable for retired segments'],
        expectedImpact: 'Regular monthly post-retirement payouts',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 6. Public Provident Fund (PPF)
    if (safeAge >= 18) {
      recommendations.push({
        schemeCode: 'PPF',
        name: 'Public Provident Fund (PPF)',
        score: Math.min(98, 70 + (occupation?.toLowerCase() === 'salaried' ? 18 : 5) + (safeIncome >= 25000 ? 8 : 0)),
        drivers: ['✔ Long-term compounding wealth asset', '✔ EEE tax exemptions (interest & maturity)', '✔ Sovereign-backed 15-year tenure'],
        expectedImpact: 'Tax-exempt long-term compounding corpus',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 7. Senior Citizens Savings Scheme (SCSS)
    if (safeAge >= 60) {
      recommendations.push({
        schemeCode: 'SCSS',
        name: 'Senior Citizens Savings Scheme (SCSS)',
        score: Math.min(98, 88 + (digitalUsage === 'Low' ? 8 : 3)),
        drivers: ['✔ Age is 60+ (Senior Citizen)', '✔ High regular interest yield (8.2%)', '✔ Sovereign security backing'],
        expectedImpact: 'Quarterly regular retirement income payouts',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 8. National Savings Certificate (NSC)
    if (safeAge >= 10) {
      recommendations.push({
        schemeCode: 'NSC',
        name: 'National Savings Certificate (NSC)',
        score: Math.min(95, 65 + (occupation?.toLowerCase() === 'salaried' ? 15 : 5)),
        drivers: ['✔ Guaranteed 5-year yield (7.7%)', '✔ Tax deduction under Section 80C', '✔ Acceptable as bank collateral'],
        expectedImpact: 'Fixed-income capital protection asset',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 9. Kisan Vikas Patra (KVP)
    if (occupation?.toLowerCase() === 'agriculture' || safeLand > 0) {
      recommendations.push({
        schemeCode: 'KVP',
        name: 'Kisan Vikas Patra (KVP)',
        score: Math.min(96, 75 + (safeLand > 2 ? 15 : 5)),
        drivers: ['✔ Capital doubles over fixed tenure', '✔ Rural agrarian segment focus', '✔ Safe sovereign asset growth'],
        expectedImpact: 'Simple capital doubling security',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 10. Mahila Samman Savings Certificate (MSSC)
    if (gender === 'Female') {
      recommendations.push({
        schemeCode: 'MSSC',
        name: 'Mahila Samman Savings Certificate (MSSC)',
        score: Math.min(98, 80 + (safeIncome < 20000 ? 10 : 5)),
        drivers: ['✔ Target gender (Female)', '✔ High-interest 2-year tenure (7.5%)', '✔ Accords women independent wealth'],
        expectedImpact: 'High-interest 2-year fixed saving for women',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 11. PM CARES for Children Scheme
    if (safeAge < 18) {
      recommendations.push({
        schemeCode: 'PMCARES',
        name: 'PM CARES for Children Scheme',
        score: 40,
        drivers: ['✔ Target cohort (Minors)', '✔ Sovereign support link', '✔ Educational backing options'],
        expectedImpact: 'Casework-basis minor rehabilitation support',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 12. Regular Savings Account (IPPB)
    recommendations.push({
      schemeCode: 'IPPB_REG',
      name: 'Regular Savings Account (IPPB)',
      score: Math.min(95, 60 + (digitalUsage === 'High' ? 20 : 10) + (safeAge >= 10 ? 10 : 0)),
      drivers: ['✔ Digital-first doorstep banking', '✔ KYC link (Aadhaar & PAN)', '✔ Convenient app interface for utility bills'],
      expectedImpact: 'Dynamic transaction and mobile utility link',
      source: 'Personal Profile DB + Scheme Rules',
      lastUpdated: currentTimestamp
    });

    // 13. Basic Savings Account (IPPB)
    recommendations.push({
      schemeCode: 'IPPB_BAS',
      name: 'Basic Savings Account (IPPB)',
      score: Math.min(95, 65 + (digitalUsage === 'Low' ? 15 : 5) + (safeIncome < 12000 ? 10 : 0)),
      drivers: ['✔ Zero minimum balance account', '✔ Simplifies DBT subsidy receipt', '✔ Direct local sweep options to POSB'],
      expectedImpact: 'Zero-fee subsidy sweep account',
      source: 'Personal Profile DB + Scheme Rules',
      lastUpdated: currentTimestamp
    });

    // 14. DigiSmart Savings Account (IPPB)
    if (safeAge >= 18) {
      recommendations.push({
        schemeCode: 'IPPB_DIGI',
        name: 'DigiSmart Savings Account (IPPB)',
        score: Math.min(96, 50 + (safeAge <= 30 ? 25 : 5) + (digitalUsage === 'High' ? 15 : 0)),
        drivers: ['✔ Target youth (18+ app users)', '✔ Cashbacks and zero-fee sweeps', '✔ Direct online card links'],
        expectedImpact: 'Modern mobile-first transaction account',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 15. Premium Savings Account (IPPB)
    if (safeAge >= 10 && safeIncome > 18000) {
      recommendations.push({
        schemeCode: 'IPPB_PREM',
        name: 'Premium Savings Account (IPPB)',
        score: Math.min(95, 45 + (digitalUsage === 'High' ? 25 : 10)),
        drivers: ['✔ Value-added premium cashback benefits', '✔ Zero charges on sweeps and cashouts', '✔ Premium support access'],
        expectedImpact: 'High-benefit transactional current sweeps',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 16. Premium Aarogya Savings Account (IPPB)
    if (safeAge >= 10) {
      recommendations.push({
        schemeCode: 'IPPB_AAR',
        name: 'Premium Aarogya Savings Account (IPPB)',
        score: Math.min(95, 40 + (safeAge >= 40 ? 20 : 5) + (safeIncome > 15000 ? 15 : 5)),
        drivers: ['✔ Bundled telehealth consultations', '✔ Wellness and medical discounts', '✔ Inbuilt accidental insurance'],
        expectedImpact: 'Combined healthcare accessibility and banking',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 17. SHG Savings Account (IPPB)
    if (occupation?.toLowerCase() === 'self-employed' || occupation?.toLowerCase() === 'agriculture') {
      recommendations.push({
        schemeCode: 'IPPB_SHG',
        name: 'SHG Savings Account (IPPB)',
        score: Math.min(96, 60 + (gender === 'Female' ? 20 : 5)),
        drivers: ['✔ Targeted at rural micro-entrepreneurs', '✔ Supports group Self-Help collections', '✔ Links directly to small business credit'],
        expectedImpact: 'Collective entrepreneurial group account',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 18. Current Account (IPPB)
    if (occupation?.toLowerCase() === 'self-employed' || safeIncome > 20000) {
      recommendations.push({
        schemeCode: 'IPPB_CURR',
        name: 'Current Account (IPPB)',
        score: Math.min(95, 55 + (occupation?.toLowerCase() === 'self-employed' ? 25 : 10)),
        drivers: ['✔ Unlimited deposit and withdrawal limits', '✔ Integrated merchant QR payments', '✔ Streamlines business cashflow'],
        expectedImpact: 'Merchant and retail business support account',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 19. Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)
    if (safeAge >= 18 && safeAge <= 50) {
      recommendations.push({
        schemeCode: 'PMJJBY',
        name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
        score: Math.min(97, 75 + (safeIncome < 20000 ? 12 : 4)),
        drivers: ['✔ Earning age cohort (18-50)', '✔ Low-cost term life insurance (₹2 Lakh for ₹436/yr)', '✔ Auto-debit ease from savings'],
        expectedImpact: 'Term life cover backing for family safety',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 20. Pradhan Mantri Suraksha Bima Yojana (PMSBY)
    if (safeAge >= 18 && safeAge <= 70) {
      recommendations.push({
        schemeCode: 'PMSBY',
        name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
        score: Math.min(97, 80 + (safeIncome < 25000 ? 10 : 3)),
        drivers: ['✔ Adult age cohort (18-70)', '✔ Highly affordable accident cover (₹2 Lakh for ₹20/yr)', '✔ Automatic payment ease'],
        expectedImpact: 'Accidental disability and demise safety net',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // 21. Atal Pension Yojana (APY)
    if (safeAge >= 18 && safeAge <= 40) {
      recommendations.push({
        schemeCode: 'APY',
        name: 'Atal Pension Yojana (APY)',
        score: Math.min(98, 70 + (occupation?.toLowerCase() === 'agriculture' || safeIncome < 15000 ? 18 : 5)),
        drivers: ['✔ Age is between 18 and 40', '✔ Guaranteed pension after 60 (₹1k-5k/month)', '✔ Designed for unorganized sector labor'],
        expectedImpact: 'Lifetime regular retirement pension support',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // Sort recommendations by score descending
    recommendations.sort((a, b) => b.score - a.score);
    const topRecommendations = recommendations.slice(0, 3);

    // Make sure we have 3 recommendations (pad with SB/RD if needed)
    while (topRecommendations.length < 3) {
      topRecommendations.push({
        schemeCode: 'SB',
        name: 'Post Office Savings Account (SB)',
        score: 70,
        drivers: ['✔ Basic safe savings account'],
        expectedImpact: 'Basic savings repository',
        source: 'Personal Profile DB + Scheme Rules',
        lastUpdated: currentTimestamp
      });
    }

    // --- AI Explainability Layer via Gemini ---
    let explanations = {};
    try {
      const explanationPrompt = `
ROLE: You are the India Post DSS decision-support assistant. Your role is to explain the scheme recommendations generated by the core Recommendation Engine.

CONTEXT:
Explain recommendations for citizen ${name || 'Citizen'} with these attributes:
- Age: ${age}
- Gender: ${gender}
- Occupation: ${occupation}
- Income: ₹${monthlyIncome}/month
- Land ownership: ${landOwnershipAcres} acres
- Children: ${numberOfChildren} (Girl children under 10: ${numberOfGirlChildrenUnder10})
- Digital usage: ${digitalUsage}

EVIDENCE:
The core Recommendation Engine has calculated suitability scores for these schemes:
1. ${topRecommendations[0].name} (Score: ${topRecommendations[0].score}/100)
2. ${topRecommendations[1].name} (Score: ${topRecommendations[1].score}/100)
3. ${topRecommendations[2].name} (Score: ${topRecommendations[2].score}/100)

CONSTRAINTS:
1. Refer ONLY to the provided demographic attributes and scoring.
2. DO NOT calculate or modify suitability scores. The recommendation engine is the sole decision authority.
3. Write a short, professional, and convincing explainability paragraph (1-2 sentences) for EACH of the three schemes.
4. Present it as direct advice explaining why the engine selected this scheme for this beneficiary.
5. If evidence is missing, explicitly state that the information is unavailable.

OUTPUT FORMAT:
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
      if (text.startsWith("```")) {
        const matches = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (matches && matches[1]) {
          text = matches[1].trim();
        }
      }
      explanations = JSON.parse(text);

      // Perform Grounding validation (internal check)
      const combinedText = `${explanations.explanation1 || ""} ${explanations.explanation2 || ""} ${explanations.explanation3 || ""}`;
      const retrievedContext = {
        name: name || 'Citizen',
        age: safeAge,
        income: safeIncome,
        land: safeLand,
        children: safeChildren,
        girlChildren: safeGirls,
        scheme1Score: topRecommendations[0].score,
        scheme2Score: topRecommendations[1].score,
        scheme3Score: topRecommendations[2].score
      };
      const db = mongoose.connection.db;
      const schemesList = await db.collection('schemes').find({}).toArray();
      const allAllowedSchemeCodes = schemesList.map(s => s.schemeCode);
      const validation = validateMetricsGrounding(combinedText, retrievedContext, allAllowedSchemeCodes);
      if (validation.flagged) {
        console.warn("Grounding mismatches detected in recommendations explainability:", validation.warnings);
        await db.collection('audit_logs').insertOne({
          actionType: "AI_VALIDATION_WARNING",
          location: `Individual Rec Explanation for ${name || 'Citizen'}`,
          recommendation: JSON.stringify(validation.warnings),
          opportunityIndex: topRecommendations[0].score || 0,
          userActionTime: new Date()
        });
      }
    } catch (err) {
      console.error("Gemini Explanation Generation failed, using fallbacks:", err);
      const driverStr0 = topRecommendations[0]?.drivers?.join(' ') || '';
      const driverStr1 = topRecommendations[1]?.drivers?.join(' ') || '';
      const driverStr2 = topRecommendations[2]?.drivers?.join(' ') || '';
      
      explanations = {
        explanation1: `${topRecommendations[0].name} is recommended for age ${age} and income of ₹${monthlyIncome}/month. ${driverStr0}`,
        explanation2: `${topRecommendations[1].name} is suitable for a ${occupation} profile. ${driverStr1}`,
        explanation3: `${topRecommendations[2].name} is selected based on demographic indicators. ${driverStr2}`
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
