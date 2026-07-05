import { useState } from 'react'
import { fmtNum } from '../../utils'
import { OLD_REGIME_SLABS_BELOW60, OLD_REGIME_SLABS_SENIOR, OLD_REGIME_SLABS_SUPER_SENIOR, NEW_REGIME_SLABS } from '../../constants'
import { ChevronDown, Check } from 'lucide-react'

function fmtN(n) { return Number(n).toLocaleString('en-IN') }

function fmtL(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  return fmtN(n)
}

function getOldSlabs(ageGroup) {
  if (ageGroup === 'senior') return OLD_REGIME_SLABS_SENIOR
  if (ageGroup === 'superSenior') return OLD_REGIME_SLABS_SUPER_SENIOR
  return OLD_REGIME_SLABS_BELOW60
}

function slabLabel(prev, upTo) {
  if (prev === 0) return upTo === null ? 'All' : `0 – ${fmtL(upTo)}`
  return upTo === null ? `${fmtL(prev)}+` : `${fmtL(prev)} – ${fmtL(upTo)}`
}

function computeSlabRows(taxableIncome, slabs) {
  let prev = 0
  const rows = []
  for (const { upTo, rate } of slabs) {
    const incomeInBand = Math.max(0, Math.min(taxableIncome, upTo || Infinity) - prev)
    const tax = Math.round(incomeInBand * rate)
    const active = incomeInBand > 0 && rate > 0
    rows.push({
      label: slabLabel(prev, upTo),
      rate: `${(rate * 100).toFixed(0)}%`,
      tax,
      active
    })
    prev = upTo
    if (taxableIncome <= upTo) break
  }
  return rows
}

function SectionHeader({ step, label }) {
  return (
    <div className="pt-6 pb-2 flex items-center gap-3">
      <div className="w-6 h-6 rounded-md bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center shrink-0">
        {step}
      </div>
      <h4 className="text-xs font-bold text-secondaryText uppercase tracking-widest">{label}</h4>
    </div>
  )
}

function Row({ label, newVal, oldVal, deduction, dimNew }) {
  return (
    <div className="flex items-center group hover:bg-gray-50/50 rounded-lg transition-colors">
      <div className="flex-1 py-2 pr-3 text-[13px] font-medium text-secondaryText pl-9">{label}</div>
      <div className={`w-[27%] shrink-0 py-2 px-3 text-[13px] font-bold text-right ${dimNew ? 'text-gray-300' : (deduction ? 'text-success' : 'text-primaryText')}`}>
        {newVal}
      </div>
      <div className={`w-[27%] shrink-0 py-2 pl-3 text-[13px] font-bold text-right ${deduction ? 'text-success' : 'text-primaryText'}`}>
        {oldVal}
      </div>
    </div>
  )
}

function ResultRow({ label, newVal, oldVal, isNewWinner, final }) {
  return (
    <div className={`rounded-xl py-3 flex items-center ${final ? 'bg-primary/5' : 'bg-gray-50/80'} ${final ? 'mt-4 mb-2' : 'my-2'}`}>
      <div className={`flex-1 pl-9 pr-3 ${final ? 'text-sm font-black text-primaryText' : 'text-xs font-bold text-secondaryText uppercase tracking-wider'}`}>{label}</div>
      <div className={`w-[27%] shrink-0 px-3 text-right ${final ? (isNewWinner ? 'text-success text-base font-black tracking-tight' : 'text-primaryText text-sm font-bold') : 'text-primary text-[13px] font-black'}`}>
        {newVal}
      </div>
      <div className={`w-[27%] shrink-0 pl-3 pr-4 text-right ${final ? (!isNewWinner ? 'text-success text-base font-black tracking-tight' : 'text-primaryText text-sm font-bold') : 'text-primary text-[13px] font-black'}`}>
        {oldVal}
      </div>
    </div>
  )
}

