import { useState } from 'react'
import { fmtNum, toNum, calc80CTotal } from '../../utils'
import { CAP_80C, CAP_80CCD1B, CAP_24B, PROF_TAX_CAP, STANDARD_DEDUCTION_NEW, STANDARD_DEDUCTION_OLD } from '../../constants'
import { ChevronDown, BookOpen } from 'lucide-react'

function EducationRow({ what, taxName, treatment }) {
  return (
    <div className="p-4 bg-gray-50/50 hover:bg-primary/5 rounded-xl border border-bordercol transition-colors mb-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(91,92,235,0.5)]"></div>
        <div className="text-sm font-bold text-primaryText">{what}</div>
        <div className="text-[10px] text-primary font-black uppercase tracking-widest px-2.5 py-1 bg-primary/10 rounded-md">{taxName}</div>
      </div>
      <p className="text-xs font-medium text-secondaryText leading-relaxed pl-5">
        {treatment}
      </p>
    </div>
  )
}

export function SectionD_Education({ results, data }) {
  const [open, setOpen] = useState(false)
  const o = results.oldRegime
  const isSenior = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  
  const rows = []
  
  rows.push({
    what: "Salary income",
    taxName: "Income from Salary",
    treatment: "Fully taxable in both regimes. This forms the base of your calculation."
  })
  
  if (data.hasHRA && toNum(data.hraMonthly) > 0) {
    if (data.paysRent) {
      rows.push({
        what: "HRA from your company",
        taxName: "Section 10(13A)",
        treatment: `Because you pay rent, it is partially exempt under the old regime. Your calculated exemption is ₹${fmtNum(o.hraExemption)}. Fully taxable under the new regime.`
      })
    } else {
      rows.push({
        what: "HRA from your company",
        taxName: "Section 10(13A)",
        treatment: "Because you don't pay rent, your HRA is fully taxable in both regimes."
      })
    }
  }
  
  if (data.hasBonus && toNum(data.bonus) > 0) {
    rows.push({
      what: "Bonus / incentive",
      taxName: "Income from Salary",
      treatment: "Fully taxable in both regimes, added directly to your gross salary."
    })
  }
  
  if (data.hasOtherIncome && toNum(data.fdInterest) > 0) {
    rows.push({
      what: "FD interest",
      taxName: "Income from Other Sources",
      treatment: isSenior 
        ? "Added to your income, but you can claim a deduction up to ₹50,000 under Section 80TTB in the old regime."
        : "Fully taxable in both regimes. No deduction is available for FD interest for non-seniors."
    })
  }
  
  if (data.hasOtherIncome && toNum(data.savingsInterest) > 0) {
    rows.push({
      what: "Savings account interest",
      taxName: isSenior ? "Section 80TTB" : "Section 80TTA",
      treatment: isSenior
        ? "Added to your income. Deductible up to ₹50,000 (combined with FD interest) under the old regime."
        : "Added to your income. Deductible up to ₹10,000 under the old regime."
    })
  }
  
  rows.push({
    what: "Standard deduction",
    taxName: "Section 16(ia)",
    treatment: `Auto-applied. You get ₹${fmtNum(STANDARD_DEDUCTION_NEW)} in the new regime, and ₹${fmtNum(STANDARD_DEDUCTION_OLD)} in the old regime.`
  })
  
  if (data.hasProfTax && toNum(data.professionalTax) > 0) {
    rows.push({
      what: "Professional tax",
      taxName: "Section 16(iii)",
      treatment: `Old regime only. Deductible up to ₹${fmtNum(PROF_TAX_CAP)}. New regime ignores this completely.`
    })
  }
  
  const total80C = calc80CTotal(data)
  if (total80C > 0) {
    rows.push({
      what: "EPF, LIC, PPF, ELSS, etc.",
      taxName: "Section 80C",
      treatment: `You entered ₹${fmtNum(total80C)}. Under the old regime, this is deductible up to a maximum of ₹${fmtNum(CAP_80C)}.`
    })
  }
  
  if (data.hasPersonalNPS && toNum(data.personalNPS) > 0) {
    rows.push({
      what: "Your personal NPS investment",
      taxName: "Section 80CCD(1B)",
      treatment: `Under the old regime, you get a deduction of ₹${fmtNum(o.deductionPersonalNPS)} (capped at ₹${fmtNum(CAP_80CCD1B)}), which is over and above the 80C limit.`
    })
  }
  
  if (data.hasEmployerNPS && toNum(data.employerNPS) > 0) {
    rows.push({
      what: "Employer's NPS contribution",
      taxName: "Section 80CCD(2)",
      treatment: "Available in BOTH regimes! Capped at 14% of your basic salary."
    })
  }
  
  if (data.hasSelfInsurance && toNum(data.selfInsurancePremium) > 0) {
    rows.push({
      what: "Health insurance premium",
      taxName: "Section 80D",
      treatment: `Deductible under the old regime. Your total allowed deduction for self/family/parents is ₹${fmtNum(o.deduction80D)} based on age limits.`
    })
  }
  
  if (data.hasHomeLoan && data.loanOwnership !== 'other' && toNum(data.homeLoanInterest) > 0) {
    rows.push({
      what: "Home loan interest",
      taxName: "Section 24(b)",
      treatment: `Under the old regime, deductible up to ₹${fmtNum(CAP_24B)} for a self-occupied property.`
    })
  }
  
  rows.push({
    what: "Government tax rebate",
    taxName: "Section 87A",
    treatment: "Wipes out your tax if income is below a threshold. New regime: rebate up to ₹60,000 if income ≤ ₹12L. Old regime: rebate up to ₹12,500 if income ≤ ₹5L."
  })
  
  rows.push({
    what: "Health & Education Cess",
    taxName: "Finance Act",
    treatment: "A flat 4% added to your final tax amount (after all rebates) in both regimes."
  })

  return (
    <div className="glass-card mb-6 overflow-hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 hover:bg-gray-50/50 flex items-center justify-between transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="text-base font-bold text-primaryText">How did we calculate this?</span>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-transform duration-300 ${open ? 'rotate-180 bg-primary/10 text-primary' : 'text-secondaryText'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-bordercol">
          <p className="text-xs font-bold text-secondaryText uppercase tracking-widest mt-2 mb-6">
            Rules mapped to your inputs
          </p>
          
          <div className="flex flex-col">
            {rows.map((row, i) => (
              <EducationRow key={i} what={row.what} taxName={row.taxName} treatment={row.treatment} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
