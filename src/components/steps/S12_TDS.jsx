import { useState, useRef } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { NumberInput } from '../NumberInput'
import { Receipt } from 'lucide-react'

const QUESTIONS = [
  { q: 'Where do I find how much TDS my employer deducted?', a: 'It\'s listed on your monthly salary slip. You can also find the annual total on your Form 16 (Part A) or in your Form 26AS available on the income tax portal.' },
  { q: 'What if I have multiple employers?', a: 'Add up the TDS deducted by ALL your employers during the financial year and enter the total amount here.' },
  { q: 'If TDS is already deducted, do I need to file a return?', a: 'Yes. TDS is just the tax collected in advance. You still must file your Income Tax Return (ITR) to declare your income and claim any refunds if excess tax was deducted.' },
  { q: 'What is Bank TDS?', a: 'If your FD interest exceeds ₹40,000 in a year (₹50,000 for senior citizens), the bank automatically deducts 10% tax on the interest before paying it to you. This is called Bank TDS.' },
  { q: 'My employer didn\'t deduct TDS. Is that a problem?', a: 'If your total income is below the taxable limit, no TDS is required. But if you have taxable income and no TDS was deducted, you will have to pay the entire tax amount yourself (Self Assessment Tax) before filing your ITR.' },
  { q: 'Will this calculator show my refund?', a: 'Yes! Once you enter your TDS, the final result screen will calculate your total tax and subtract the TDS to tell you exactly how much refund you\'ll get or how much tax is still due.' }
]

export function S12_TDS({ data, update, goNext, ...props }) {
  const faqRef = useRef(null)
  const [errors, setErrors] = useState({})

  function handleNext() {
    const newErrors = {}
    
    if (data.hasTDS === null) newErrors.hasTDS = 'Required'
    if (data.hasTDS === true && !data.tdsDeducted) newErrors.tdsDeducted = 'Required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    goNext()
  }

  const showBankTDS = data.hasOtherIncome && Number(data.fdInterest) > 0

  return (
    <div className="glass-card p-6 sm:p-10 mb-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Receipt className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Almost done
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-6">
        Does your employer deduct income tax from your salary every month?
      </h3>

      <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl mb-8">
        <p className="text-sm font-bold text-primaryText mb-3">How TDS works:</p>
        <ol className="text-xs text-secondaryText font-medium space-y-2 list-decimal list-inside">
          <li>Your company estimates your annual tax.</li>
          <li>They divide it by 12.</li>
          <li>They deduct this slice from your salary each month.</li>
          <li>They pay it to the government on your behalf.</li>
        </ol>
      </div>

      <div className="border-t border-bordercol pt-8 mb-8">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { update({ hasTDS: true }); setErrors(e => ({...e, hasTDS: null})) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasTDS === true ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => { update({ hasTDS: false, tdsDeducted: '' }); setErrors(e => ({...e, hasTDS: null})) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasTDS === false ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            No
          </button>
        </div>
        {errors.hasTDS && <p className="text-xs font-bold text-error mb-4 pl-2">Please select an option.</p>}

        {data.hasTDS === true && (
          <div className="reveal mt-6 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
            <NumberInput 
              id="tdsDeducted"
              label="Total employer TDS deducted for the whole year"
              value={data.tdsDeducted}
              onChange={(val) => { update({ tdsDeducted: val }); setErrors(e => ({...e, tdsDeducted: null})) }}
              hint="Multiply your monthly TDS by 12, or check your Form 16."
              required
            />
            {errors.tdsDeducted && <p className="text-xs font-bold text-error mt-2 pl-2">Required</p>}
          </div>
        )}

        {data.hasTDS === false && (
          <div className="reveal px-5 py-4 bg-warning/10 border border-warning/20 rounded-2xl mt-6">
            <p className="text-sm font-bold text-warning mb-1">No TDS Deducted</p>
            <p className="text-xs font-medium text-warning/80">If your final tax is greater than zero, you will have to pay the entire amount yourself before filing your return.</p>
          </div>
        )}
      </div>

      {showBankTDS && (
        <div className="border-t border-bordercol pt-8 mb-8">
          <h4 className="text-base font-bold text-primaryText mb-4">Did your bank deduct tax (TDS) on your FD interest?</h4>
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
            <p className="text-xs font-medium text-secondaryText mb-5">Banks usually deduct 10% TDS if your FD interest exceeds ₹40,000 (₹50,000 for seniors). Check your bank statement or Form 26AS.</p>
            <NumberInput 
              id="bankTDS"
              label="Total Bank TDS deducted (Optional)"
              value={data.bankTDS}
              onChange={(val) => update({ bankTDS: val })}
              placeholder="0"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleNext}
          className="bg-gradient-to-r from-success to-emerald-500 hover:from-success hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-xl text-base w-full md:w-auto shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-success/30 flex items-center justify-center gap-2"
        >
          Calculate My Tax →
        </button>
      </div>

      <div className="mt-10">
        <CommonQuestions ref={faqRef} questions={QUESTIONS} />
      </div>
    </div>
  )
}