function SlabTable({ label, slabRows, totalTax, isWinner }) {
  return (
    <div className={`rounded-xl border-2 overflow-hidden flex flex-col ${isWinner ? 'border-primary/20 bg-primary/5' : 'border-bordercol bg-white'}`}>
      <div className={`px-3 py-2 text-xs font-bold flex items-center justify-between border-b-2 ${isWinner ? 'border-primary/10 bg-primary/10 text-primary' : 'border-bordercol bg-gray-50 text-secondaryText'}`}>
        {label}
        {isWinner && <Check className="w-3.5 h-3.5 text-primary" />}
      </div>
      <div className="divide-y divide-bordercol/50">
        {slabRows.map((row, i) => (
          <div key={i} className={`flex items-center px-2 py-1.5 text-[11px] gap-1 ${row.active ? 'bg-primary/5 text-primaryText font-bold' : 'text-gray-400 font-medium'}`}>
            <div className="flex-1 min-w-0 whitespace-nowrap text-[10px]">{row.label}</div>
            <div className="shrink-0 text-center opacity-70 text-[10px] w-7">{row.rate}</div>
            <div className="shrink-0 text-right text-[10px] min-w-0">{row.tax > 0 ? `₹${fmtN(row.tax)}` : '-'}</div>
          </div>
        ))}
      </div>
      <div className={`mt-auto border-t-2 flex items-center justify-between px-3 py-2 text-[11px] font-black ${isWinner ? 'border-primary/10 text-primary' : 'border-bordercol text-secondaryText'}`}>
        <span className="uppercase tracking-wider text-[9px] shrink-0 mr-1">Tax on slabs</span>
        <span className="text-right">₹{fmtN(totalTax)}</span>
      </div>
    </div>
  )
}

