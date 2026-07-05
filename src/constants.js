export const STANDARD_DEDUCTION_NEW = 75_000
export const STANDARD_DEDUCTION_OLD = 50_000
export const PROF_TAX_CAP = 2_500
export const EMPLOYER_NPS_PCT_OF_BASIC = 0.14
export const CAP_80C = 1_50_000
export const CAP_80CCD1B = 50_000
export const CAP_80D_SELF_BELOW60 = 25_000
export const CAP_80D_SELF_ABOVE60 = 50_000
export const CAP_80D_PARENTS_BELOW60 = 25_000
export const CAP_80D_PARENTS_ABOVE60 = 50_000
export const CAP_24B = 2_00_000
export const CAP_80TTA = 10_000
export const CAP_80TTB = 50_000
export const REBATE_87A_NEW_INCOME_LIMIT = 12_00_000
export const REBATE_87A_NEW_MAX = 60_000
export const MARGINAL_RELIEF_THRESHOLD = 12_00_000
export const REBATE_87A_OLD_INCOME_LIMIT = 5_00_000
export const REBATE_87A_OLD_MAX = 12_500
export const CESS_RATE = 0.04
export const HRA_METRO_PCT = 0.50
export const HRA_NONMETRO_PCT = 0.40

export const NEW_REGIME_SLABS = [
  { upTo: 4_00_000,  rate: 0.00 },
  { upTo: 8_00_000,  rate: 0.05 },
  { upTo: 12_00_000, rate: 0.10 },
  { upTo: 16_00_000, rate: 0.15 },
  { upTo: 20_00_000, rate: 0.20 },
  { upTo: 24_00_000, rate: 0.25 },
  { upTo: null,      rate: 0.30 },
]

export const OLD_REGIME_SLABS_BELOW60 = [
  { upTo: 2_50_000, rate: 0.00 },
  { upTo: 5_00_000, rate: 0.05 },
  { upTo: 10_00_000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
]

export const OLD_REGIME_SLABS_SENIOR = [
  { upTo: 3_00_000, rate: 0.00 },
  { upTo: 5_00_000, rate: 0.05 },
  { upTo: 10_00_000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
]

export const OLD_REGIME_SLABS_SUPER_SENIOR = [
  { upTo: 5_00_000, rate: 0.00 },
  { upTo: 10_00_000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
]

export const INITIAL_STATE = {
  fy: '2025-26',
  ageGroup: null,              // 'below60' | 'senior' | 'superSenior'
  basicSalaryMonthly: '',
  takeHomeSalaryMonthly: '',
  hasBonus: null,              // boolean | null
  bonus: '',                   // annual figure
  hasHRA: false,
  hraMonthly: '',
  hasProfTax: false,
  professionalTax: '',         // annual
  hasEmployerNPS: false,
  employerNPS: '',             // annual
  hasOtherIncome: null,        // boolean | null
  fdInterest: '',
  savingsInterest: '',
  paysRent: null,              // boolean | null
  monthlyRent: '',
  cityType: null,              // 'metro' | 'nonMetro'
  hasHRAInSalary: null,        // boolean | null
  investments80C: {
    epf: '',
    lic: '',
    ppf: '',
    elss: '',
    tuition: '',
    homeLoanPrincipal: '',
    nsc: '',
  },
  has80CItems: [],             // array of selected 80C keys
  hasPersonalNPS: null,        // boolean | null
  personalNPS: '',             // annual
  hasSelfInsurance: null,      // boolean | null
  selfInsurancePremium: '',    // annual
  hasParentInsurance: null,    // boolean | null
  parentInsurancePremium: '',  // annual
  parentsAbove60: null,        // boolean | null
  hasHomeLoan: null,           // boolean | null
  loanOwnership: null,         // 'own' | 'joint' | 'other'
  homeLoanInterest: '',        // annual
  hasTDS: null,                // boolean | null
  tdsDeducted: '',             // employer TDS
  bankTDS: '',                 // bank TDS on FD interest
}
