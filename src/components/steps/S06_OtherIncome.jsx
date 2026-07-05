import { useState, useRef } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { FrequencyInput } from '../FrequencyInput'
import { ConfusedLink } from '../ConfusedLink'
import { Landmark } from 'lucide-react'

const QUESTIONS = [
  { q: 'Why do I have to pay tax on FD interest?', a: 'The interest you earn on Fixed Deposits is considered "Income from Other Sources" by the Income Tax Department and is fully taxable at your slab rate.' },
  { q: 'Is Savings Account interest also taxable?', a: 'Yes, but under the old regime, you get a deduction (Section 80TTA) up to ₹10,000 per year on savings account interest (₹50,000 for senior citizens under Section 80TTB, which covers both FD and savings interest).' },
  { q: 'My bank already deducted TDS on my FD. Do I still owe tax?', a: 'Banks deduct TDS at 10%. If you fall in the 20% or 30% tax slab, you still have to pay the remaining tax. If you fall in a lower slab, you might get a refund.' },
  { q: 'Should I include my spouse\'s or parent\'s FD interest?', a: 'No, only enter the interest earned on FDs that are in your name (or where you are the primary account holder).' },
  { q: 'Is PPF interest taxable?', a: 'No, Public Provident Fund (PPF) interest is completely tax-free and should not be entered here.' },
  { q: 'What if I don\'t know the exact amount yet?', a: 'You can estimate it based on your FD principal and interest rate, or check your bank\'s mobile app for an "Interest Certificate" or "Form 26AS".' }
]

export function S06_OtherIncome({ data, update, goNext, ...props }) {
  const faqRef = useRef(null)
  const [error, setError] = useState(false)

  function handleNext() {
    if (data.hasOtherIncome === null) {
      setError(true)
      return
    }
    if (data.hasOtherIncome === false) {
      update({ fdInterest: '', savingsInterest: '' })
    }
    goNext()
  }

  return (
    <div className="glass-card p-6 sm:p-10 mb-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Landmark className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Other Income
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-4">
        Did your bank pay you any interest this year?
      </h3>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <p className="text-secondaryText font-medium">Interest from Fixed Deposits (FD) and Savings accounts is added to your income and taxed. Many people forget this.</p>
        <ConfusedLink faqRef={faqRef} label="What counts as interest income?" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-5 bg-white border border-bordercol rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏦</span>
            <h4 className="font-bold text-primaryText text-base">Fixed Deposit (FD)</h4>
          </div>
          <p className="text-sm text-secondaryText font-medium">Interest earned on money locked in an FD for 1–5 years.</p>
        </div>
        <div className="p-5 bg-white border border-bordercol rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💳</span>
            <h4 className="font-bold text-primaryText text-base">Savings Account</h4>
          </div>
          <p className="text-sm text-secondaryText font-medium">The small interest your bank pays on the balance in your regular account.</p>
        </div>
      </div>

      <div className="border-t border-bordercol pt-8 mb-8">
        <h4 className="text-sm font-bold text-primaryText mb-4">Did you earn any interest from FDs or savings accounts in FY 2025-26? <span className="text-error">*</span></h4>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { update({ hasOtherIncome: true }); setError(false) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasOtherIncome === true ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => { update({ hasOtherIncome: false }); setError(false) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasOtherIncome === false ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            No
          </button>
        </div>
        {error && <p className="text-xs font-bold text-error mt-2">Please select an option to continue</p>}

        {data.hasOtherIncome === true && (
          <div className="reveal space-y-6 p-6 bg-primary/5 border border-primary/10 rounded-2xl mt-6">
            <FrequencyInput 
              id="fdInterest"
              label="Total FD interest earned"
              value={data.fdInterest}
              onChange={(val) => update({ fdInterest: val })}
              hint="Add all FDs together. Enter 0 if you have no FDs."
            />
            <FrequencyInput 
              id="savingsInterest"
              label="Total savings account interest"
              value={data.savingsInterest}
              onChange={(val) => update({ savingsInterest: val })}
              hint="Usually a small amount. Check your annual bank statement. Enter 0 if negligible."
            />
            <div className="p-3 bg-white border border-bordercol rounded-xl">
              <p className="text-xs font-medium text-secondaryText">
                <span className="text-primaryText font-bold">Tip:</span> open your bank app → Statements → search for "Interest Credit" entries.
              </p>
            </div>
          </div>
        )}

        {data.hasOtherIncome === false && (
          <div className="reveal p-4 bg-gray-50 border border-bordercol rounded-xl text-sm font-medium text-secondaryText text-center mt-6">
            Got it — we'll assume no interest income.
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleNext} className="premium-btn-primary py-4 px-10 text-base w-full md:w-auto">
          Continue
        </button>
      </div>

      <div className="mt-8">
        <CommonQuestions ref={faqRef} questions={QUESTIONS} />
      </div>
    </div>
  )
}
