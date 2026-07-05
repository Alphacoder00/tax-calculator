import { fmtNum } from '../../utils'
import { Sparkles, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, CheckCircle2 } from 'lucide-react'

function TDSMessage({ tds }) {
  if (tds.type === 'refund') {
    return (
      <div className="p-4 bg-success/10 border border-success/20 rounded-2xl mt-6">
        <h4 className="text-sm font-bold text-success mb-1.5 flex items-center gap-2">
          <ArrowDownToLine className="w-4 h-4" />
          Refund Expected: ₹{fmtNum(tds.amount)}
        </h4>
        <p className="text-xs font-medium text-success/90 leading-relaxed">
          Great news! Your employer deducted more tax than you owe. Claim this refund by filing your ITR.
        </p>
      </div>
    )
  }
  if (tds.type === 'payable') {
    return (
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-2xl mt-6">
        <h4 className="text-sm font-bold text-warning mb-1.5 flex items-center gap-2">
          <ArrowUpFromLine className="w-4 h-4" />
          Tax Payable: ₹{fmtNum(tds.amount)}
        </h4>
        <p className="text-xs font-medium text-warning/90 leading-relaxed">
          Your TDS was less than your tax liability. Pay this as Self Assessment Tax before filing.
        </p>
      </div>
    )
  }
  return (
    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl mt-6">
      <h4 className="text-sm font-bold text-primaryText mb-1.5 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-primary" />
        Fully Settled
      </h4>
      <p className="text-xs font-medium text-secondaryText leading-relaxed">
        Your TDS perfectly matches your tax liability. No pending tax to pay, no refund due.
      </p>
    </div>
  )
}

/** Shrink font-size based on number of digits to prevent overflow in fixed-width cards */
function TaxAmount({ amount }) {
  const str = fmtNum(amount)
  const fontSize = str.length > 9 ? 'text-lg' : str.length > 7 ? 'text-xl' : 'text-2xl sm:text-3xl'
  return (
    <div className={`${fontSize} font-black text-center tracking-tight text-primaryText leading-tight break-all`}>
      ₹{str}
    </div>
  )
}

export function SectionB_TaxSummary({ results, data }) {
  const isNewRec = results.recommended === 'new'
  const n = results.newRegime
  const o = results.oldRegime
  
  const hasFD = data.hasOtherIncome && Number(data.fdInterest) > 0
  const showAdvanceTaxWarning = hasFD && results.tds.type === 'payable' && results.tds.amount > 10000

  return (
    <div className="glass-card p-6 sm:p-8 mb-6">
      <h3 className="text-xl font-black text-primaryText mb-6 tracking-tight">Your Tax Summary</h3>
      
      {/* Tax comparison cards — stack vertically to avoid overflow on large numbers */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden ${isNewRec ? 'border-primary bg-primary/5 shadow-sm' : 'border-bordercol bg-gray-50/50'}`}>
          {isNewRec && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap uppercase tracking-widest">
              <Sparkles className="w-2.5 h-2.5" /> Best for you
            </div>
          )}
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 text-center ${isNewRec ? 'text-primary mt-2' : 'text-secondaryText'}`}>
            New Regime
          </div>
          <TaxAmount amount={n.totalTax} />
        </div>
        
        <div className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden ${!isNewRec ? 'border-success bg-success/5 shadow-sm' : 'border-bordercol bg-gray-50/50'}`}>
          {!isNewRec && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap uppercase tracking-widest">
              <Sparkles className="w-2.5 h-2.5" /> Best for you
            </div>
          )}
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 text-center ${!isNewRec ? 'text-success mt-2' : 'text-secondaryText'}`}>
            Old Regime
          </div>
          <TaxAmount amount={o.totalTax} />
        </div>
      </div>
      
      <div className="border-t border-bordercol pt-6">
        <div className="flex justify-between items-end mb-2 gap-2">
          <span className="text-xs font-bold text-secondaryText uppercase tracking-wider">Total Tax Deducted (TDS)</span>
          <span className="text-lg font-black text-primaryText tracking-tight shrink-0">₹{fmtNum(results.tdsDeducted)}</span>
        </div>
        
        {results.employerTDS > 0 && results.bankTDS > 0 && (
          <div className="flex justify-between items-center text-[10px] font-bold text-secondaryText/70 uppercase tracking-widest mt-2">
            <span>Employer: ₹{fmtNum(results.employerTDS)}</span>
            <span>Bank: ₹{fmtNum(results.bankTDS)}</span>
          </div>
        )}
        
        <p className="text-xs font-medium text-secondaryText mt-4 bg-gray-50/50 p-3 rounded-xl border border-bordercol">
          Refund or balance due is calculated against the <strong className="text-primaryText font-bold">{isNewRec ? 'New' : 'Old'} Regime</strong> (the one we recommend for you).
        </p>
      </div>

      <TDSMessage tds={results.tds} />
      
      {showAdvanceTaxWarning && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-error mt-0.5 shrink-0" />
          <p className="text-xs font-medium text-error/90 leading-relaxed">
            <strong className="font-bold text-error">Advance Tax Warning:</strong> Unpaid tax exceeding ₹10,000 (often from FD interest) requires Advance Tax in installments. Delays attract penalties under Section 234B/234C.
          </p>
        </div>
      )}
    </div>
  )
}
