import * as C from './constants'
import { toNum, calc80CTotal } from './utils'

export function applySlabs(income, slabs) {
  if (income <= 0) return 0
  let tax = 0, prev = 0
  for (const { upTo, rate } of slabs) {
    if (upTo === null) { tax += (income - prev) * rate; break }
    if (income <= upTo) { tax += (income - prev) * rate; break }
    tax += (upTo - prev) * rate
    prev = upTo
  }
  return Math.round(tax)
}

export function calculateGrossIncome(data) {
  const takeHomeSalary = toNum(data.takeHomeSalaryMonthly) * 12
  const bonus = (data.hasBonus && toNum(data.bonus) > 0) ? toNum(data.bonus) : 0
  const fdInterest = (data.hasOtherIncome && toNum(data.fdInterest) > 0) ? toNum(data.fdInterest) : 0
  const savingsInterest = (data.hasOtherIncome && toNum(data.savingsInterest) > 0) ? toNum(data.savingsInterest) : 0
  return takeHomeSalary + bonus + fdInterest + savingsInterest
}

export function calculateHRAExemption(data) {
  if (!data.paysRent || !data.hasHRA || toNum(data.hraMonthly) <= 0) return 0
  const annualHRAReceived = toNum(data.hraMonthly) * 12
  const annualBasic = toNum(data.basicSalaryMonthly) * 12
  const hraPct = data.cityType === 'metro' ? C.HRA_METRO_PCT : C.HRA_NONMETRO_PCT
  const condition2 = hraPct * annualBasic
  const annualRentPaid = toNum(data.monthlyRent) * 12
  const condition3 = annualRentPaid - (0.10 * annualBasic)
  
  return Math.max(0, Math.min(annualHRAReceived, condition2, condition3))
}

export function calculateNewRegimeTax(data) {
  const grossIncome = calculateGrossIncome(data)
  const annualBasic = toNum(data.basicSalaryMonthly) * 12
  const employerNPS = data.hasEmployerNPS ? Math.min(toNum(data.employerNPS), C.EMPLOYER_NPS_PCT_OF_BASIC * annualBasic) : 0
  
  const taxableIncome = Math.max(0, grossIncome - C.STANDARD_DEDUCTION_NEW - employerNPS)
  const slabTax = applySlabs(taxableIncome, C.NEW_REGIME_SLABS)
  
  const rebate = (taxableIncome <= C.REBATE_87A_NEW_INCOME_LIMIT) ? Math.min(slabTax, C.REBATE_87A_NEW_MAX) : 0
  const taxAfterRebate = Math.max(0, slabTax - rebate)
  
  let marginalRelief = 0
  if (taxableIncome > C.MARGINAL_RELIEF_THRESHOLD && rebate === 0) {
    const excessIncome = taxableIncome - C.MARGINAL_RELIEF_THRESHOLD
    if (taxAfterRebate > excessIncome) {
      marginalRelief = taxAfterRebate - excessIncome
    }
  }
  
  const finalTaxAfterRebate = Math.max(0, taxAfterRebate - marginalRelief)
  const cess = Math.round(finalTaxAfterRebate * C.CESS_RATE)
  
  return {
    grossIncome,
    taxableIncome,
    standardDeduction: C.STANDARD_DEDUCTION_NEW,
    professionalTaxDeduction: 0,
    hraExemption: 0,
    deduction80C: 0,
    deduction80D: 0,
    deductionPersonalNPS: 0,
    employerNPSDeduction: employerNPS,
    deductionHomeLoanInterest: 0,
    deduction80TTA_TTB: 0,
    slabTax,
    rebate,
    marginalRelief,
    cess,
    totalTax: finalTaxAfterRebate + cess
  }
}

