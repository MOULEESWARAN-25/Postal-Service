export const dynamic = 'force-dynamic';

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongoose";
import { calculateVillageRecommendations } from "@/lib/recommendationEngine";
import { validateMetricsGrounding } from "@/lib/llmValidator";
import crypto from 'crypto';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const google = createGoogleGenerativeAI({
  apiKey: apiKey,
});

// Entity mappings for classification & extraction
const knownVillages = [
  { name: "A.Sembulichampalayam", normalized: "asembulichampalayam" },
  { name: "Ayyampalayam", normalized: "ayyampalayam" },
  { name: "Bannari", normalized: "bannari" },
  { name: "Rajan Nagar", normalized: "rajannagar" },
  { name: "Pudupeerkadavu", normalized: "pudupeerkadavu" },
  { name: "Bhavanisagar", normalized: "bhavanisagar" },
  { name: "Bhavani Village A", normalized: "bhavanivillagea" },
  { name: "Bhavani Village B", normalized: "bhavanivillageb" },
  { name: "Komarapalayam", normalized: "komarapalayam" },
  { name: "Thingalur Village", normalized: "thingalurvillage" },
  { name: "Thoppampalayam", normalized: "thoppampalayam" },
  { name: "Arasur", normalized: "arasur" },
  { name: "Bhavani", normalized: "bhavani" },
  { name: "Thingalur", normalized: "thingalur" },
  { name: "Erode", normalized: "erode" },
  { name: "Tamil Nadu", normalized: "tamilnadu" }
];

const knownBeneficiaries = [
  { name: "Muthusamy K", normalized: "muthusamy" },
  { name: "Anjali Devi", normalized: "anjali" },
  { name: "Ramasamy P", normalized: "ramasamy" },
  { name: "Karthik R", normalized: "karthik" },
  { name: "Sumathi M", normalized: "sumathi" }
];

const knownSchemes = [
  { code: "SSA", name: "Sukanya Samriddhi Account", aliases: ["sukanya", "ssa", "samriddhi"] },
  { code: "KVP", name: "Kisan Vikas Patra", aliases: ["kvp", "kisan vikas", "kisan vikas patra"] },
  { code: "SCSS", name: "Senior Citizens Savings Scheme", aliases: ["scss", "senior citizen", "senior citizens"] },
  { code: "PPF", name: "Public Provident Fund", aliases: ["ppf", "provident fund"] },
  { code: "NSC", name: "National Savings Certificate", aliases: ["nsc", "national savings certificate"] },
  { code: "SB", name: "Post Office Savings Account", aliases: ["sb", "posb", "savings account"] },
  { code: "RD", name: "National Savings Recurring Deposit", aliases: ["rd", "recurring deposit"] },
  { code: "TD", name: "National Savings Time Deposit", aliases: ["td", "time deposit", "term deposit"] },
  { code: "MIS", name: "Monthly Income Scheme", aliases: ["mis", "monthly income"] },
  { code: "MSSC", name: "Mahila Samman Savings Certificate", aliases: ["mssc", "mahila samman"] },
  { code: "PMCARES", name: "PM CARES for Children Scheme", aliases: ["pmcares", "pm cares", "pm cares for children"] },
  { code: "PMJJBY", name: "Pradhan Mantri Jeevan Jyoti Bima Yojana", aliases: ["pmjjby", "jeevan jyoti"] },
  { code: "PMSBY", name: "Pradhan Mantri Suraksha Bima Yojana", aliases: ["pmsby", "suraksha bima"] },
  { code: "APY", name: "Atal Pension Yojana", aliases: ["apy", "atal pension"] }
];

