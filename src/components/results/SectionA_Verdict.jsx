import { fmtNum } from '../../utils'
import { Sparkles, CheckCircle2 } from 'lucide-react'

function getVerdictSentence(results, data) {
  const n = results.newRegime
  const o = results.oldRegime
  const winner = results.recommended === 'new' ? 'The New Regime' : 'The Old Regime'
  
  if (results.recommended === 'new' && n.totalTax === 0) {
    return 'Your income falls under ₹12.75 lakh. Under the new regime you pay zero tax this year. No investments needed, no paperwork required.'
  }
  
  if (results.savings > 0 && results.savings < 5000) {
    return `It's close — just ₹${fmtNum(results.savings)} difference. ${winner} edges out. But if your deductions change next year, revisit this calculation.`
  }
  
  if (results.recommended === 'new') {
    const totalOldDeductions = n.grossIncome - o.taxableIncome
    if (totalOldDeductions > 0) {
      return `Even with ₹${fmtNum(totalOldDeductions)} in deductions under the old regime, the new regime's lower slab rates still save you more money overall.`
    }
    return `Because you aren't claiming major tax deductions, the new regime's lower slab rates easily save you more money.`
  }
  
  // Old regime wins
  const reasons = []
  if (o.hraExemption > 0) reasons.push('HRA exemption')
  if (o.deduction80C > 0) reasons.push('80C investments')
  if (o.deduction80D > 0) reasons.push('health insurance premium')
  if (o.deductionHomeLoanInterest > 0) reasons.push('home loan interest')
  if (o.deductionPersonalNPS > 0) reasons.push('NPS contribution')
  
  let reasonText = 'Your deductions bring'
  if (reasons.length > 0) {
    if (reasons.length === 1) reasonText = `Your ${reasons[0]} brings`
    else if (reasons.length === 2) reasonText = `Your ${reasons[0]} and ${reasons[1]} bring`
    else reasonText = `Your ${reasons[0]}, ${reasons[1]} and other deductions bring`
  }
  
  return `${reasonText} your taxable income down significantly. The deductions outweigh the new regime's lower rates in your case.`
}

export function SectionA_Verdict({ results, data }) {
  const isNew = results.recommended === 'new'
  const isZeroTax = isNew && results.newRegime.totalTax === 0
  const otherRegime = isNew ? 'Old' : 'New'
  
  // We use primary brand colors for New Regime, and success for Old Regime
  const bgClass = isNew ? 'bg-gradient-to-br from-primary to-[#4F46E5]' : 'bg-gradient-to-br from-success to-emerald-700'
  const badgeClass = isNew ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
  const boxClass = isNew ? 'bg-black/10 border-white/10' : 'bg-black/10 border-white/10'
  
  return (
    <div className={`rounded-3xl p-6 sm:p-8 mb-4 shadow-xl shadow-primary/10 overflow-hidden relative ${bgClass}`}>
      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 p-10 opacity-20 transform translate-x-1/3 -translate-y-1/3">
        <Sparkles className="w-32 h-32 text-white" />
      </div>

      <div className="relative z-10">
        <div className={`inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-6 backdrop-blur-md ${badgeClass}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Recommended for you
        </div>
        
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          {isNew ? 'New Tax Regime' : 'Old Tax Regime'}
        </h2>
        
        <div className="mb-8">
          {isZeroTax ? (
            <>
              <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-2">₹0 tax</div>
              <div className="text-white/80 text-base font-medium">You pay zero tax this year</div>
            </>
          ) : (
            <>
              <div className="text-sm font-bold text-white/80 uppercase tracking-widest mb-1">You save</div>
              <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-2">
                ₹{fmtNum(results.savings)}
              </div>
              <div className="text-sm font-medium text-white/80">
                compared to the {otherRegime} regime
              </div>
            </>
          )}
        </div>
        
        <div className={`rounded-2xl p-5 border backdrop-blur-sm ${boxClass}`}>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            {getVerdictSentence(results, data)}
          </p>
        </div>
      </div>
    </div>
  )
}