export function calculateOldRegimeTax(data) {
  const grossIncome = calculateGrossIncome(data)
  const annualBasic = toNum(data.basicSalaryMonthly) * 12
  
  const professionalTax = data.hasProfTax ? Math.min(toNum(data.professionalTax), C.PROF_TAX_CAP) : 0
  const hraExemption = calculateHRAExemption(data)
  const deduction80C = Math.min(calc80CTotal(data), C.CAP_80C)
  
  let deduction80D = 0
  if (data.hasSelfInsurance) {
    const isSenior = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
    const capSelf = isSenior ? C.CAP_80D_SELF_ABOVE60 : C.CAP_80D_SELF_BELOW60
    deduction80D += Math.min(toNum(data.selfInsurancePremium), capSelf)
  }
  if (data.hasParentInsurance) {
    const capParent = data.parentsAbove60 ? C.CAP_80D_PARENTS_ABOVE60 : C.CAP_80D_PARENTS_BELOW60
    deduction80D += Math.min(toNum(data.parentInsurancePremium), capParent)
  }
  
  const deductionHomeLoanInterest = (data.hasHomeLoan && data.loanOwnership !== 'other') ? Math.min(toNum(data.homeLoanInterest), C.CAP_24B) : 0
  
  let deduction80TTA_TTB = 0
  const isSenior = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  const savingsInt = data.hasOtherIncome ? toNum(data.savingsInterest) : 0
  const fdInt = data.hasOtherIncome ? toNum(data.fdInterest) : 0
  
  if (isSenior) {
    deduction80TTA_TTB = Math.min(savingsInt + fdInt, C.CAP_80TTB)
  } else {
    deduction80TTA_TTB = Math.min(savingsInt, C.CAP_80TTA)
  }
  
  const deductionPersonalNPS = data.hasPersonalNPS ? Math.min(toNum(data.personalNPS), C.CAP_80CCD1B) : 0
  const employerNPS = data.hasEmployerNPS ? Math.min(toNum(data.employerNPS), C.EMPLOYER_NPS_PCT_OF_BASIC * annualBasic) : 0
  
  const totalDeductions = C.STANDARD_DEDUCTION_OLD + professionalTax + hraExemption + deduction80C + deduction80D + deductionHomeLoanInterest + deduction80TTA_TTB + deductionPersonalNPS + employerNPS
  
  const taxableIncome = Math.max(0, grossIncome - totalDeductions)
  
  let slabs = C.OLD_REGIME_SLABS_BELOW60
  if (data.ageGroup === 'senior') slabs = C.OLD_REGIME_SLABS_SENIOR
  if (data.ageGroup === 'superSenior') slabs = C.OLD_REGIME_SLABS_SUPER_SENIOR
  
  const slabTax = applySlabs(taxableIncome, slabs)
  
  const isSuperSenior = data.ageGroup === 'superSenior'
  const rebate = (!isSuperSenior && taxableIncome <= C.REBATE_87A_OLD_INCOME_LIMIT) ? Math.min(slabTax, C.REBATE_87A_OLD_MAX) : 0
  const taxAfterRebate = Math.max(0, slabTax - rebate)
  
  const cess = Math.round(taxAfterRebate * C.CESS_RATE)
  
  return {
    grossIncome,
    taxableIncome,
    standardDeduction: C.STANDARD_DEDUCTION_OLD,
    professionalTaxDeduction: professionalTax,
    hraExemption,
    deduction80C,
    deduction80D,
    deductionPersonalNPS,
    employerNPSDeduction: employerNPS,
    deductionHomeLoanInterest,
    deduction80TTA_TTB,
    slabTax,
    rebate,
    marginalRelief: 0,
    cess,
    totalTax: taxAfterRebate + cess
  }
}

export function compareRegimes(newResult, oldResult) {
  const newTotal = newResult.totalTax || 0
  const oldTotal = oldResult.totalTax || 0
  const savings = Math.abs(newTotal - oldTotal)
  const recommended = newTotal <= oldTotal ? 'new' : 'old'
  return { recommended, savings }
}

export function calculateTDSPosition(totalTax, tdsDeducted) {
  if (tdsDeducted > totalTax) return { type: 'refund', amount: tdsDeducted - totalTax }
  if (tdsDeducted < totalTax) return { type: 'payable', amount: totalTax - tdsDeducted }
  return { type: 'settled', amount: 0 }
}

export function computeTax(data) {
  const newRegime = calculateNewRegimeTax(data)
  const oldRegime = calculateOldRegimeTax(data)
  const { recommended, savings } = compareRegimes(newRegime, oldRegime)
  
  const employerTDS = data.hasTDS ? toNum(data.tdsDeducted) : 0
  const bankTDS = (data.hasOtherIncome && data.hasTDS) ? toNum(data.bankTDS) : 0
  const tdsDeducted = employerTDS + bankTDS
  
  const targetTax = recommended === 'new' ? newRegime.totalTax : oldRegime.totalTax
  const tds = calculateTDSPosition(targetTax, tdsDeducted)
  
  return {
    newRegime,
    oldRegime,
    recommended,
    savings,
    tds,
    tdsDeducted,
    employerTDS,
    bankTDS
  }
}