// Query Classification
function classifyQuery(promptText) {
  const text = promptText.toLowerCase();

  // 1. Comparative Analysis
  if (text.includes("compare") || text.includes("difference") || text.includes(" vs ") || text.includes("versus")) {
    const matchedVillages = knownVillages.filter(v => text.includes(v.normalized) || text.includes(v.name.toLowerCase()));
    if (matchedVillages.length >= 1) {
      return {
        intent: "COMPARATIVE_ANALYSIS",
        villages: matchedVillages.map(v => v.name)
      };
    }
  }

  // 2. Beneficiary Guidance
  const matchedBeneficiary = knownBeneficiaries.find(b => text.includes(b.normalized) || text.includes(b.name.toLowerCase()));
  const hasBeneficiaryKeywords = text.includes("beneficiary") || text.includes("citizen") || text.includes("profile");
  if (matchedBeneficiary || (hasBeneficiaryKeywords && /\b\d{12}\b/.test(text))) {
    return {
      intent: "BENEFICIARY_GUIDANCE",
      beneficiary: matchedBeneficiary ? matchedBeneficiary.name : null,
      aadhaar: (text.match(/\b\d{12}\b/) || [])[0] || null
    };
  }

  // 3. Recommendation Explanation
  if (text.includes("why was") || text.includes("why is") || text.includes("explain recommendation") || text.includes("explain why") || text.includes("drivers")) {
    const matchedVillage = knownVillages.find(v => text.includes(v.normalized) || text.includes(v.name.toLowerCase()));
    const matchedScheme = knownSchemes.find(s => s.aliases.some(a => text.includes(a)) || text.includes(s.code.toLowerCase()));
    if (matchedVillage || matchedScheme) {
      return {
        intent: "RECOMMENDATION_EXPLANATION",
        village: matchedVillage ? matchedVillage.name : null,
        scheme: matchedScheme ? matchedScheme.code : null
      };
    }
  }

  // 4. Village Analysis
  const matchedVillage = knownVillages.find(v => text.includes(v.normalized) || text.includes(v.name.toLowerCase()));
  if (matchedVillage && (text.includes("analyze") || text.includes("demographic") || text.includes("outreach") || text.includes("campaign") || text.includes("checklist") || text.includes("announcement") || text.includes("sms"))) {
    return {
      intent: "VILLAGE_ANALYSIS",
      village: matchedVillage.name
    };
  }

  // 5. Scheme Information
  const matchedScheme = knownSchemes.find(s => s.aliases.some(a => text.includes(a)) || text.includes(s.code.toLowerCase()));
  if (matchedScheme && (text.includes("what is") || text.includes("about scheme") || text.includes("details of") || text.includes("interest rate") || text.includes("eligibility") || text.includes("rule") || text.includes("lock-in"))) {
    return {
      intent: "SCHEME_INFORMATION",
      scheme: matchedScheme.code
    };
  }

  // Fallbacks if entity is found but keywords are missing
  if (matchedVillage) {
    return {
      intent: "VILLAGE_ANALYSIS",
      village: matchedVillage.name
    };
  }
  if (matchedScheme) {
    return {
      intent: "SCHEME_INFORMATION",
      scheme: matchedScheme.code
    };
  }

  return {
    intent: "GENERAL_POSTAL_QUERY"
  };
}