export function SectionC_DetailedBreakdown({ results, data }) {
  const [open, setOpen] = useState(false)
  
  const n = results.newRegime
  const o = results.oldRegime
  const isNewWinner = results.recommended === 'new'
  
  const newTaxAfterRebate = Math.max(0, n.slabTax - n.rebate - (n.marginalRelief || 0))
  const oldTaxAfterRebate = Math.max(0, o.slabTax - o.rebate)
  const newSlabRows = computeSlabRows(n.taxableIncome, NEW_REGIME_SLABS)
  const oldSlabRows = computeSlabRows(o.taxableIncome, getOldSlabs(data?.ageGroup))

  return (
    <div className="glass-card mb-6 overflow-hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 hover:bg-gray-50/50 flex items-center justify-between transition-colors focus:outline-none"
      >
        <span className="text-base font-bold text-primaryText">See detailed comparison</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-transform duration-300 ${open ? 'rotate-180 bg-primary/10 text-primary' : 'text-secondaryText'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-bordercol">
          <div className="flex mb-2">
            <div className="flex-1 pl-9"></div>
            <div className={`w-[27%] text-right text-[11px] font-black uppercase tracking-widest flex items-center justify-end gap-1 ${isNewWinner ? 'text-primary' : 'text-secondaryText'}`}>
              New {isNewWinner && <Check className="w-3 h-3 text-primary" />}
            </div>
            <div className={`w-[27%] text-right text-[11px] font-black uppercase tracking-widest pr-4 flex items-center justify-end gap-1 ${!isNewWinner ? 'text-primary' : 'text-secondaryText'}`}>
              Old {!isNewWinner && <Check className="w-3 h-3 text-primary" />}
            </div>
          </div>
          
          <SectionHeader step="1" label="Your total income" />
          <Row label="Gross Income" newVal={`₹${fmtN(n.grossIncome)}`} oldVal={`₹${fmtN(o.grossIncome)}`} />
          
          <SectionHeader step="2" label="Subtract deductions" />
          <Row label="Standard Deduction" newVal="− ₹75,000" oldVal="− ₹50,000" deduction />
          
          {o.professionalTaxDeduction > 0 && <Row label="Professional Tax" newVal="——" oldVal={`− ₹${fmtN(o.professionalTaxDeduction)}`} deduction dimNew />}
          {o.hraExemption > 0 && <Row label="HRA Exemption" newVal="——" oldVal={`− ₹${fmtN(o.hraExemption)}`} deduction dimNew />}
          {o.hraExemption === 0 && data.paysRent && data.hasHRA && <Row label="HRA Exemption" newVal="——" oldVal="₹0" deduction dimNew />}
          {o.deduction80C > 0 && <Row label="80C Investments" newVal="——" oldVal={`− ₹${fmtN(o.deduction80C)}`} deduction dimNew />}
          {o.deduction80D > 0 && <Row label="80D Health Insurance" newVal="——" oldVal={`− ₹${fmtN(o.deduction80D)}`} deduction dimNew />}
          {o.deductionPersonalNPS > 0 && <Row label="Personal NPS (80CCD1B)" newVal="——" oldVal={`− ₹${fmtN(o.deductionPersonalNPS)}`} deduction dimNew />}
          
          {(n.employerNPSDeduction > 0 || o.employerNPSDeduction > 0) && (
            <Row 
              label="Employer NPS (80CCD2)" 
              newVal={n.employerNPSDeduction > 0 ? `− ₹${fmtN(n.employerNPSDeduction)}` : '₹0'} 
              oldVal={o.employerNPSDeduction > 0 ? `− ₹${fmtN(o.employerNPSDeduction)}` : '₹0'} 
              deduction 
            />
          )}
          
          {o.deductionHomeLoanInterest > 0 && <Row label="Home Loan Interest (24b)" newVal="——" oldVal={`− ₹${fmtN(o.deductionHomeLoanInterest)}`} deduction dimNew />}
          {o.deduction80TTA_TTB > 0 && <Row label="Savings Interest (80TTA/TTB)" newVal="——" oldVal={`− ₹${fmtN(o.deduction80TTA_TTB)}`} deduction dimNew />}
          
          <ResultRow label="Taxable Income" newVal={`₹${fmtN(n.taxableIncome)}`} oldVal={`₹${fmtN(o.taxableIncome)}`} />
          
          <SectionHeader step="3" label="Apply tax slabs" />
          <div className="grid grid-cols-2 gap-3 mt-4 mb-6 pl-9">
            <SlabTable label="New Regime" slabRows={newSlabRows} totalTax={n.slabTax} isWinner={isNewWinner} />
            <SlabTable label="Old Regime" slabRows={oldSlabRows} totalTax={o.slabTax} isWinner={!isNewWinner} />
          </div>
          
          <Row 
            label="87A Rebate" 
            newVal={n.rebate > 0 ? `− ₹${fmtN(n.rebate)}` : '₹0'} 
            oldVal={o.rebate > 0 ? `− ₹${fmtN(o.rebate)}` : '₹0'} 
            deduction 
          />
          
          {(n.marginalRelief > 0 || o.marginalRelief > 0) && (
            <Row 
              label="Marginal Relief" 
              newVal={n.marginalRelief > 0 ? `− ₹${fmtN(n.marginalRelief)}` : '——'} 
              oldVal={o.marginalRelief > 0 ? `− ₹${fmtN(o.marginalRelief)}` : '——'} 
              deduction 
            />
          )}
          
          {(n.rebate > 0 || o.rebate > 0 || n.marginalRelief > 0) && (
            <div className="flex items-center py-2 font-bold text-[13px] bg-gray-50/50 rounded-lg my-1">
              <div className="flex-1 pr-3 text-secondaryText pl-9">= Tax after rebate</div>
              <div className={`w-[27%] shrink-0 px-3 text-right ${newTaxAfterRebate === 0 ? 'text-success' : 'text-primaryText'}`}>
                {newTaxAfterRebate === 0 ? '₹0 — no tax' : `₹${fmtN(newTaxAfterRebate)}`}
              </div>
              <div className={`w-[27%] shrink-0 pl-3 pr-3 text-right ${oldTaxAfterRebate === 0 ? 'text-success' : 'text-primaryText'}`}>
                {oldTaxAfterRebate === 0 ? '₹0 — no tax' : `₹${fmtN(oldTaxAfterRebate)}`}
              </div>
            </div>
          )}
          
          <Row 
            label="4% Health & Education Cess" 
            newVal={n.cess > 0 ? `+ ₹${fmtN(n.cess)}` : '₹0'} 
            oldVal={o.cess > 0 ? `+ ₹${fmtN(o.cess)}` : '₹0'} 
          />
          
          {(newTaxAfterRebate === 0 || oldTaxAfterRebate === 0) && (
            <p className="text-[11px] font-medium text-secondaryText italic pl-9 py-2">
              Cess is 4% of tax after rebate — when tax is zero, cess is also zero.
            </p>
          )}
          
          <ResultRow 
            label="Total Tax Payable" 
            newVal={`₹${fmtN(n.totalTax)}`} 
            oldVal={`₹${fmtN(o.totalTax)}`} 
            isNewWinner={isNewWinner} 
            final 
          />
          
          <p className="text-[11px] font-medium text-secondaryText mt-4 leading-relaxed bg-gray-50 p-3 rounded-lg border border-bordercol">
            <strong className="text-success font-bold">Green amounts (−)</strong> reduce your taxable income. Deduction caps already applied. "——" = not available in that regime.
          </p>
        </div>
      )}
    </div>
  )
}
