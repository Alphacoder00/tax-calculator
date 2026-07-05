import { useState } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { Home } from 'lucide-react'

const QUESTIONS = [
  { q: 'What if I live with my parents and pay them rent?', a: 'Yes, if you genuinely transfer rent money to your parents and they declare it as rental income, you can claim HRA benefits. However, you cannot claim rent paid to your spouse.' },
  { q: 'I own a house in another city but rent here. Can I claim HRA?', a: 'Yes, if you are working in a different city and paying rent there, you can claim HRA exemption while simultaneously claiming home loan benefits for your owned property.' },
  { q: 'I share an apartment with roommates. What should I enter?', a: 'Enter only your share of the rent that you pay.' }
]

export function S07_PaysRent({ data, update, goNext, skipTo, ...props }) {
  const [error, setError] = useState(false)

  function handleNext() {
    if (data.paysRent === null) {
      setError(true)
      return
    }
    if (data.paysRent === false) {
      skipTo(9)
      return
    }
    goNext()
  }

  return (
    <div className="glass-card p-6 sm:p-10 mb-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Home className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Housing
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-8">
        Do you live in a rented house and personally pay the rent?
      </h3>

      <div className="border-t border-bordercol pt-8 mb-8">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { update({ paysRent: true }); setError(false) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.paysRent === true ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => { update({ paysRent: false }); setError(false) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.paysRent === false ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            No
          </button>
        </div>
        {error && <p className="text-xs font-bold text-error mt-2 mb-4">Please select an option.</p>}

        {data.paysRent === false && (
          <div className="reveal px-5 py-4 bg-warning/10 border border-warning/20 rounded-2xl mt-6">
            <p className="text-sm font-bold text-warning mb-1">No Rent, No HRA Exemption</p>
            <p className="text-xs font-medium text-warning/80">Since you don't pay rent, any HRA you receive from your employer will be fully taxable. We will skip the rent details section.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleNext} className="premium-btn-primary py-4 px-10 text-base w-full md:w-auto">
          Continue
        </button>
      </div>

      <div className="mt-8">
        <CommonQuestions questions={QUESTIONS} />
      </div>
    </div>
  )
}