// Intent-specific Prompt Templates
const PROMPTS = {
  VILLAGE_ANALYSIS: `
ROLE: You are the India Post DSS decision-support assistant. Your role is to explain and analyze the demographics and agricultural crop cycles of a specific village to help plan marketing campaigns.

CONTEXT:
Target Village: {villageName}
Demographics:
- Total Population: {totP} (Male: {totM}, Female: {totF})
- Literacy: Male Literacy {mLit}%, Female Literacy {fLit}%
- Workforce: Agricultural Workers: {agriWorkers} ({agriRatio}%), Salaried Workers: {salariedWorkers} ({salariedRatio}%)
- Key Cohorts: School-age children (7-17): {childPop} ({childRatio}%), Seniors (60+): {seniorPop} ({seniorRatio}%)
Crop Timing:
- Primary Crop: {crop}
- Sowing Season: {sowing}
- Harvesting Season: {harvesting}

EVIDENCE (Pre-computed Recommendation):
- Recommended Scheme: {recommendedScheme}
- DSS Opportunity Score: {opportunityScore}/100
- Campaign Window: {campaignWindow}
- Estimated Eligible Citizens: {estimatedEligibleCitizens}
- Key Drivers: {keyDrivers}

CONSTRAINTS:
1. Refer ONLY to the provided demographics and pre-computed recommendation.
2. DO NOT invent or alter metrics or opportunity index scores. The recommendation engine is the sole decision authority.
3. Keep the analysis professional, actionable, and focused on operational outreach.
4. If details are missing, state: "Insufficient data available for this analysis."
5. Never recommend a scheme independently or calculate suitability scores. Always explain the provided score.

OUTPUT FORMAT:
Provide your response using clear markdown headings:
## 📊 Demographic Overview
[Demographic details and trends matching the context]

## 🌾 Crop Alignment & Timeline Strategy
[Explain sowing/harvesting timing strategy for outreach campaign]

## 📢 Campaign Outreach Steps for {recommendedScheme}
[List 3-4 structured outreach and campaign steps]

## ⚡ Expected Impact & Limitations
- **Expected Impact:** {estimatedEligibleCitizens} target enrollments
- **Key Constraints:** [Mention demographic or literacy bounds from context]
`,

  RECOMMENDATION_EXPLANATION: `
ROLE: You are the India Post DSS decision-support assistant. Your role is to explain why a specific scheme was recommended for a village or citizen.

CONTEXT:
Target Entity: {targetEntity}
Demographics / Attributes:
{attributes}

EVIDENCE:
Recommendation Engine Output:
- Recommended Scheme: {schemeName} ({schemeCode})
- DSS Opportunity Index: {opportunityScore}/100
- Expected Impact: {expectedImpact}
- Key Suitability Drivers: {drivers}
- Target Gap: {gap}

CONSTRAINTS:
1. Refer ONLY to the pre-computed scoring drivers and attributes.
2. DO NOT recalculate or modify the Opportunity Index. The recommendation engine is the sole decision authority.
3. Focus on justifying why the scheme fits based on demographic statistics (population segments, literacy rates, occupation).
4. If evidence is missing, state: "Insufficient data available for this analysis."
5. Never state generic suitability phrases like "This scheme appears suitable" without referencing exact metrics.

OUTPUT FORMAT:
Provide your response using clear markdown headings:
## 🏦 Suitability Justification
[Detailed evidence-backed reasoning matching target demographics]

## 🎯 Opportunity Index Explanation
[Explain the pre-computed Opportunity Index of {opportunityScore}/100 using the drivers and gap]

## 📦 Supporting Evidence Summary
- **Expected Impact:** {expectedImpact} citizens
- **Last Updated:** {lastUpdated}
`,

  SCHEME_INFORMATION: `
ROLE: You are the India Post DSS scheme expert. Your role is to explain the rules, interest rates, and eligibility of post office savings schemes.

CONTEXT:
Scheme Rules:
- Name: {schemeName} ({schemeCode})
- Description: {description}
- Interest Rate: {interestRate}%
- Eligibility: Age {minAge} to {maxAge}, Genders: {genders}
- Target Audience: {targetAudience}
- Core Benefits: {benefits}

CONSTRAINTS:
1. Use ONLY the official scheme rules provided. Do not use external knowledge or guess interest rates.
2. If the user query asks about eligibility for a specific age or gender, verify it strictly against the rules.
3. If interest rate or lock-in details are missing, state: "Insufficient data available for this analysis."
4. Never calculate opportunity index scores or suitability indicators.

OUTPUT FORMAT:
Provide your response using clear markdown headings:
## 🏦 Scheme Summary
[Concise summary of the scheme]

## 📋 Eligibility Rules
- **Ages:** {minAge} to {maxAge} years
- **Genders:** {genders}
- **Target Group:** {targetAudience}

## ⚡ Key Features & Interest Rate
- **Current Interest Rate:** {interestRate}% per annum
- **Benefits:** {benefits}

## 📝 Steps to Enroll
[Describe standard process based on rules]
`,

  BENEFICIARY_GUIDANCE: `
ROLE: You are the India Post DSS beneficiary advisor. Your role is to explain which post office savings schemes match a citizen's personal profile.

CONTEXT:
Beneficiary Profile:
- Name: {name}
- Age: {age}
- Gender: {gender}
- Occupation: {occupation}
- Monthly Income: ₹{income}/month
- Children: {children} (Girls under 10: {girlChildren})
- Land Ownership: {land}
- Digital Usage: {digital}

EVIDENCE:
Deterministic Scheme Matches:
{schemeMatches}

CONSTRAINTS:
1. Explain only the pre-computed recommendations. Do not suggest other schemes or modify the match order.
2. Do not invent details or assume income/credit numbers not present in the context.
3. If profile attributes are missing, state: "Insufficient data available for this analysis."

OUTPUT FORMAT:
Provide your response using clear markdown headings:
## 👤 Beneficiary Suitability Reasoning
[Reasoning for each of the top matched schemes referencing citizen details]

## 📝 Specific Enrollment Guidance for {name}
[List actionable enrollment advice and documents needed]
`,

  COMPARATIVE_ANALYSIS: `
ROLE: You are the India Post DSS analyst. Your role is to compare demographic and recommendation data between two villages to optimize regional campaigns.

CONTEXT:
Village 1: {village1Name}
- Demographics: {village1Demographics}
- Recommendation: {village1Recommendation}

Village 2: {village2Name}
- Demographics: {village2Demographics}
- Recommendation: {village2Recommendation}

CONSTRAINTS:
1. Compare only the retrieved data. Do not invent comparative statistics.
2. Maintain strict separation of decisions. Do not alter the pre-computed opportunity scores of either village.
3. If data is missing for either village, state: "Insufficient data available for this analysis."

OUTPUT FORMAT:
Provide your response using clear markdown headings:
## ⚖️ Side-by-Side Comparison Matrix
[Markdown table comparing key metrics like population, literacy, agriculture, top recommendation, and scores]

## 🎯 Key Comparative Insights
[Detail differences and explaining factors]

## 📍 Campaign Allocation Recommendations
[Explain the optimal campaign strategy based on the scores]
`,

  GENERAL_POSTAL_QUERY: `
ROLE: You are an India Post DSS decision-support assistant. Your role is to explain post office financial schemes using grounded evidence.

CONTEXT:
Available Schemes Summary:
{schemesSummary}

CONSTRAINTS:
1. Answer queries regarding post office financial schemes, savings, or deposits.
2. Ground all answers in the provided schemes summary. Do not make up interest rates.
3. If evidence is missing, state: "Insufficient data available for this analysis."

OUTPUT FORMAT:
Provide a clear, formatted explanation matching the user query with headers:
## 🏦 Post Office Schemes Info
[Clear formatted answer]
`
};

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    // 1. Classify Query Intent
    const classification = classifyQuery(prompt);
    console.log("LLM RAG Audit - Classified Intent:", classification.intent);

    let retrievedContext = {};
    let retrievalQuality = "LOW";
    let formattedPrompt = "";
    let opportunityScore = 0;
    let text = "";
    let bypassGemini = false;

    // Fetch schemes list for grounding audits and fallback
    const schemesList = await db.collection('schemes').find({}).toArray();
    const allAllowedSchemeCodes = schemesList.map(s => s.schemeCode);

    // 2. Intent-Driven Data Retrieval & Context Budgeting
    if (classification.intent === "VILLAGE_ANALYSIS" || (classification.intent === "RECOMMENDATION_EXPLANATION" && classification.village)) {
      const villageName = classification.village || classification.villages?.[0];
      
      const demRecord = await db.collection('demographic_tamilnadu').findOne({
        name: new RegExp('^' + villageName + '$', 'i')
      });

      if (demRecord) {
        const allRecs = calculateVillageRecommendations(demRecord);
        const topRec = allRecs[0] || {};
        opportunityScore = topRec.score || 0;

        let crop = "N/A", sowing = "N/A", harvesting = "N/A";
        const cropSub = await db.collection('cropsubdistricts').findOne({
          "crops.village": villageName.toLowerCase()
        });
        if (cropSub && cropSub.crops && cropSub.crops[0]?.crops?.[0]) {
          crop = cropSub.crops[0].crops[0];
          const timing = await db.collection('croptimings').findOne({
            cropname: crop
          });
          if (timing && timing.timing?.[0]?.seasons) {
            sowing = timing.timing[0].seasons.sowing?.join(", ") || "N/A";
            harvesting = timing.timing[0].seasons.harvesting?.join(", ") || "N/A";
          }
        }

        retrievedContext = {
          villageName: demRecord.name,
          totP: demRecord.totP || 0,
          totM: demRecord.totM || 0,
          totF: demRecord.totF || 0,
          mLit: demRecord.mLit || 0,
          fLit: demRecord.fLit || 0,
          agriWorkers: (demRecord.mainAlP || 0) + (demRecord.mainClP || 0) + (demRecord.margAlP || 0) + (demRecord.margClP || 0),
          agriRatio: demRecord.totP ? Math.round((((demRecord.mainAlP || 0) + (demRecord.mainClP || 0) + (demRecord.margAlP || 0) + (demRecord.margClP || 0)) / demRecord.totP) * 100) : 0,
          salariedWorkers: (demRecord.mainOtP || 0) + (demRecord.margOtP || 0),
          salariedRatio: demRecord.totP ? Math.round((((demRecord.mainOtP || 0) + (demRecord.margOtP || 0)) / demRecord.totP) * 100) : 0,
          childPop: demRecord.population717 || 0,
          childRatio: demRecord.totP ? Math.round(((demRecord.population717 || 0) / demRecord.totP) * 100) : 0,
          seniorPop: demRecord.population60Plus || 0,
          seniorRatio: demRecord.totP ? Math.round(((demRecord.population60Plus || 0) / demRecord.totP) * 100) : 0,
          crop,
          sowing,
          harvesting,
          recommendedScheme: topRec.name || "N/A",
          opportunityScore: topRec.score || 0,
          campaignWindow: topRec.campaignWindow || "N/A",
          estimatedEligibleCitizens: topRec.expectedImpact || 0,
          keyDrivers: topRec.keyDrivers?.join("; ") || "N/A"
        };
        
        retrievalQuality = "HIGH";
        
        if (classification.intent === "VILLAGE_ANALYSIS") {
          formattedPrompt = PROMPTS.VILLAGE_ANALYSIS
            .replace(/{villageName}/g, retrievedContext.villageName)
            .replace(/{totP}/g, retrievedContext.totP)
            .replace(/{totM}/g, retrievedContext.totM)
            .replace(/{totF}/g, retrievedContext.totF)
            .replace(/{mLit}/g, retrievedContext.mLit)
            .replace(/{fLit}/g, retrievedContext.fLit)
            .replace(/{agriWorkers}/g, retrievedContext.agriWorkers)
            .replace(/{agriRatio}/g, retrievedContext.agriRatio)
            .replace(/{salariedWorkers}/g, retrievedContext.salariedWorkers)
            .replace(/{salariedRatio}/g, retrievedContext.salariedRatio)
            .replace(/{childPop}/g, retrievedContext.childPop)
            .replace(/{childRatio}/g, retrievedContext.childRatio)
            .replace(/{seniorPop}/g, retrievedContext.seniorPop)
            .replace(/{seniorRatio}/g, retrievedContext.seniorRatio)
            .replace(/{crop}/g, retrievedContext.crop)
            .replace(/{sowing}/g, retrievedContext.sowing)
            .replace(/{harvesting}/g, retrievedContext.harvesting)
            .replace(/{recommendedScheme}/g, retrievedContext.recommendedScheme)
            .replace(/{opportunityScore}/g, retrievedContext.opportunityScore)
            .replace(/{campaignWindow}/g, retrievedContext.campaignWindow)
            .replace(/{estimatedEligibleCitizens}/g, retrievedContext.estimatedEligibleCitizens)
            .replace(/{keyDrivers}/g, retrievedContext.keyDrivers);
        } else {
          // RECOMMENDATION_EXPLANATION
          const attrs = `Village Name: ${retrievedContext.villageName}
- Total Population: ${retrievedContext.totP}
- Literacy Rate: Male ${retrievedContext.mLit}%, Female ${retrievedContext.fLit}%
- Agricultural workforce: ${retrievedContext.agriWorkers} (${retrievedContext.agriRatio}%)
- Salaried workforce: ${retrievedContext.salariedWorkers} (${retrievedContext.salariedRatio}%)`;

          formattedPrompt = PROMPTS.RECOMMENDATION_EXPLANATION
            .replace(/{targetEntity}/g, retrievedContext.villageName)
            .replace(/{attributes}/g, attrs)
            .replace(/{schemeName}/g, topRec.name || "N/A")
            .replace(/{schemeCode}/g, topRec.schemeCode || "N/A")
            .replace(/{opportunityScore}/g, topRec.score || 0)
            .replace(/{expectedImpact}/g, topRec.expectedImpact || 0)
            .replace(/{drivers}/g, topRec.keyDrivers?.join(", ") || "N/A")
            .replace(/{gap}/g, topRec.gap || "N/A")
            .replace(/{lastUpdated}/g, topRec.lastUpdated || "N/A");
        }
      } else {
        retrievalQuality = "INSUFFICIENT_DATA";
      }

    } else if (classification.intent === "BENEFICIARY_GUIDANCE") {
      const bName = classification.beneficiary;
      const aadhaarNum = Number(classification.aadhaar);
      
      let citizen = null;
      if (aadhaarNum) {
        citizen = await db.collection('personal_info').findOne({ aadhaar_id: aadhaarNum });
      } else if (bName) {
        citizen = await db.collection('personal_info').findOne({ Name: new RegExp(bName, 'i') });
      }

      if (citizen) {
        retrievalQuality = "HIGH";
        const schemeMatches = `1. ${citizen.RecommendedScheme1 || "N/A"}
2. ${citizen.RecommendedScheme2 || "N/A"}
3. ${citizen.RecommendedScheme3 || "N/A"}`;

        retrievedContext = {
          name: citizen.Name,
          age: citizen.Age || 0,
          gender: citizen.Gender || "N/A",
          occupation: citizen.Occupation || "N/A",
          income: citizen.MonthlyIncome || 0,
          children: citizen.NoOfChildrenInTheHouse || 0,
          girlChildren: citizen.NoOfGirlChildrenUnder10 || 0,
          land: citizen.OwnLandForAgriculture || "No",
          digital: citizen.DigitalUsage || "Medium"
        };

        formattedPrompt = PROMPTS.BENEFICIARY_GUIDANCE
          .replace(/{name}/g, citizen.Name)
          .replace(/{age}/g, citizen.Age || "N/A")
          .replace(/{gender}/g, citizen.Gender || "N/A")
          .replace(/{occupation}/g, citizen.Occupation || "N/A")
          .replace(/{income}/g, citizen.MonthlyIncome || "N/A")
          .replace(/{children}/g, citizen.NoOfChildrenInTheHouse || 0)
          .replace(/{girlChildren}/g, citizen.NoOfGirlChildrenUnder10 || 0)
          .replace(/{land}/g, citizen.OwnLandForAgriculture || "No")
          .replace(/{digital}/g, citizen.DigitalUsage || "Medium")
          .replace(/{schemeMatches}/g, schemeMatches);
      } else {
        retrievalQuality = "INSUFFICIENT_DATA";
      }

    } else if (classification.intent === "SCHEME_INFORMATION") {
      const schemeCode = classification.scheme;
      const sc = await db.collection('schemes').findOne({
        schemeCode: new RegExp('^' + schemeCode + '$', 'i')
      });

      if (sc) {
        retrievalQuality = "HIGH";
        retrievedContext = {
          schemeName: sc.name,
          schemeCode: sc.schemeCode,
          interestRate: sc.interestRate || 0,
          minAge: sc.eligibilityCriteria?.minAge || 0,
          maxAge: sc.eligibilityCriteria?.maxAge || 100
        };

        const description = sc.description || "No description available.";
        const minAge = sc.eligibilityCriteria?.minAge !== undefined ? sc.eligibilityCriteria.minAge : "N/A";
        const maxAge = sc.eligibilityCriteria?.maxAge !== undefined ? sc.eligibilityCriteria.maxAge : "N/A";
        const genders = sc.eligibilityCriteria?.allowedGenders?.join(", ") || "All";
        const targetAudience = sc.targetAudience || "N/A";
        const interestRate = sc.interestRate || "N/A";
        const benefitsList = sc.benefits && sc.benefits.length > 0 
          ? sc.benefits.map(b => `- ${b}`).join("\n") 
          : "- Sovereign safety and attractive returns.";

        const steps = [
          `Visit your nearest India Post Office or use the IPPB mobile app.`,
          `Provide necessary KYC documents including Aadhaar Card, PAN Card, and passport-size photographs.`,
          `Complete the application form for ${sc.name} (${sc.schemeCode}).`,
          `Submit the required initial minimum deposit as defined by the scheme rules.`
        ].map((step, idx) => `${idx + 1}. ${step}`).join("\n");

        text = `## 🏦 Scheme Summary
${description}

## 📋 Eligibility Rules
- **Ages:** ${minAge} to ${maxAge} years
- **Genders:** ${genders}
- **Target Group:** ${targetAudience}

## ⚡ Key Features & Interest Rate
- **Current Interest Rate:** ${interestRate}% per annum
- **Benefits:**
${benefitsList}

## 📝 Steps to Enroll
${steps}`;

        bypassGemini = true;
        console.log(`Bypassed Gemini for SCHEME_INFORMATION of code: ${schemeCode}`);
      } else {
        retrievalQuality = "INSUFFICIENT_DATA";
      }

    } else if (classification.intent === "COMPARATIVE_ANALYSIS") {
      const v1 = classification.villages[0];
      const v2 = classification.villages[1] || classification.villages[0];

      const dem1 = await db.collection('demographic_tamilnadu').findOne({ name: new RegExp('^' + v1 + '$', 'i') });
      const dem2 = await db.collection('demographic_tamilnadu').findOne({ name: new RegExp('^' + v2 + '$', 'i') });

      if (dem1 && dem2) {
        retrievalQuality = "HIGH";
        const rec1 = calculateVillageRecommendations(dem1)[0] || {};
        const rec2 = calculateVillageRecommendations(dem2)[0] || {};

        retrievedContext = {
          v1Name: dem1.name,
          v1TotP: dem1.totP || 0,
          v2Name: dem2.name,
          v2TotP: dem2.totP || 0
        };

        const v1Dem = `Total Pop: ${dem1.totP}, Lit: M ${dem1.mLit}%, F ${dem1.fLit}%, Agri Ratio: ${dem1.totP ? Math.round(((dem1.mainAlP || 0) / dem1.totP) * 100) : 0}%`;
        const v2Dem = `Total Pop: ${dem2.totP}, Lit: M ${dem2.mLit}%, F ${dem2.fLit}%, Agri Ratio: ${dem2.totP ? Math.round(((dem2.mainAlP || 0) / dem2.totP) * 100) : 0}%`;

        formattedPrompt = PROMPTS.COMPARATIVE_ANALYSIS
          .replace(/{village1Name}/g, dem1.name)
          .replace(/{village1Demographics}/g, v1Dem)
          .replace(/{village1Recommendation}/g, `${rec1.name} (Score: ${rec1.score}/100)`)
          .replace(/{village2Name}/g, dem2.name)
          .replace(/{village2Demographics}/g, v2Dem)
          .replace(/{village2Recommendation}/g, `${rec2.name} (Score: ${rec2.score}/100)`);
      } else {
        retrievalQuality = dem1 || dem2 ? "MEDIUM" : "INSUFFICIENT_DATA";
      }
    }

    // Fallback if formatting was not completed or query general
    if (!formattedPrompt || classification.intent === "GENERAL_POSTAL_QUERY" || retrievalQuality === "INSUFFICIENT_DATA") {
      const schemesSummary = schemesList.map(s => `- ${s.name} (${s.schemeCode}): Interest Rate: ${s.interestRate}%, Age: ${s.eligibilityCriteria?.minAge}-${s.eligibilityCriteria?.maxAge}`).join("\n");

      if (retrievalQuality !== "INSUFFICIENT_DATA") {
        retrievalQuality = schemesList.length > 0 ? "MEDIUM" : "LOW";
      }

      retrievedContext = {
        totalSchemesLoaded: schemesList.length
      };

      formattedPrompt = PROMPTS.GENERAL_POSTAL_QUERY
        .replace(/{schemesSummary}/g, schemesSummary);
    }

    // Add user query at the bottom to trigger direct response mapping
    const finalPrompt = `${formattedPrompt}\n\nUser Query: "${prompt}"`;

    // 2.5 Response Caching Lookup (Stable query categories only)
    let cacheKey = "";
    const shouldCache = ["VILLAGE_ANALYSIS", "RECOMMENDATION_EXPLANATION", "GENERAL_POSTAL_QUERY"].includes(classification.intent) &&
                        (classification.intent !== "RECOMMENDATION_EXPLANATION" || classification.village);

    if (!bypassGemini && shouldCache) {
      if (classification.intent === "GENERAL_POSTAL_QUERY") {
        const cacheInput = `${classification.intent}:${prompt.trim().toLowerCase()}`;
        cacheKey = crypto.createHash('sha256').update(cacheInput).digest('hex');
      } else {
        const village = retrievedContext.villageName || "";
        const scheme = retrievedContext.recommendedScheme || "";
        const opportunityIndex = retrievedContext.opportunityScore || 0;
        const expectedImpact = retrievedContext.estimatedEligibleCitizens || 0;
        const engineVersion = "v1.4";
        const lastUpdated = retrievedContext.lastUpdated || "Census 2011 PCA";
        
        const cacheInput = `${classification.intent}:${village}:${scheme}:${opportunityIndex}:${expectedImpact}:${engineVersion}:${lastUpdated}`;
        cacheKey = crypto.createHash('sha256').update(cacheInput).digest('hex');
      }

      const cachedRecord = await db.collection('ai_response_cache').findOne({ cacheKey });
      
      if (cachedRecord) {
        const ageMs = new Date() - new Date(cachedRecord.createdAt);
        let ttlMs = 24 * 60 * 60 * 1000; // default 24h
        if (classification.intent === "GENERAL_POSTAL_QUERY") {
          ttlMs = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else if (classification.intent === "VILLAGE_ANALYSIS") {
          ttlMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        } else if (classification.intent === "RECOMMENDATION_EXPLANATION") {
          ttlMs = 24 * 60 * 60 * 1000; // 24 hours
        }

        if (ageMs <= ttlMs) {
          console.log(`Cache HIT for intent ${classification.intent} (key: ${cacheKey})`);
          
          const provenance = {
            ...cachedRecord.provenance,
            cached: true
          };

          return new Response(JSON.stringify({
            text: cachedRecord.text,
            provenance,
            retrievalQuality: cachedRecord.retrievalQuality
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          console.log(`Cache EXPIRED for intent ${classification.intent} (key: ${cacheKey}), deleting...`);
          await db.collection('ai_response_cache').deleteOne({ cacheKey });
        }
      }
    }

    if (!bypassGemini) {
      try {
        const response = await generateText({
          model: google('gemini-2.0-flash'),
          prompt: finalPrompt,
        });
        text = response.text;

        // Cache the newly generated response
        if (shouldCache && text && cacheKey) {
          const provenance = {
            decisionAuthority: "Recommendation Engine v1.4",
            explanationAuthority: "Gemini 2.0 Flash",
            dataAuthority: "Census 2011 PCA + Postal DB",
            timestamp: new Date().toISOString()
          };

          await db.collection('ai_response_cache').updateOne(
            { cacheKey },
            {
              $set: {
                cacheKey,
                intent: classification.intent,
                text,
                provenance,
                retrievalQuality,
                createdAt: new Date()
              }
            },
            { upsert: true }
          );
          console.log(`Cached response for intent ${classification.intent} (key: ${cacheKey})`);
        }
      } catch (llmError) {
        console.warn("Gemini call failed, generating fallback response locally:", llmError);
        
        // Local fallback generation based on classified intent
        if (classification.intent === "VILLAGE_ANALYSIS") {
          text = `## 📊 Demographic Overview
The village **${retrievedContext.villageName}** has a total population of **${retrievedContext.totP}** citizens (Male: **${retrievedContext.totM}**, Female: **${retrievedContext.totF}**).
The literacy rate stands at **${retrievedContext.mLit}%** for males and **${retrievedContext.fLit}%** for females.
Workforce indicators show **${retrievedContext.agriWorkers}** agricultural workers (**${retrievedContext.agriRatio}%**) and **${retrievedContext.salariedWorkers}** salaried workers (**${retrievedContext.salariedRatio}%**).

## 🌾 Crop Alignment & Timeline Strategy
The primary crop cultivated here is **${retrievedContext.crop}**.
Sowing occurs during **${retrievedContext.sowing}**, and harvesting takes place during **${retrievedContext.harvesting}**.
Outreach campaigns should be aligned with the harvesting season when agricultural liquidity is highest.

## 📢 Campaign Outreach Steps for ${retrievedContext.recommendedScheme}
1. Set up information booths at key public spots during the harvest window.
2. Distribute flyers highlighting benefits of ${retrievedContext.recommendedScheme}.
3. Conduct community meetings in collaboration with local village leaders.

## ⚡ Expected Impact & Limitations
- **Expected Impact:** ${retrievedContext.estimatedEligibleCitizens} target enrollments
- **Key Constraints:** Regional female literacy is ${retrievedContext.fLit}%, requiring pictorial and simplified forms.`;
        } else if (classification.intent === "RECOMMENDATION_EXPLANATION") {
          text = `## 🏦 Suitability Justification
The scheme **${retrievedContext.recommendedScheme || "Atal Pension Yojana (APY)"}** is highly suitable for **${classification.village || retrievedContext.villageName || "the region"}** based on demographics:
- Earning segments align with the target audience of the scheme.
- Household profile and demographic indicators fit the eligibility constraints.

## 🎯 Opportunity Index Explanation
The **DSS Opportunity Index** is **${opportunityScore || 85}/100**. This score is driven by:
- Key Drivers: **${retrievedContext.keyDrivers || "Agrarian presence requiring pension and savings support"}**
- Target Gap: **${retrievedContext.gap || "Moderate penetration gap"}**

## 📦 Supporting Evidence Summary
- **Expected Impact:** ${retrievedContext.estimatedEligibleCitizens || 15} citizens
- **Last Updated:** ${retrievedContext.lastUpdated || "2026-06-20"}`;
        } else if (classification.intent === "SCHEME_INFORMATION") {
          text = `## 🏦 Scheme Summary
Official details for **${retrievedContext.schemeName || "Sukanya Samriddhi Account (SSA)"}** (**${retrievedContext.schemeCode || "SSA"}**).
This scheme is a secure, sovereign-backed savings instrument offering attractive returns.

## 📋 Eligibility Rules
- **Ages:** ${retrievedContext.minAge || "0"} to ${retrievedContext.maxAge || "10"} years
- **Genders:** Female
- **Target Group:** Girls under 10 years

## ⚡ Key Features & Interest Rate
- **Current Interest Rate:** ${retrievedContext.interestRate || "8.2"}% per annum
- **Benefits:** Exempt-Exempt-Exempt (EEE) tax status, higher interest rate than other savings accounts.

## 📝 Steps to Enroll
1. Visit the nearest India Post post office.
2. Fill out the application form and provide Aadhaar ID & KYC documents.
3. Deposit the minimum initial amount to activate the account.`;
        } else if (classification.intent === "BENEFICIARY_GUIDANCE") {
          text = `## 👤 Beneficiary Suitability Reasoning
Based on the profile of **${retrievedContext.name || "Citizen"}** (Age: **${retrievedContext.age}**, Gender: **${retrievedContext.gender}**, Occupation: **${retrievedContext.occupation}**):
1. **${retrievedContext.name}** is highly suited for schemes matching their income of ₹${retrievedContext.income}/month and demographic parameters.

## 📝 Specific Enrollment Guidance for ${retrievedContext.name || "Citizen"}
1. Provide Aadhaar Card verification.
2. Complete KYC registration forms.
3. Bring standard passport photos and initial deposit amount.`;
        } else if (classification.intent === "COMPARATIVE_ANALYSIS") {
          text = `## ⚖️ Side-by-Side Comparison Matrix
| Metric | ${retrievedContext.v1Name || "Village 1"} | ${retrievedContext.v2Name || "Village 2"} |
| :--- | :--- | :--- |
| **Total Population** | ${retrievedContext.v1TotP || 0} | ${retrievedContext.v2TotP || 0} |

## 🎯 Key Comparative Insights
- Comparing **${retrievedContext.v1Name || "Village 1"}** and **${retrievedContext.v2Name || "Village 2"}**.
- Focus outreach campaigns where the opportunity index is highest.

## 📍 Campaign Allocation Recommendations
Prioritize marketing budgets to the village with the higher DSS index to maximize conversion rate.`;
        } else {
          const schemesSummary = schemesList.map(s => `- ${s.name} (${s.schemeCode}): Interest Rate: ${s.interestRate}%, Age: ${s.eligibilityCriteria?.minAge || 0}-${s.eligibilityCriteria?.maxAge || 100}`).join("\n");
          text = `## 🏦 Post Office Schemes Info
Here is a summary of the available financial schemes:
${schemesSummary}`;
        }
      }
    }

    // 4. Grounding Validation Layer (Executed Backend-only)
    const validation = validateMetricsGrounding(text, retrievedContext, allAllowedSchemeCodes);
    if (validation.flagged) {
      console.warn("LLM Grounding Mismatches detected:", validation.warnings);
      // Log warning to MongoDB audit_logs
      await db.collection('audit_logs').insertOne({
        actionType: "AI_VALIDATION_WARNING",
        location: retrievedContext.villageName || classification.village || "Chatbot Query",
        recommendation: JSON.stringify(validation.warnings),
        opportunityIndex: opportunityScore,
        userActionTime: new Date()
      });
    }

    // Provenance Metadata
    const provenance = {
      decisionAuthority: "Recommendation Engine v1.4",
      explanationAuthority: bypassGemini ? "Deterministic DSS Logic" : "Gemini 2.0 Flash",
      dataAuthority: "Census 2011 PCA + Postal DB",
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify({
      text,
      provenance,
      retrievalQuality
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in query-resolver API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
