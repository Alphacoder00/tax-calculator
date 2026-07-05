import { useState, useRef } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { NumberInput } from '../NumberInput'
import { fmtNum } from '../../utils'
import { HeartPulse } from 'lucide-react'

const QUESTIONS = [
  { q: 'Can I claim deduction if my company provides group insurance?', a: 'No, you cannot claim a deduction for the premium paid by your employer. You can only claim the premium you pay out of your own pocket for an individual or family floater policy.' },
  { q: 'My father pays the premium for my policy. Who gets the deduction?', a: 'The person who pays the premium gets the deduction. If your father pays, he claims it. If you pay, you claim it.' },
  { q: 'Does this cover my spouse\'s parents (in-laws)?', a: 'No, the Section 80D deduction for parents applies only to your own parents, not to your spouse\'s parents.' },
  { q: 'My parents are above 60 but don\'t have health insurance.', a: 'If your parents are senior citizens and DO NOT have health insurance, you can claim up to ₹50,000 for medical expenses incurred for them.' },
  { q: 'Do I get any tax benefit if I don\'t have insurance?', a: 'You can claim up to ₹5,000 for preventive health check-ups (like full body scans) for yourself and your family under Section 80D, even without an insurance policy. This is within the overall cap.' }
]

function InsuranceCard({ title, subtitle, cap, checked, onToggle, amount, onAmountChange, amountError, badgeText, children }) {
  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all ${checked === true ? 'border-primary shadow-sm' : 'border-bordercol hover:border-gray-300 bg-white'}`}>
      <div className={`px-5 py-4 border-b ${checked === true ? 'bg-primary/5 border-primary/10' : 'bg-gray-50/50 border-gray-100'}`}>
        <div className="flex items-center gap-3 mb-1">
          <span className={`w-6 h-6 rounded-md text-[11px] font-black flex items-center justify-center shrink-0 ${checked === true ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{badgeText}</span>
          <h4 className="text-base font-bold text-primaryText">{title}</h4>
        </div>
        <p className="text-sm font-medium text-secondaryText ml-9">{subtitle}</p>
      </div>
      
      <div className={`px-5 py-4 ${checked === true ? 'bg-primary/5' : 'bg-white'}`}>
        <p className="text-sm font-bold text-primaryText mb-3">Do you personally pay a premium for this group?</p>
        <div className="flex gap-3">
          <button
            onClick={() => onToggle(true)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
              checked === true ? 'border-primary bg-primary text-white shadow-md' : 'border-bordercol bg-white text-secondaryText hover:bg-gray-50'
            }`}
          >
            Yes, I pay
          </button>
          <button
            onClick={() => onToggle(false)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
              checked === false ? 'border-primary bg-primary text-white shadow-md' : 'border-bordercol bg-white text-secondaryText hover:bg-gray-50'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {checked === true && (
        <div className="px-5 pb-5 bg-primary/5 border-t border-primary/10 pt-4">
          <NumberInput 
            id="premiumAmount"
            label="How much do you pay per year?"
            value={amount}
            onChange={onAmountChange}
            note={`Tax benefit capped at ₹${fmtNum(cap)} per year`}
          />
          {amountError && <p className="text-xs font-bold text-error mt-2">{amountError}</p>}
          
          {children && <div className="mt-5">{children}</div>}
        </div>
      )}
    </div>
  )
}

export function S10_HealthInsurance({ data, update, goNext, ...props }) {
  const faqRef = useRef(null)
  const [errors, setErrors] = useState({})

  function handleSelfToggle(val) {
    update({ hasSelfInsurance: val, selfInsurancePremium: val ? data.selfInsurancePremium : '' })
    setErrors(e => ({ ...e, hasSelfInsurance: null }))
  }

  function handleParentToggle(val) {
    update({ hasParentInsurance: val, parentInsurancePremium: val ? data.parentInsurancePremium : '', parentsAbove60: val ? data.parentsAbove60 : null })
    setErrors(e => ({ ...e, hasParentInsurance: null }))
  }

  const selfCap = (data.ageGroup === 'senior' || data.ageGroup === 'superSenior') ? 50000 : 25000
  const parentCap = data.parentsAbove60 ? 50000 : 25000

  const neitherPays = data.hasSelfInsurance === false && data.hasParentInsurance === false

  function handleNext() {
    const newErrors = {}
    
    if (data.hasSelfInsurance === null) newErrors.hasSelfInsurance = 'Required'
    if (data.hasParentInsurance === null) newErrors.hasParentInsurance = 'Required'
    
    if (data.hasSelfInsurance === true && !data.selfInsurancePremium) newErrors.selfPremium = 'Required'
    if (data.hasParentInsurance === true) {
      if (!data.parentInsurancePremium) newErrors.parentPremium = 'Required'
      if (data.parentsAbove60 === null) newErrors.parentsAge = 'Required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    goNext()
  }

  return (
    <div className="glass-card p-6 sm:p-10 mb-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <HeartPulse className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Health Insurance
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-4">
        Do you pay for health insurance?
      </h3>
      <div className="mb-8">
        <p className="text-secondaryText font-medium mb-1">There are <strong className="text-primaryText font-bold">two separate tax benefits</strong> here — one for insuring yourself and one for insuring your parents. Answer both cards below.</p>
        <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">Section 80D — old regime only</span>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <InsuranceCard 
            badgeText="1"
            title="For you, your spouse or children"
            subtitle="Any health insurance policy that covers you or your immediate family"
            cap={selfCap}
            checked={data.hasSelfInsurance}
            onToggle={handleSelfToggle}
            amount={data.selfInsurancePremium}
            onAmountChange={(val) => { update({ selfInsurancePremium: val }); setErrors(e => ({...e, selfPremium: null})) }}
            amountError={errors.selfPremium}
          />
          {errors.hasSelfInsurance && <p className="text-xs font-bold text-error mt-2 pl-2">Please answer this card.</p>}
        </div>

        <div>
          <InsuranceCard 
            badgeText="2"
            title="For your mother or father"
            subtitle="A separate policy covering your own parents (not in-laws)"
            cap={parentCap}
            checked={data.hasParentInsurance}
            onToggle={handleParentToggle}
            amount={data.parentInsurancePremium}
            onAmountChange={(val) => { update({ parentInsurancePremium: val }); setErrors(e => ({...e, parentPremium: null})) }}
            amountError={errors.parentPremium}
          >
            <div className="pt-5 border-t border-primary/10">
              <p className="text-sm font-bold text-primaryText mb-1">How old are your parents? <span className="text-error">*</span></p>
              <p className="text-[11px] font-medium text-secondaryText mb-3">This changes the cap — ₹50,000 if above 60, ₹25,000 if below 60.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { update({ parentsAbove60: true }); setErrors(e => ({...e, parentsAge: null})) }}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all border-2 ${
                    data.parentsAbove60 === true ? 'border-primary bg-primary text-white shadow-md' : 'border-primary/20 bg-white text-primary hover:bg-primary/5'
                  }`}
                >
                  Above 60
                </button>
                <button
                  onClick={() => { update({ parentsAbove60: false }); setErrors(e => ({...e, parentsAge: null})) }}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all border-2 ${
                    data.parentsAbove60 === false ? 'border-primary bg-primary text-white shadow-md' : 'border-primary/20 bg-white text-primary hover:bg-primary/5'
                  }`}
                >
                  Below 60
                </button>
              </div>
              {errors.parentsAge && <p className="text-xs font-bold text-error mt-2">{errors.parentsAge}</p>}
            </div>
          </InsuranceCard>
          {errors.hasParentInsurance && <p className="text-xs font-bold text-error mt-2 pl-2">Please answer this card.</p>}
        </div>
      </div>

      {neitherPays && (
        <div className="reveal px-5 py-4 bg-warning/10 border border-warning/20 rounded-2xl mb-8">
          <p className="text-sm font-bold text-warning mb-1">No Health Insurance</p>
          <p className="text-xs font-medium text-warning/80">No 80D deduction will be applied to your calculation.</p>
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
