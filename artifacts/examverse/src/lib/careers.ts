export interface CareerOption {
  title: string;
  category: string;
  description: string;
  payBand?: string;
}

export interface CareerPath {
  exam: string;
  tagline: string;
  jobs: CareerOption[];
}

export const CAREER_PATHS: Record<string, CareerPath> = {
  JEE: {
    exam: "JEE",
    tagline: "Engineering and research careers across India's top institutes.",
    jobs: [
      { title: "Software Engineer", category: "IIT / NIT placement", description: "Top tech companies hire from JEE-fed colleges with 20-50 LPA packages.", payBand: "20-50 LPA" },
      { title: "Core Mechanical / Civil Engineer", category: "PSU / Private", description: "Design, R&D and operations roles at L&T, Tata, ISRO, BARC.", payBand: "8-18 LPA" },
      { title: "Data Scientist / ML Engineer", category: "Tech", description: "Analytics roles in fintech, e-commerce and product companies.", payBand: "12-30 LPA" },
      { title: "Research Scientist", category: "Academia / R&D", description: "MS / PhD route into IISc, IITs and global universities.", payBand: "Stipend + Research" },
      { title: "Product Manager", category: "Tech", description: "Common pivot for engineers into product and strategy roles.", payBand: "15-40 LPA" },
    ],
  },
  NEET: {
    exam: "NEET",
    tagline: "Medical and allied health professions.",
    jobs: [
      { title: "MBBS Doctor", category: "Clinical", description: "Practice as a general physician after completing MBBS + internship.", payBand: "8-15 LPA" },
      { title: "Specialist (MD / MS)", category: "Clinical Specialty", description: "Cardiology, Radiology, Surgery and other specialisations via NEET PG.", payBand: "20-60 LPA" },
      { title: "BDS Dentist", category: "Dental", description: "Independent practice, hospital roles or post-grad MDS.", payBand: "6-12 LPA" },
      { title: "Public Health Officer", category: "Government", description: "Roles in CMO offices, AIIMS, ICMR and state health missions.", payBand: "Level 10-13 GP" },
      { title: "Medical Researcher", category: "R&D", description: "Pharma, ICMR and biotech research labs.", payBand: "10-25 LPA" },
    ],
  },
  UPSC: {
    exam: "UPSC",
    tagline: "All India Civil Services and central government posts.",
    jobs: [
      { title: "IAS — Indian Administrative Service", category: "Civil Services", description: "District administration, policy and central deputation.", payBand: "Level 10 → Cabinet Sec" },
      { title: "IPS — Indian Police Service", category: "Civil Services", description: "Law enforcement, intelligence and central police organisations.", payBand: "Level 10 → DGP" },
      { title: "IFS — Indian Foreign Service", category: "Civil Services", description: "Diplomatic postings, embassies and MEA.", payBand: "Level 10 → Foreign Sec" },
      { title: "IRS — Income Tax / Customs", category: "Civil Services", description: "Direct and indirect tax administration.", payBand: "Level 10-15" },
      { title: "Indian Audit & Accounts Service", category: "Civil Services", description: "CAG of India, audit of union and state finances.", payBand: "Level 10-15" },
      { title: "Indian Railway Management Service", category: "Civil Services", description: "Unified service managing Indian Railways operations.", payBand: "Level 10-15" },
    ],
  },
  SSC: {
    exam: "SSC",
    tagline: "Group B and Group C posts in central government.",
    jobs: [
      { title: "Income Tax Inspector", category: "CBDT", description: "Field assessment, investigation and tax recovery.", payBand: "Level 7" },
      { title: "Assistant Section Officer (CSS)", category: "Central Secretariat", description: "Policy support roles in central ministries.", payBand: "Level 7" },
      { title: "Customs / GST Inspector", category: "CBIC", description: "Customs preventive, GST audit and anti-evasion.", payBand: "Level 7" },
      { title: "Sub-Inspector (CAPF / Delhi Police)", category: "Police", description: "Frontline law enforcement officer.", payBand: "Level 6" },
      { title: "Auditor / Accountant", category: "CAG / CGDA", description: "Audit and accounts in government organisations.", payBand: "Level 5-6" },
      { title: "Lower Division Clerk (CHSL)", category: "Clerical", description: "Entry-level central government office assistant.", payBand: "Level 2" },
    ],
  },
  GATE: {
    exam: "GATE",
    tagline: "PSU engineering jobs and post-graduate engineering admission.",
    jobs: [
      { title: "Executive Engineer (PSU)", category: "PSU", description: "ONGC, IOCL, GAIL, NTPC, BHEL, BPCL, HPCL, PowerGrid recruitment.", payBand: "12-18 LPA" },
      { title: "M.Tech / MS at IISc / IITs", category: "Academia", description: "MHRD scholarship + research opportunities.", payBand: "Stipend ₹12,400/m" },
      { title: "Junior Research Fellow (CSIR)", category: "Research", description: "Govt. R&D labs — DRDO, ISRO, BARC, CSIR.", payBand: "₹37,000/m + HRA" },
      { title: "Scientist 'B' (DRDO / ISRO)", category: "Defence Research", description: "Direct recruitment via GATE score.", payBand: "Level 10" },
      { title: "Engineering Faculty", category: "Academia", description: "Teaching positions in govt. and private engineering colleges.", payBand: "Level 10-14" },
    ],
  },
  BANK: {
    exam: "BANK",
    tagline: "Banking and financial sector careers across PSBs.",
    jobs: [
      { title: "Probationary Officer (PO)", category: "PSB Officer", description: "Branch banking, credit, treasury — fast track to AGM/DGM.", payBand: "8-12 LPA" },
      { title: "SBI PO / Associate Officer", category: "SBI", description: "Largest PSB — pan-India officer cadre roles.", payBand: "9-13 LPA" },
      { title: "Specialist Officer (IT / Law / HR)", category: "PSB Specialist", description: "Tech, legal, marketing and HR officer roles.", payBand: "9-14 LPA" },
      { title: "RBI Grade B Officer", category: "Central Bank", description: "Premier banking regulator — policy and supervision.", payBand: "12-16 LPA" },
      { title: "Clerk / Customer Associate", category: "PSB Clerical", description: "Branch operations and customer-facing roles.", payBand: "5-7 LPA" },
      { title: "NABARD Grade A/B", category: "Development Bank", description: "Rural and agricultural finance officer.", payBand: "10-14 LPA" },
    ],
  },
  CAT: {
    exam: "CAT",
    tagline: "MBA admissions to the IIMs and other top B-schools.",
    jobs: [
      { title: "Management Consultant", category: "Consulting", description: "MBB, Big 4 and tier-2 consulting roles.", payBand: "25-40 LPA" },
      { title: "Investment Banker", category: "Finance", description: "Front-office IB at GS, MS, JPM and domestic banks.", payBand: "25-45 LPA" },
      { title: "Product Manager", category: "Tech", description: "PM roles at top tech and consumer-internet companies.", payBand: "25-40 LPA" },
      { title: "Marketing / Brand Manager", category: "FMCG", description: "Marquee FMCG and consumer-products brand roles.", payBand: "20-30 LPA" },
      { title: "Operations / Supply Chain Manager", category: "Operations", description: "Manufacturing, logistics and e-commerce ops leadership.", payBand: "20-35 LPA" },
      { title: "Finance Manager / Equity Research", category: "Finance", description: "Corporate finance, ER, PE and VC roles.", payBand: "20-35 LPA" },
    ],
  },
  NDA: {
    exam: "NDA",
    tagline: "Officer entry into the Indian Armed Forces.",
    jobs: [
      { title: "Lieutenant — Indian Army", category: "Army", description: "Combat / support arms officer commission.", payBand: "Level 10 + MSP" },
      { title: "Sub-Lieutenant — Indian Navy", category: "Navy", description: "Executive, engineering and aviation branches.", payBand: "Level 10 + MSP" },
      { title: "Flying Officer — Indian Air Force", category: "Air Force", description: "Flying, technical and ground duty branches.", payBand: "Level 10 + MSP" },
      { title: "Pilot (Flying Branch)", category: "Air Force / Navy", description: "Specialised flying training after NDA.", payBand: "Level 10 + Flying Pay" },
    ],
  },
  CTET: {
    exam: "CTET",
    tagline: "Eligibility for central government school teacher recruitment.",
    jobs: [
      { title: "PRT — Primary Teacher (KVS)", category: "KVS", description: "Kendriya Vidyalaya primary teacher Class 1-5.", payBand: "Level 6" },
      { title: "TGT — Trained Graduate Teacher", category: "KVS / NVS", description: "Middle school teacher Class 6-8 in central schools.", payBand: "Level 7" },
      { title: "PGT — Post Graduate Teacher", category: "KVS / NVS", description: "Senior secondary teacher Class 11-12.", payBand: "Level 8" },
      { title: "Navodaya Vidyalaya Teacher", category: "NVS", description: "Residential school teacher in Jawahar Navodaya Vidyalayas.", payBand: "Level 6-8" },
      { title: "Army Public School Teacher", category: "APS", description: "Pan-India teaching opportunities in army schools.", payBand: "As per CBSE scale" },
    ],
  },
  KCET: {
    exam: "KCET",
    tagline: "Karnataka professional course admissions.",
    jobs: [
      { title: "Engineering Graduate (BE / B.Tech)", category: "Engineering", description: "Admission to RVCE, BMSCE, PESIT and other Karnataka colleges.", payBand: "5-15 LPA on graduation" },
      { title: "B.Pharm / Pharm.D", category: "Pharma", description: "Pharmacist, hospital pharmacist or pharma research.", payBand: "4-8 LPA" },
      { title: "B.Sc Agriculture", category: "Agriculture", description: "Govt. agriculture officer and agri-business roles.", payBand: "5-9 LPA" },
      { title: "BVSc — Veterinary Science", category: "Veterinary", description: "Animal husbandry officer and veterinary practice.", payBand: "5-10 LPA" },
      { title: "B.Arch — Architecture", category: "Architecture", description: "Architect at design firms and consultancies.", payBand: "4-12 LPA" },
    ],
  },
  TNPSC: {
    exam: "TNPSC",
    tagline: "Tamil Nadu state government services.",
    jobs: [
      { title: "Deputy Collector (Group I)", category: "TN Civil Services", description: "Revenue administration at sub-division level.", payBand: "Level 22" },
      { title: "DSP — Deputy Superintendent of Police", category: "TN Police", description: "State police service officer rank.", payBand: "Level 22" },
      { title: "Assistant Commissioner (CT / Registration)", category: "Revenue", description: "Commercial taxes and registration department.", payBand: "Level 22" },
      { title: "Group II — Sub Registrar", category: "Revenue", description: "Registration of property and documents.", payBand: "Level 17-19" },
      { title: "Group IV — VAO / Junior Assistant", category: "Clerical", description: "Village administrative officer and entry clerical posts.", payBand: "Level 8-12" },
    ],
  },
  TSPSC: {
    exam: "TSPSC",
    tagline: "Telangana state government services.",
    jobs: [
      { title: "Group I — Deputy Collector", category: "TS Civil Services", description: "Mandal and revenue division administration.", payBand: "Level 22" },
      { title: "DSP — Telangana Police", category: "TS Police", description: "Deputy Superintendent of Police.", payBand: "Level 22" },
      { title: "Commercial Tax Officer", category: "Revenue", description: "GST, excise and commercial taxes administration.", payBand: "Level 22" },
      { title: "Group II — Assistant Section Officer", category: "Secretariat", description: "Telangana state secretariat and HoD offices.", payBand: "Level 17-19" },
      { title: "Group IV — Junior Assistant", category: "Clerical", description: "Entry-level govt. office posts.", payBand: "Level 8-12" },
    ],
  },
};

export function findCareerPath(examCode: string | undefined): CareerPath {
  return CAREER_PATHS[examCode ?? "UPSC"] ?? CAREER_PATHS["UPSC"];
}
