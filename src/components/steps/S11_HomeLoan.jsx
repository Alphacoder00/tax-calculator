import { useState, useRef } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { NumberInput } from '../NumberInput'
import { ConfusedLink } from '../ConfusedLink'
import { Key } from 'lucide-react'

const OWNERSHIP_OPTIONS = [
  { value: 'own', label: 'In my name only' },
  { value: 'joint', label: 'Joint with spouse or co-borrower' },
  { value: 'other', label: 'In someone else\'s name' }
]

const QUESTIONS = [
  { q: 'The loan is in my father\'s name, but I pay the EMI.', a: 'You cannot claim the tax deduction. The loan must be in your name (or joint) and you must be a co-owner of the property to claim the tax benefit.' },
  { q: 'I have two home loans. Can I claim both?', a: 'Yes, you can claim the interest for up to two self-occupied properties. However, the total combined deduction across all properties is still capped at ₹2,00,000 per year.' },
  { q: 'Can I claim both HRA and Home Loan?', a: 'Yes. If you live in a rented house in the city where you work, but own a house in a different city (or a house far from your workplace), you can claim BOTH the HRA exemption and the Home Loan interest deduction.' },
  { q: 'My house is still under construction.', a: 'You cannot claim the interest deduction while the house is under construction. Once construction is complete, you can claim the accumulated pre-construction interest in 5 equal annual installments.' },
  { q: 'What about the principal repayment?', a: 'The principal portion of your EMI goes under Section 80C (up to ₹1.5 Lakhs). We asked for that in the previous Investments step. This step is ONLY for the interest portion.' }
]

export function S11_HomeLoan({ data, update, goNext, ...props }) {
  const faqRef = useRef(null)
  const [errors, setErrors] = useState({})

  function handleNext() {
    const newErrors = {}
    
    if (data.hasHomeLoan === null) newErrors.hasHomeLoan = 'Required'
    if (data.hasHomeLoan === true) {
      if (!data.loanOwnership) newErrors.loanOwnership = 'Required'
      if ((data.loanOwnership === 'own' || data.loanOwnership === 'joint') && !data.homeLoanInterest) {
        newErrors.homeLoanInterest = 'Required'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    goNext()
  }

  function handleHomeLoanToggle(val) {
    update({ 
      hasHomeLoan: val, 
      loanOwnership: val ? data.loanOwnership : null,
      homeLoanInterest: val ? data.homeLoanInterest : ''
    })
    setErrors({})
  }

  return (
    <div className="glass-card p-6 sm:p-10 mb-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Key className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Home Loan
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-4">
        Do you have a home loan for a house you currently live in?
      </h3>
      <div className="mb-8">
        <p className="text-secondaryText font-medium mb-1">Home loan interest reduces taxable income under old regime only.</p>
        <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">Section 24(b) — max ₹2,00,000</span>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleHomeLoanToggle(true)}
          className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
            data.hasHomeLoan === true ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => handleHomeLoanToggle(false)}
          className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
            data.hasHomeLoan === false ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
          }`}
        >
          No
        </button>
      </div>
      {errors.hasHomeLoan && <p className="text-xs font-bold text-error mb-4 pl-2">Please select an option.</p>}

      {data.hasHomeLoan === true && (
        <div className="reveal space-y-6 mt-6 mb-8 border-t border-bordercol pt-8">
          <fieldset>
            <legend className="block text-sm font-bold text-primaryText tracking-wide mb-4">Is this loan in your name? <span className="text-error">*</span></legend>
            <div className="space-y-3">
              {OWNERSHIP_OPTIONS.map(opt => {
                const selected = data.loanOwnership === opt.value
                return (
                  <div 
                    key={opt.value}
                    onClick={() => { update({ loanOwnership: opt.value, homeLoanInterest: '' }); setErrors(e => ({...e, loanOwnership: null})) }}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-bordercol bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
                      }`}>
                        {selected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className={`font-bold ${selected ? 'text-primaryText' : 'text-secondaryText'}`}>{opt.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {errors.loanOwnership && <p className="text-xs font-bold text-error mt-2 pl-2">Please select an option.</p>}
          </fieldset>

          {data.loanOwnership === 'other' && (
            <div className="reveal px-5 py-4 bg-warning/10 border border-warning/20 rounded-2xl mt-6">
              <p className="text-sm font-bold text-warning mb-1">You cannot claim this deduction.</p>
              <p className="text-xs font-medium text-warning/80">According to Section 24(b), you can only claim the interest deduction if you are both a co-owner of the property AND a co-borrower on the loan.</p>
            </div>
          )}

          {(data.loanOwnership === 'own' || data.loanOwnership === 'joint') && (
            <div className="reveal p-6 bg-primary/5 border border-primary/10 rounded-2xl mt-6">
              <NumberInput 
                id="homeLoanInterest"
                label="How much interest did you pay on this home loan last year?"
                value={data.homeLoanInterest}
                onChange={(val) => { update({ homeLoanInterest: val }); setErrors(e => ({...e, homeLoanInterest: null})) }}
                note="Cap: ₹2,00,000. Check your bank's home loan interest certificate."
                hint={data.loanOwnership === 'joint' ? "Enter only your share — typically 50% of total interest. Each co-borrower can claim up to ₹2,00,000." : undefined}
                required
              />
              {errors.homeLoanInterest && <p className="text-xs font-bold text-error mt-2 pl-2">Required</p>}
            </div>
          )}
        </div>
      )}

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
