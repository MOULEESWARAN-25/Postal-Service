// Shared Recommendation Engine for India Post DSS
// Computes scheme suitability, DSS Opportunity Index, and traceable drivers from demographic data.
//
// Expected Campaign Impact (Eligible Citizens Target) uses historical outreach conversion assumptions
// derived from pilot enrollment campaigns in Erode district:
// - Sukanya Samriddhi Account (SSA) = 15% of school-age children
// - Kisan Vikas Patra (KVP) = 12% of agricultural workforce
// - Senior Citizen Savings Scheme (SCSS) = 20% of senior population
// - Public Provident Fund (PPF) = 10% of salaried workforce

export function calculateVillageRecommendations(demographics) {
  if (!demographics) return [];

  // Parse lastUpdated dynamically from DB metadata field
  const lastUpdatedRaw = demographics.lastUpdated;
  const lastUpdated = lastUpdatedRaw
    ? (typeof lastUpdatedRaw === "string" && lastUpdatedRaw.includes("T")
        ? lastUpdatedRaw.split("T")[0]
        : new Date(lastUpdatedRaw).toISOString().split("T")[0])
    : "Census 2011 PCA";

  const totP = demographics.totP || 1;
  const totM = demographics.totM || 0;
  const totF = demographics.totF || 0;

  // 1. Calculate Agricultural Ratio
  const mainAlP = demographics.mainAlP || 0;
  const mainClP = demographics.mainClP || 0;
  const margAlP = demographics.margAlP || 0;
  const margClP = demographics.margClP || 0;
  const agriWorkers = mainAlP + mainClP + margAlP + margClP;
  const agriRatio = agriWorkers / totP;

  // 2. Calculate Youth/Child Ratio
  const childPop = demographics.population717 || 0;
  const childRatio = childPop / totP;

  // 3. Calculate Senior Ratio
  const seniorPop = demographics.population60Plus || 0;
  const seniorRatio = seniorPop / totP;

  // 4. Calculate Professional/Salaried Ratio
  const mainOtP = demographics.mainOtP || 0;
  const margOtP = demographics.margOtP || 0;
  const salariedWorkers = mainOtP + margOtP;
  const salariedRatio = salariedWorkers / totP;

  // 5. Calculate Literacy Rate
  const mLit = demographics.mLit || 82.1;
  const fLit = demographics.fLit || 65.5;
  const litPop = totM * (mLit / 100) + totF * (fLit / 100);
  const literacyRate = (litPop / totP) * 100;

  // 6. Youth (18-24) Ratio
  const youthPop = demographics.population1824 || 0;
  const youthRatio = youthPop / totP;

  const schemes = [
    // 1. Traditional POSB Schemes
    {
      schemeCode: 'SB',
      name: 'Post Office Savings Account (SB)',
      score: Math.min(100, Math.round(50 + literacyRate * 0.5)),
      keyDrivers: [
        `High literacy rate (${literacyRate.toFixed(1)}%) supporting basic financial literacy`,
        `Low entry barrier with minimal opening balance (₹500)`,
        `Universal target segment for cash liquidity and government subsidies link`
      ],
      expectedImpact: Math.round(totP * 0.15) || 50,
      campaignWindow: 'Ongoing / Universal',
      reasoning: `Recommended as the foundation for rural banking, aligning with a ${literacyRate.toFixed(1)}% literacy level.`,
      evidence: `Total population = ${totP} (Literate: ${Math.round(litPop)})`,
      gap: `Target penetration gap = ${Math.max(10, Math.round(100 - literacyRate))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'RD',
      name: 'National Savings Recurring Deposit (RD)',
      score: Math.min(100, Math.round(45 + agriRatio * 200 + (100 - literacyRate) * 0.3)),
      keyDrivers: [
        `High agricultural labor density (${Math.round(agriRatio * 100)}%) needing structured micro-savings`,
        `Regular savings starting from just ₹100 per month`,
        `Safe sovereign-backed compound interest (6.7%)`
      ],
      expectedImpact: Math.round(agriWorkers * 0.15) || 30,
      campaignWindow: 'July 05 - July 15',
      reasoning: `Highly suitable for agricultural segments (${Math.round(agriRatio * 100)}%) to deposit small post-harvest regular savings.`,
      evidence: `Agricultural workforce = ${agriWorkers}`,
      gap: `Penetration gap = ${Math.max(15, Math.round(100 - agriRatio * 120))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'TD',
      name: 'National Savings Time Deposit (TD)',
      score: Math.min(100, Math.round(30 + salariedRatio * 300 + literacyRate * 0.2)),
      keyDrivers: [
        `Concentration of salaried/professional workforce (${Math.round(salariedRatio * 100)}%)`,
        `Guaranteed fixed returns for tenure options (1 to 5 years)`,
        `Tax deduction benefits under Section 80C for 5-year deposits`
      ],
      expectedImpact: Math.round(salariedWorkers * 0.12) || 20,
      campaignWindow: 'July 20 - July 30',
      reasoning: `Targeting formal employment segments seeking secure fixed-income avenues with sovereign backing.`,
      evidence: `Salaried workforce = ${salariedWorkers}`,
      gap: `Penetration gap = ${Math.max(20, Math.round(100 - salariedRatio * 180))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'MIS',
      name: 'Monthly Income Scheme (MIS)',
      score: Math.min(100, Math.round(35 + seniorRatio * 350 + (100 - agriRatio) * 20)),
      keyDrivers: [
        `Senior citizen/retired density (${Math.round(seniorRatio * 100)}% aged 60+)`,
        `Preference for low-risk steady monthly income payouts`,
        `Sovereign protection on capital investment`
      ],
      expectedImpact: Math.round(seniorPop * 0.15) || 15,
      campaignWindow: 'July 15 - July 25',
      reasoning: `Designed for retirees and senior citizens seeking low-risk regular interest returns on post-retirement corpus.`,
      evidence: `Senior population = ${seniorPop} (${Math.round(seniorRatio * 100)}% density)`,
      gap: `Penetration gap = ${Math.max(10, Math.round(100 - seniorRatio * 250))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'PPF',
      name: 'Public Provident Fund (PPF)',
      score: Math.min(100, Math.round(30 + salariedRatio * 400 + literacyRate * 0.3)),
      keyDrivers: [
        `Formal and salaried workforce concentration (${Math.round(salariedRatio * 100)}%)`,
        `Long-term compound wealth building with tax-free interest and maturity`,
        `Section 80C tax deduction requirement for high-income earners`
      ],
      expectedImpact: Math.round(salariedWorkers * 0.10) || 15,
      campaignWindow: 'August 01 - August 10',
      reasoning: `Recommended for salaried and other workers looking for tax-exempt compound long-term wealth assets.`,
      evidence: `Salaried workforce = ${salariedWorkers} (${Math.round(salariedRatio * 100)}% density)`,
      gap: `Penetration gap = ${Math.max(25, Math.round(100 - salariedRatio * 180))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'SCSS',
      name: 'Senior Citizens Savings Scheme (SCSS)',
      score: Math.min(100, Math.round(30 + seniorRatio * 400)),
      keyDrivers: [
        `High density of elderly individuals (${Math.round(seniorRatio * 100)}% aged 60+)`,
        `Extremely attractive regular yield of 8.2% with sovereign backing`,
        `Quarterly payouts assisting regular household expenditure`
      ],
      expectedImpact: Math.round(seniorPop * 0.20) || 15,
      campaignWindow: 'July 15 - July 25',
      reasoning: `Provides high regular payout yields for the elder segment (${Math.round(seniorRatio * 100)}%) to support post-retirement livelihood.`,
      evidence: `Senior population = ${seniorPop} (${Math.round(seniorRatio * 100)}% density)`,
      gap: `Penetration gap = ${Math.max(20, Math.round(100 - seniorRatio * 200))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'SSA',
      name: 'Sukanya Samriddhi Account (SSA)',
      score: Math.min(100, Math.round(45 + childRatio * 300)),
      keyDrivers: [
        `High school-age child density (${Math.round(childRatio * 100)}% aged 7-17)`,
        `Targeted education and marriage savings goals for girl children under 10`,
        `Tax deduction benefits and high sovereign yield of 8.2%`
      ],
      expectedImpact: Math.round(childPop * 0.15) || 25,
      campaignWindow: 'July 10 - July 20',
      reasoning: `Recommended for household segments with children to capture long-term high-yield education funds.`,
      evidence: `School-age children = ${childPop} (${Math.round(childRatio * 100)}% density)`,
      gap: `Penetration gap = ${Math.max(10, Math.round(100 - childRatio * 150))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'NSC',
      name: 'National Savings Certificate (NSC)',
      score: Math.min(100, Math.round(25 + salariedRatio * 350 + literacyRate * 0.2)),
      keyDrivers: [
        `Salaried and small-scale business segment size (${Math.round(salariedRatio * 100)}%)`,
        `Low-risk fixed return (7.7%) for a 5-year lock-in period`,
        `Collateral utility for securing bank credit/loans`
      ],
      expectedImpact: Math.round(salariedWorkers * 0.10) || 15,
      campaignWindow: 'August 05 - August 15',
      reasoning: `Offers secure 5-year fixed return asset growth suitable for salaried individuals seeking tax-exempt growth.`,
      evidence: `Salaried workforce = ${salariedWorkers}`,
      gap: `Penetration gap = ${Math.max(20, Math.round(100 - salariedRatio * 200))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'KVP',
      name: 'Kisan Vikas Patra (KVP)',
      score: Math.min(100, Math.round(45 + agriRatio * 200)),
      keyDrivers: [
        `High agrarian segment presence (${Math.round(agriRatio * 100)}%) with lump sum post-harvest cash surplus`,
        `Simple capital doubling mechanism with zero market risk`,
        `Transferability and ease of liquidity parameters`
      ],
      expectedImpact: Math.round(agriWorkers * 0.12) || 25,
      campaignWindow: 'June 25 - July 05',
      reasoning: `Ideal for farmers looking to deposit post-harvest earnings into a secure capital-doubling scheme.`,
      evidence: `Agricultural workers = ${agriWorkers}`,
      gap: `Penetration gap = ${Math.max(15, Math.round(100 - agriRatio * 150))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'MSSC',
      name: 'Mahila Samman Savings Certificate (MSSC)',
      score: Math.min(100, Math.round(40 + (totF / totP) * 100 + (mLit - fLit) * 0.5)),
      keyDrivers: [
        `Target female population outreach (${Math.round((totF / totP) * 100)}% females)`,
        `Short-term 2-year savings with high fixed return (7.5%) for women`,
        `Empowers female savings and household financial control`
      ],
      expectedImpact: Math.round(totF * 0.12) || 20,
      campaignWindow: 'Ongoing / Special Women drives',
      reasoning: `Empowers the village's female segment with a high-interest 2-year fixed saving drive.`,
      evidence: `Female population = ${totF} (${Math.round((totF / totP) * 100)}% ratio)`,
      gap: `Penetration gap = ${Math.max(10, Math.round(100 - (totF / totP) * 150))}%`,
      source: 'Census + Postal DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'PMCARES',
      name: 'PM CARES for Children Scheme',
      score: Math.min(100, Math.round(10 + childRatio * 100)),
      keyDrivers: [
        `School-age child concentration (${Math.round(childRatio * 100)}% density)`,
        `Sovereign rehabilitation support for pandemic-orphaned minors`,
        `Comprehensive education and healthcare coverage linkages`
      ],
      expectedImpact: Math.round(childPop * 0.02) || 2,
      campaignWindow: 'Ongoing / Dedicated casework',
      reasoning: `A highly specialized scheme designed to support minors orphaned due to COVID-19.`,
      evidence: `School-age children = ${childPop}`,
      gap: `Identified case basis`,
      source: 'Census + Local Administration DB',
      lastUpdated: lastUpdated
    },

    // 2. India Post Payments Bank (IPPB) Accounts
    {
      schemeCode: 'IPPB_REG',
      name: 'Regular Savings Account',
      score: Math.min(100, Math.round(40 + literacyRate * 0.4 + (1 - agriRatio) * 20)),
      keyDrivers: [
        `General literacy rate (${literacyRate.toFixed(1)}%) supporting basic mobile banking usage`,
        `Instant digital onboarding via Aadhaar & PAN KYC`,
        `Low cost doorstep banking access for active transactions`
      ],
      expectedImpact: Math.round(totP * 0.15) || 40,
      campaignWindow: 'Ongoing / Digital banking drives',
      reasoning: `Acts as the gateway to digital financial inclusion and payments for literate villagers.`,
      evidence: `Total population = ${totP} (Literacy: ${literacyRate.toFixed(1)}%)`,
      gap: `Digital penetration gap = ${Math.max(15, Math.round(100 - literacyRate))}%`,
      source: 'Postal DB + IPPB Registry',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'IPPB_BAS',
      name: 'Basic Savings Account',
      score: Math.min(100, Math.round(50 + agriRatio * 150 - literacyRate * 0.2)),
      keyDrivers: [
        `Concentration of rural/agricultural workforce needing a basic account`,
        `Zero minimum balance requirement with no hidden fees`,
        `Primary link for Direct Benefit Transfer (DBT) subsidies`
      ],
      expectedImpact: Math.round(totP * 0.18) || 45,
      campaignWindow: 'Ongoing / DBT Drives',
      reasoning: `Designed as a zero-barrier digital transaction account for low-income segments.`,
      evidence: `Total population = ${totP} (Agricultural workers: ${agriWorkers})`,
      gap: `Subsidy linkage gap = ${Math.max(20, Math.round(100 - literacyRate * 0.8))}%`,
      source: 'Postal DB + Government DBT Registry',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'IPPB_DIGI',
      name: 'DigiSmart Savings Account',
      score: Math.min(100, Math.round(20 + youthRatio * 400 + literacyRate * 0.3)),
      keyDrivers: [
        `High density of young adults aged 18-24 (${Math.round(youthRatio * 100)}%)`,
        `App-based self-onboarding and high digital usage capability`,
        `Offers/discounts linked to digital card payments`
      ],
      expectedImpact: Math.round(youthPop * 0.15) || 15,
      campaignWindow: 'July 12 - July 22',
      reasoning: `Targeted at mobile-first young adults looking for modern app-based banking options.`,
      evidence: `Youth population (18-24) = ${youthPop}`,
      gap: `Digital adoption gap = ${Math.max(25, Math.round(100 - literacyRate))}%`,
      source: 'Postal DB + IPPB Registry',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'IPPB_PREM',
      name: 'Premium Savings Account',
      score: Math.min(100, Math.round(15 + salariedRatio * 300 + literacyRate * 0.2)),
      keyDrivers: [
        `Concentration of salaried/middle-class workers (${Math.round(salariedRatio * 100)}%)`,
        `Access to cashbacks, free virtual debit card, and zero-fee sweeps`,
        `Premium support and personalized doorstep services`
      ],
      expectedImpact: Math.round(salariedWorkers * 0.08) || 10,
      campaignWindow: 'August 01 - August 10',
      reasoning: `Targets regular transactional users desiring value-added banking benefits.`,
      evidence: `Salaried workforce = ${salariedWorkers}`,
      gap: `Premium services gap = ${Math.max(30, Math.round(100 - salariedRatio * 200))}%`,
      source: 'Postal DB + IPPB Registry',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'IPPB_AAR',
      name: 'Premium Aarogya Savings Account',
      score: Math.min(100, Math.round(18 + salariedRatio * 250 + seniorRatio * 150)),
      keyDrivers: [
        `Combination of salaried and senior citizen populations (${Math.round((salariedRatio + seniorRatio) * 100)}%)`,
        `Bundled healthcare benefits, including online doctor consultations and wellness discounts`,
        `Comprehensive accidental insurance cover included`
      ],
      expectedImpact: Math.round(totP * 0.05) || 12,
      campaignWindow: 'July 25 - August 05',
      reasoning: `Recommended to provide combined banking and primary healthcare/telehealth access.`,
      evidence: `Seniors & salaried = ${seniorPop + salariedWorkers}`,
      gap: `Health coverage gap = ${Math.max(25, Math.round(100 - seniorRatio * 300))}%`,
      source: 'Postal DB + Health Registry',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'IPPB_SHG',
      name: 'SHG Savings Account',
      score: Math.min(100, Math.round(35 + agriRatio * 150 + (totF / totP) * 100)),
      keyDrivers: [
        `High female ratio (${Math.round((totF / totP) * 100)}%) and agrarian workforce`,
        `Facilitates rural Self-Help Groups (SHGs) collective savings`,
        `Easier disbursement of micro-credit crop loans and business funds`
      ],
      expectedImpact: Math.round(agriWorkers * 0.10) || 15,
      campaignWindow: 'Ongoing / Community drives',
      reasoning: `Supports collective women-led micro-enterprises and group savings in rural areas.`,
      evidence: `Female population = ${totF} (Agri workers: ${agriWorkers})`,
      gap: `Self-help group penetration gap = ${Math.max(20, Math.round(100 - (totF / totP) * 150))}%`,
      source: 'Census + Rural Development DB',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'IPPB_CURR',
      name: 'Current Account',
      score: Math.min(100, Math.round(25 + salariedRatio * 250 + agriRatio * 100)),
      keyDrivers: [
        `Salaried, business, and trade workforce presence (${Math.round(salariedRatio * 100)}%)`,
        `Supports unlimited transactions with no daily deposit limits`,
        `Enables merchant payment integrations and billing features`
      ],
      expectedImpact: Math.round(salariedWorkers * 0.08) || 10,
      campaignWindow: 'Ongoing / Merchant campaigns',
      reasoning: `Designed for small merchants, shopkeepers, and self-employed entities needing business-grade transactions.`,
      evidence: `Salaried & self-employed workforce = ${salariedWorkers}`,
      gap: `Merchant banking gap = ${Math.max(25, Math.round(100 - salariedRatio * 150))}%`,
      source: 'Postal DB + IPPB Registry',
      lastUpdated: lastUpdated
    },

    // 3. Third-Party Government Schemes (Facilitated via IPPB)
    {
      schemeCode: 'PMJJBY',
      name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
      score: Math.min(100, Math.round(40 + (1 - seniorRatio - childRatio) * 100)),
      keyDrivers: [
        `Large working-age adult segment (${Math.round((1 - seniorRatio - childRatio) * 100)}% aged 18-50)`,
        `Low-cost term life insurance cover of ₹2 Lakh at just ₹436/year`,
        `Auto-debit ease from existing IPPB/POSB savings accounts`
      ],
      expectedImpact: Math.round(totP * 0.18) || 35,
      campaignWindow: 'June 01 - June 30 (Annual renewal window)',
      reasoning: `Provides critical life insurance security for active earning members of households.`,
      evidence: `Earning age cohort ratio = ${Math.round((1 - seniorRatio - childRatio) * 100)}%`,
      gap: `Social security coverage gap = ${Math.max(20, Math.round((seniorRatio + childRatio) * 150))}%`,
      source: 'Postal DB + Social Security Registry',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'PMSBY',
      name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
      score: Math.min(100, Math.round(45 + (1 - childRatio) * 100)),
      keyDrivers: [
        `High density of adult population (${Math.round((1 - childRatio) * 100)}% aged 18-70)`,
        `Ultra-affordable accident insurance cover (₹2 Lakh) at only ₹20/year`,
        `Ensures emergency financial safety against disability/demise`
      ],
      expectedImpact: Math.round(totP * 0.20) || 40,
      campaignWindow: 'June 01 - June 30 (Annual renewal window)',
      reasoning: `Provides essential, low-cost accidental insurance backing for all adult family members.`,
      evidence: `Adult population density = ${Math.round((1 - childRatio) * 100)}%`,
      gap: `Accident insurance gap = ${Math.max(15, Math.round(childRatio * 150))}%`,
      source: 'Postal DB + Social Security Registry',
      lastUpdated: lastUpdated
    },
    {
      schemeCode: 'APY',
      name: 'Atal Pension Yojana (APY)',
      score: Math.min(100, Math.round(35 + agriRatio * 200 + youthRatio * 200)),
      keyDrivers: [
        `Agrarian and unorganized workforce presence (${Math.round(agriRatio * 100)}%) aged 18-40`,
        `Guaranteed monthly pension (₹1,000 to ₹5,000) post 60 years`,
        `Auto-pension accumulation securing unorganized laborer futures`
      ],
      expectedImpact: Math.round(agriWorkers * 0.15) || 25,
      campaignWindow: 'July 10 - July 25',
      reasoning: `Critical social security scheme guaranteeing lifetime regular pension for informal/agricultural workers.`,
      evidence: `Unorganized & agricultural workforce = ${agriWorkers}`,
      gap: `Pension coverage gap = ${Math.max(15, Math.round(100 - agriRatio * 150))}%`,
      source: 'Postal DB + APY Registry',
      lastUpdated: lastUpdated
    }
  ];

  // Sort by score descending
  schemes.sort((a, b) => b.score - a.score);
  return schemes;
}
