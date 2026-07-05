import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Calculator, Check, Zap } from 'lucide-react'
import { computeTax } from '../taxEngine'
import { fmtNum, toNum } from '../utils'
import { OLD_REGIME_SLABS_BELOW60, OLD_REGIME_SLABS_SENIOR, OLD_REGIME_SLABS_SUPER_SENIOR, NEW_REGIME_SLABS } from '../constants'

function SectionLabel({ letter, text }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-6 h-6 rounded-md bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
        {letter}
      </div>
      <h4 className="text-xs font-bold text-secondaryText uppercase tracking-widest">{text}</h4>
    </div>
  )
}

function LineRow({ label, amount, green, muted }) {
  return (
    <div className="flex justify-between items-center py-1 group">
      <span className={`text-xs font-medium transition-colors ${muted ? 'text-gray-400 group-hover:text-gray-500' : 'text-gray-500 group-hover:text-gray-700'}`}>{label}</span>
      <span className={`text-xs font-bold transition-colors ${green ? 'text-success' : (muted ? 'text-gray-400' : 'text-primaryText')}`}>
        {amount}
      </span>
    </div>
  )
}

function ResultBox({ label, amount, isPrimary }) {
  return (
    <div className={`flex justify-between items-center rounded-xl px-4 py-3 mt-3 transition-colors ${isPrimary ? 'bg-primary/5 border border-primary/20' : 'bg-gray-50 border border-bordercol'}`}>
      <span className={`text-xs font-bold uppercase tracking-wider ${isPrimary ? 'text-primary' : 'text-secondaryText'}`}>= {label}</span>
      <span className={`text-sm font-black tracking-tight ${isPrimary ? 'text-primary' : 'text-primaryText'}`}>{amount}</span>
    </div>
  )
}

function fmtL(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  return fmtNum(n)
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
      incomeInBand,
      tax,
      active
    })
    prev = upTo
    if (taxableIncome <= upTo) break
  }
  return rows
}

function getOldSlabs(ageGroup) {
  if (ageGroup === 'senior') return OLD_REGIME_SLABS_SENIOR
  if (ageGroup === 'superSenior') return OLD_REGIME_SLABS_SUPER_SENIOR
  return OLD_REGIME_SLABS_BELOW60
}

