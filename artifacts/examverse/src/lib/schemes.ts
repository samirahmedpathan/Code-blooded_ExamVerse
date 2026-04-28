export interface GovScheme {
  id: string;
  name: string;
  ministry: string;
  launchedYear: number;
  lastUpdatedYear: number;
  category: "Welfare" | "Economy" | "Health" | "Education" | "Agriculture" | "Defence" | "Infrastructure" | "Digital";
  beneficiaries: string;
  summary: string;
  yearlyUpdate: string;
  relevance: string[];
}

const CURRENT_YEAR = new Date().getFullYear();

export function currentSchemeYear(): number {
  return CURRENT_YEAR;
}

export const GOV_SCHEMES: GovScheme[] = [
  {
    id: "scheme-pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    launchedYear: 2019,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Agriculture",
    beneficiaries: "All landholding farmer families",
    summary:
      "Direct income support of ₹6,000 per year to eligible farmer families, paid in three equal instalments through DBT.",
    yearlyUpdate: `${CURRENT_YEAR}: e-KYC made mandatory for all instalments; outlay revised in Union Budget; coverage extended to tenant-farmer pilots in select states.`,
    relevance: ["UPSC", "SSC", "BANK", "TNPSC", "TSPSC"],
  },
  {
    id: "scheme-ayushman-bharat",
    name: "Ayushman Bharat — PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    launchedYear: 2018,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Health",
    beneficiaries: "Bottom 40% of population — SECC families",
    summary:
      "World's largest health-insurance scheme providing ₹5 lakh annual cover per family for secondary and tertiary hospitalization.",
    yearlyUpdate: `${CURRENT_YEAR}: Coverage extended to all senior citizens above 70 years irrespective of income; empanelled hospital network crosses 30,000.`,
    relevance: ["UPSC", "SSC", "NEET", "BANK"],
  },
  {
    id: "scheme-pmay",
    name: "PM Awas Yojana (Urban + Gramin)",
    ministry: "Ministry of Housing & Urban Affairs / Rural Development",
    launchedYear: 2015,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Welfare",
    beneficiaries: "Houseless families and kachha-house dwellers",
    summary:
      "Pucca houses with basic amenities for all eligible families — interest subvention for urban beneficiaries and direct grant for rural.",
    yearlyUpdate: `${CURRENT_YEAR}: PMAY 2.0 launched with target of 3 crore additional houses across rural and urban India over 5 years.`,
    relevance: ["UPSC", "SSC", "TNPSC", "TSPSC"],
  },
  {
    id: "scheme-nmms",
    name: "PM-SHRI Schools",
    ministry: "Ministry of Education",
    launchedYear: 2022,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Education",
    beneficiaries: "Students in 14,500 model schools",
    summary:
      "Upgrades selected schools across India to model NEP-aligned PM Schools for Rising India with modern infrastructure.",
    yearlyUpdate: `${CURRENT_YEAR}: 12,000+ schools onboarded across 28 states; experiential pedagogy and bag-less days rolled out nationally.`,
    relevance: ["UPSC", "CTET", "SSC"],
  },
  {
    id: "scheme-startup-india",
    name: "Startup India Seed Fund",
    ministry: "Department for Promotion of Industry & Internal Trade",
    launchedYear: 2021,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Economy",
    beneficiaries: "DPIIT-recognised early-stage startups",
    summary:
      "₹945 crore corpus offering up to ₹50 lakh per startup for proof of concept, prototype and market entry.",
    yearlyUpdate: `${CURRENT_YEAR}: Tier-2 and Tier-3 incubator coverage expanded; deeptech, agritech and climate-tech earmarked for priority funding.`,
    relevance: ["UPSC", "CAT", "BANK", "GATE"],
  },
  {
    id: "scheme-pmjjby",
    name: "PMJJBY & PMSBY (Jan Suraksha)",
    ministry: "Ministry of Finance",
    launchedYear: 2015,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Welfare",
    beneficiaries: "All bank-account holders aged 18-70",
    summary:
      "Low-cost life and accident insurance — ₹2 lakh life cover for ₹436/year and ₹2 lakh accident cover for ₹20/year.",
    yearlyUpdate: `${CURRENT_YEAR}: Cumulative enrolment crosses 23 crore; claim-settlement turnaround tightened to 30 days.`,
    relevance: ["BANK", "UPSC", "SSC"],
  },
  {
    id: "scheme-pli",
    name: "Production Linked Incentive (PLI)",
    ministry: "Ministry of Commerce & Industry",
    launchedYear: 2020,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Economy",
    beneficiaries: "Domestic manufacturers in 14 priority sectors",
    summary:
      "Output-linked incentives to boost domestic manufacturing and exports across electronics, semiconductors, pharma, autos and more.",
    yearlyUpdate: `${CURRENT_YEAR}: Disbursement crosses ₹14,000 crore; semiconductor and EV sector outlays topped up; new sub-scheme for green hydrogen.`,
    relevance: ["UPSC", "CAT", "GATE", "BANK"],
  },
  {
    id: "scheme-digital-india",
    name: "Digital India Programme",
    ministry: "Ministry of Electronics & IT",
    launchedYear: 2015,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Digital",
    beneficiaries: "All citizens — DBT, e-Gov, BharatNet",
    summary:
      "Umbrella programme for digital infrastructure, governance and services — Aadhaar, UPI, DigiLocker, BharatNet, ONDC.",
    yearlyUpdate: `${CURRENT_YEAR}: UPI processes >18 billion txns/month; ONDC catalogues open for groceries and mobility; DigiYatra at 24 airports.`,
    relevance: ["UPSC", "GATE", "CAT", "BANK"],
  },
  {
    id: "scheme-smart-cities",
    name: "Smart Cities Mission",
    ministry: "Ministry of Housing & Urban Affairs",
    launchedYear: 2015,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Infrastructure",
    beneficiaries: "100 selected cities and their citizens",
    summary:
      "Area-based and pan-city initiatives across 100 cities for sustainable, technology-driven urban development.",
    yearlyUpdate: `${CURRENT_YEAR}: Programme extended; 90% projects completed; integrated command-and-control centres operational in 100 cities.`,
    relevance: ["UPSC", "SSC", "TNPSC", "TSPSC"],
  },
  {
    id: "scheme-agnipath",
    name: "Agnipath Scheme",
    ministry: "Ministry of Defence",
    launchedYear: 2022,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Defence",
    beneficiaries: "Youth aged 17.5-23 across all three services",
    summary:
      "4-year tour-of-duty recruitment scheme for armed forces — 25% Agniveers retained for regular service.",
    yearlyUpdate: `${CURRENT_YEAR}: 4th batch of Agniveers inducted; reservation in CAPF, state police and PSU recruitment notified for retiring Agniveers.`,
    relevance: ["UPSC", "NDA", "SSC"],
  },
  {
    id: "scheme-jaljeevan",
    name: "Jal Jeevan Mission",
    ministry: "Ministry of Jal Shakti",
    launchedYear: 2019,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Welfare",
    beneficiaries: "All rural households",
    summary:
      "Functional household tap connection (FHTC) to every rural home with quality water at adequate pressure.",
    yearlyUpdate: `${CURRENT_YEAR}: Coverage crosses 80% of rural households; mission timeline extended to ${CURRENT_YEAR + 2} for saturation.`,
    relevance: ["UPSC", "SSC", "TNPSC", "TSPSC"],
  },
  {
    id: "scheme-skill-india",
    name: "Skill India — PMKVY 4.0",
    ministry: "Ministry of Skill Development & Entrepreneurship",
    launchedYear: 2015,
    lastUpdatedYear: CURRENT_YEAR,
    category: "Education",
    beneficiaries: "Youth seeking short-term and on-the-job training",
    summary:
      "Short-term skilling, recognition of prior learning and apprenticeship-embedded courses across 1,000+ job roles.",
    yearlyUpdate: `${CURRENT_YEAR}: PMKVY 4.0 prioritises AI, robotics, drones, EV and green-jobs; on-the-job training mandatory for 30% of certifications.`,
    relevance: ["UPSC", "SSC", "CAT", "BANK"],
  },
];

export function relevantSchemes(examCode: string | undefined): GovScheme[] {
  if (!examCode) return GOV_SCHEMES;
  return GOV_SCHEMES.filter((s) => s.relevance.includes(examCode));
}