export function TaxPreviewPanel({ data }) {
  const [userPickedRegime, setUserPickedRegime] = useState(null)

  const results = computeTax(data)
  const o = results.oldRegime
  const n = results.newRegime

  const hasIncome = (results.newRegime.grossIncome || 0) > 0
  
  const autoRecommended = results.recommended || 'new'
  const regime = userPickedRegime || autoRecommended
  
  const activeData = regime === 'old' ? o : n
  
  const takeHomeSalary = toNum(data.takeHomeSalaryMonthly) * 12
  const bonus = (data.hasBonus && toNum(data.bonus) > 0) ? toNum(data.bonus) : 0
  const fdInterest = (data.hasOtherIncome && toNum(data.fdInterest) > 0) ? toNum(data.fdInterest) : 0
  const savingsInterest = (data.hasOtherIncome && toNum(data.savingsInterest) > 0) ? toNum(data.savingsInterest) : 0

  const slabRows = computeSlabRows(activeData.taxableIncome, regime === 'old' ? getOldSlabs(data.ageGroup) : NEW_REGIME_SLABS)

  return (
    <div className="glass-card overflow-hidden flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-bordercol bg-white/50">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-black text-primaryText uppercase tracking-widest">Live Tax Estimate</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {!hasIncome ? (
          <div className="px-6 py-16 text-center flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-[#FBF7F2] rounded-2xl flex items-center justify-center mb-4 border border-bordercol">
              <Calculator className="w-6 h-6 text-secondaryText/40" />
            </div>
            <p className="text-sm font-semibold text-secondaryText leading-relaxed">
              Enter your details on the left to see<br/>your live tax calculation here.
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col pb-6"
          >
            {/* Regime Toggle */}
            <div className="px-6 py-4">
              <div className="flex rounded-full bg-[#FBF7F2] border border-[#EDE6DD] p-1 w-full relative">
                <div 
                  className="absolute inset-y-1 rounded-full bg-white shadow-sm transition-all duration-300 ease-out border border-[#EDE6DD]"
                  style={{ width: 'calc(50% - 4px)', left: regime === 'new' ? '4px' : 'calc(50%)' }}
                />
                
                <button
                  type="button"
                  onClick={() => setUserPickedRegime('new')}
                  className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors rounded-full flex items-center justify-center gap-1.5 ${regime === 'new' ? 'text-primary' : 'text-secondaryText hover:text-primaryText'}`}
                >
                  New Regime
                  {autoRecommended === 'new' && <span className="bg-secondaryAccent text-white text-[9px] px-1.5 py-0.5 rounded-[4px] uppercase tracking-widest font-sans">Best</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setUserPickedRegime('old')}
                  className={`relative z-10 flex-1 py-2 text-xs font-bold transition-colors rounded-full flex items-center justify-center gap-1.5 ${regime === 'old' ? 'text-primary' : 'text-secondaryText hover:text-primaryText'}`}
                >
                  Old Regime
                  {autoRecommended === 'old' && <span className="bg-secondaryAccent text-white text-[9px] px-1.5 py-0.5 rounded-[4px] uppercase tracking-widest font-sans">Best</span>}
                </button>
              </div>
            </div>

            {/* Total Tax Banner */}
            <div className="px-6 mb-6">
              <div className="rounded-[20px] bg-primary p-6 text-white shadow-floating relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest mb-1 relative z-10">Total Tax Payable</p>
                <motion.div 
                  key={activeData.totalTax}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-serif font-semibold tracking-tight relative z-10"
                >
                  ₹{fmtNum(activeData.totalTax)}
                </motion.div>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-black/10 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  <span>Gross Income:</span>
                  <span className="text-white font-bold">₹{fmtNum(activeData.grossIncome)}</span>
                </div>
              </div>
            </div>

            {/* Savings Banner */}
            <AnimatePresence>
              {results.savings > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="px-6 overflow-hidden"
                >
                  <div className="flex items-center gap-3 bg-secondaryAccent/10 border border-secondaryAccent/20 rounded-[16px] px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-secondaryAccent/20 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-secondaryAccent" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-secondaryAccent tracking-tight">Save ₹{fmtNum(results.savings)}</div>
                      <div className="text-[11px] font-semibold text-secondaryAccent/80">by picking the {autoRecommended === 'new' ? 'New' : 'Old'} regime</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Breakdown */}
            <div className="px-6 space-y-6 pb-6">
              <div>
                <SectionLabel letter="A" text="Your Income" />
                <div className="space-y-1 pl-11">
                  <LineRow label="Annual salary (take-home)" amount={`₹${fmtNum(takeHomeSalary)}`} />
                  {bonus > 0 && <LineRow label="Bonus / incentive" amount={`₹${fmtNum(bonus)}`} />}
                  {fdInterest > 0 && <LineRow label="FD interest" amount={`₹${fmtNum(fdInterest)}`} />}
                  {savingsInterest > 0 && <LineRow label="Savings interest" amount={`₹${fmtNum(savingsInterest)}`} />}
                </div>
                <div className="pl-11">
                  <ResultBox label="Gross Income" amount={`₹${fmtNum(activeData.grossIncome || 0)}`} />
                </div>
              </div>

              <div>
                <SectionLabel letter="B" text="Deductions" />
                <div className="space-y-1 pl-11">
                  <LineRow label="Standard deduction" amount={regime === 'new' ? '− ₹75,000' : '− ₹50,000'} green />
                  {activeData.professionalTaxDeduction > 0 && <LineRow label="Professional Tax" amount={`− ₹${fmtNum(activeData.professionalTaxDeduction)}`} green />}
                  {activeData.employerNPSDeduction > 0 && <LineRow label="Employer NPS (80CCD2)" amount={`− ₹${fmtNum(activeData.employerNPSDeduction)}`} green />}
                  {regime === 'old' && activeData.hraExemption > 0 && <LineRow label="HRA Exemption" amount={`− ₹${fmtNum(activeData.hraExemption)}`} green />}
                  {regime === 'old' && activeData.deduction80C > 0 && <LineRow label="80C Investments" amount={`− ₹${fmtNum(activeData.deduction80C)}`} green />}
                  {regime === 'old' && activeData.deduction80D > 0 && <LineRow label="80D Health Insurance" amount={`− ₹${fmtNum(activeData.deduction80D)}`} green />}
                  {regime === 'old' && activeData.deductionPersonalNPS > 0 && <LineRow label="Personal NPS (80CCD1B)" amount={`− ₹${fmtNum(activeData.deductionPersonalNPS)}`} green />}
                  {regime === 'old' && activeData.deductionHomeLoanInterest > 0 && <LineRow label="Home Loan Int. (24b)" amount={`− ₹${fmtNum(activeData.deductionHomeLoanInterest)}`} green />}
                  {regime === 'old' && activeData.deduction80TTA_TTB > 0 && <LineRow label={data.ageGroup === 'senior' || data.ageGroup === 'superSenior' ? "Savings & FD Int. (80TTB)" : "Savings Int. (80TTA)"} amount={`− ₹${fmtNum(activeData.deduction80TTA_TTB)}`} green />}
                </div>
                
                {regime === 'new' && !data.hasEmployerNPS && (
                  <div className="ml-11 mt-3 flex items-start gap-2 p-3 bg-[#FBF7F2] border border-bordercol rounded-[16px]">
                    <CheckCircle2 className="w-4 h-4 text-secondaryAccent shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-primaryText leading-relaxed">Under the New Regime, standard deduction (₹75k) is the main deduction available.</p>
                  </div>
                )}
                
                <div className="pl-11">
                  <ResultBox label="Taxable Income" amount={`₹${fmtNum(activeData.taxableIncome)}`} isPrimary />
                </div>
              </div>

              <div>
                <SectionLabel letter="C" text="Tax Calculation" />
                <div className="pl-11 mb-4">
                  <div className="bg-[#FBF7F2] rounded-[16px] border border-bordercol overflow-hidden">
                    <div className="grid grid-cols-3 gap-2 px-4 py-2 border-b border-bordercol bg-white/50">
                      <div className="text-[10px] font-bold text-secondaryText uppercase">Slab</div>
                      <div className="text-[10px] font-bold text-secondaryText uppercase text-center">Rate</div>
                      <div className="text-[10px] font-bold text-secondaryText uppercase text-right">Tax</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {slabRows.map((row, i) => (
                        <div key={i} className={`grid grid-cols-3 gap-2 px-4 py-2 text-[11px] ${row.active ? 'bg-primary/5 text-primary font-bold' : 'text-secondaryText/50 font-medium'}`}>
                          <div className="truncate">{row.label}</div>
                          <div className="text-center">{row.rate}</div>
                          <div className="text-right">{row.tax > 0 ? `₹${fmtNum(row.tax)}` : '-'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1 pl-11">
                  {activeData.rebate > 0 && <LineRow label="87A Rebate" amount={`− ₹${fmtNum(activeData.rebate)}`} green />}
                  {activeData.marginalRelief > 0 && <LineRow label="Marginal Relief" amount={`− ₹${fmtNum(activeData.marginalRelief)}`} green />}
                  <LineRow label="Health & Ed Cess (4%)" amount={activeData.cess > 0 ? `+ ₹${fmtNum(activeData.cess)}` : '₹0'} muted={activeData.cess === 0} />
                </div>
                
                <div className="pl-11 mt-4">
                  <div className="flex justify-between items-center bg-primaryText rounded-[20px] px-5 py-4 shadow-lg">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Final Tax</span>
                    <motion.span 
                      key={`final-${activeData.totalTax}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xl font-black text-white"
                    >
                      ₹{fmtNum(activeData.totalTax)}
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
