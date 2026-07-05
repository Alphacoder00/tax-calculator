import { useState, useRef } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { ConfusedLink } from '../ConfusedLink'
import { NumberInput } from '../NumberInput'
import { fmtNum } from '../../utils'
import { CAP_80C } from '../../constants'
import { CheckCircle2, TrendingUp } from 'lucide-react'

const FREQ_DEFAULTS = { epf: 'monthly', elss: 'monthly', homeLoanPrincipal: 'monthly', ppf: 'annual', lic: 'annual' }

const INVESTMENT_ITEMS = [
  { key: 'epf', label: 'EPF — money deducted from my salary every month', emoji: '💼', tag: '80C', description: 'Employee Provident Fund. Your employer deducts ~12% of your basic pay every month and deposits it in your EPF account.' },
  { key: 'lic', label: 'LIC or other life insurance premiums', emoji: '🛡️', tag: '80C', description: 'Premiums you personally pay for a term plan, endowment plan, or any life insurance policy for yourself, spouse, or kids.' },
  { key: 'ppf', label: 'PPF — Public Provident Fund', emoji: '📮', tag: '80C', description: 'A government savings scheme with a 15-year lock-in. You must deposit at least ₹500 every year to keep it active.' },
  { key: 'elss', label: 'ELSS — Tax saving mutual funds (SIP)', emoji: '📈', tag: '80C', description: 'Equity Linked Savings Scheme. A type of mutual fund with a 3-year lock-in. Often invested via monthly SIPs.' },
  { key: 'tuition', label: 'Children\'s school or college tuition fees', emoji: '🎓', tag: '80C', description: 'Tuition fees you paid for up to 2 children. Does not include development fees, transport, or donations.' },
  { key: 'homeLoanPrincipal', label: 'Home loan — principal repayment', emoji: '🏡', tag: '80C', description: 'The principal portion of your home loan EMI. Do not include the interest portion here.' },
  { key: 'nsc', label: 'NSC or Post Office time deposit', emoji: '📬', tag: '80C', description: 'National Savings Certificate (NSC) or Post Office Fixed Deposits (5-year lock-in).' }
]

const QUESTIONS = [
  { q: 'Is there a limit on 80C?', a: 'Yes, the maximum deduction you can claim under Section 80C is ₹1,50,000 per year, no matter how much you invest. This applies only to the Old Tax Regime.' },
  { q: 'Should I include my employer\'s EPF share?', a: 'No, only include your contribution (the employee share) which is deducted from your salary.' },
  { q: 'What is the difference between NPS and EPF?', a: 'EPF is mandatory for many employees, with fixed returns. NPS is a voluntary market-linked pension scheme. You get an EXTRA ₹50,000 deduction for personal NPS investments under Section 80CCD(1B), on top of the ₹1.5 Lakh 80C limit.' },
  { q: 'Home loan: Principal vs Interest?', a: 'Your EMI has two parts. The Principal repayment goes under 80C (limit ₹1.5L). The Interest payment goes under Section 24(b) (limit ₹2L). Check your loan statement for the exact breakdown.' },
  { q: 'What if I already hit the ₹1.5L limit with EPF?', a: 'If your EPF alone crosses ₹1,50,000, you don\'t need to declare ELSS, LIC, or PPF for tax purposes, as you\'ve already maxed out the benefit.' }
]

function FreqToggle({ freq, onChange }) {
  return (
    <div className="flex rounded-lg border border-bordercol overflow-hidden bg-gray-50/50 p-1 gap-1 shrink-0 mb-3 w-max">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        className={`px-4 py-1.5 text-[11px] font-bold transition-all rounded-md uppercase tracking-wider ${freq === 'monthly' ? 'bg-primary text-white shadow-md' : 'text-secondaryText hover:text-primaryText hover:bg-gray-100'}`}
      >
        Per month
      </button>
      <button
        type="button"
        onClick={() => onChange('annual')}
        className={`px-4 py-1.5 text-[11px] font-bold transition-all rounded-md uppercase tracking-wider ${freq === 'annual' ? 'bg-primary text-white shadow-md' : 'text-secondaryText hover:text-primaryText hover:bg-gray-100'}`}
      >
        Per year
      </button>
    </div>
  )
}

export function S09_TaxSavingInvestments({ data, update, goNext, goBack, skipTo, ...props }) {
  const faqRef = useRef(null)
  const [errors, setErrors] = useState({})
  
  const [frequencies, setFrequencies] = useState(() => {
    const init = {}
    INVESTMENT_ITEMS.forEach(({ key }) => { init[key] = FREQ_DEFAULTS[key] || 'annual' })
    return init
  })
  const [npsFreq, setNpsFreq] = useState('annual')

  function toggleItem(key) {
    const newItems = data.has80CItems.includes(key)
      ? data.has80CItems.filter(k => k !== key)
      : [...data.has80CItems, key]
    
    update({ has80CItems: newItems })
    if (!newItems.includes(key)) {
      update({ investments80C: { ...data.investments80C, [key]: '' } })
    }
    setErrors(e => ({ ...e, [key]: null }))
  }

  function handleItemChange(key, rawVal) {
    const num = Number(rawVal) || 0
    const annualVal = frequencies[key] === 'monthly' ? num * 12 : num
    update({ investments80C: { ...data.investments80C, [key]: rawVal === '' ? '' : annualVal } })
    setErrors(e => ({ ...e, [key]: null }))
  }

  function displayVal(key) {
    const stored = data.investments80C[key]
    if (stored === '' || stored === undefined) return ''
    return frequencies[key] === 'monthly' ? Math.round(Number(stored) / 12) : Number(stored)
  }

  function handleNPSChange(rawVal) {
    const num = Number(rawVal) || 0
    const annualVal = npsFreq === 'monthly' ? num * 12 : num
    update({ personalNPS: rawVal === '' ? '' : annualVal })
    setErrors(e => ({ ...e, personalNPS: null }))
  }

  const npsDisplayVal = data.personalNPS === '' ? '' : (npsFreq === 'monthly' ? Math.round(Number(data.personalNPS) / 12) : Number(data.personalNPS))

  const total80C = data.has80CItems.reduce((acc, key) => acc + (Number(data.investments80C[key]) || 0), 0)
  const cappedTotal = Math.min(total80C, CAP_80C)
  const hitCap = total80C >= CAP_80C

  function handleNext() {
    const newErrors = {}
    data.has80CItems.forEach(key => {
      if (!data.investments80C[key]) newErrors[key] = 'Required'
    })
    if (data.hasPersonalNPS === null) {
      newErrors.hasPersonalNPS = 'Required'
    } else if (data.hasPersonalNPS && !data.personalNPS) {
      newErrors.personalNPS = 'Required'
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
          <TrendingUp className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Tax Saving Investments
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-4">
        Do you make any of these investments?
      </h3>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <p className="text-secondaryText font-medium">These reduce your tax under the old regime only. Tick all that apply.</p>
        <ConfusedLink faqRef={faqRef} label="What are these?" />
      </div>

      <div className="space-y-4 mb-8">
        {INVESTMENT_ITEMS.map(({ key, label, emoji, tag, description }) => {
          const isSelected = data.has80CItems.includes(key)
          const hasFreq = key in FREQ_DEFAULTS
          
          return (
            <div key={key} className={`rounded-2xl border-2 overflow-hidden transition-all ${isSelected ? 'border-primary shadow-sm' : 'border-bordercol hover:border-gray-300'}`}>
              <div 
                className={`p-5 cursor-pointer flex items-start gap-4 ${isSelected ? 'bg-primary/5' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => toggleItem(key)}
              >
                <div className={`w-6 h-6 rounded-md border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xl">{emoji}</span>
                    <span className="font-bold text-primaryText text-lg leading-tight pr-2">{label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase shrink-0">{tag}</span>
                  </div>
                  <p className="text-sm text-secondaryText font-medium">{description}</p>
                </div>
              </div>

              {isSelected && (
                <div className="px-5 pb-5 bg-primary/5 border-t border-primary/10 pt-5">
                  {hasFreq ? (
                    <>
                      <p className="text-xs font-bold text-primary tracking-wide mb-2 uppercase">How are you entering this?</p>
                      <FreqToggle 
                        freq={frequencies[key]} 
                        onChange={(f) => setFrequencies(prev => ({...prev, [key]: f}))} 
                      />
                    </>
                  ) : (
                    <p className="text-xs font-bold text-primary tracking-wide mb-3 uppercase">Enter the annual total</p>
                  )}
                  
                  <NumberInput 
                    id={`inv-${key}`}
                    label={frequencies[key] === 'monthly' ? "Amount per month" : "Amount per year"}
                    value={displayVal(key)}
                    onChange={(val) => handleItemChange(key, val)}
                  />
                  {errors[key] && <p className="text-xs font-bold text-error mt-2">{errors[key]}</p>}
                  
                  {hasFreq && frequencies[key] === 'monthly' && Number(data.investments80C[key]) > 0 && (
                    <p className="text-xs font-bold text-primary mt-2 reveal">
                      = ₹{fmtNum(data.investments80C[key])} per year (what we use for tax calculation)
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {data.has80CItems.length > 0 && (
        <div className="reveal p-6 bg-white border-2 border-bordercol rounded-2xl space-y-3 mb-10 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-secondaryText uppercase tracking-wider">Your 80C total</span>
            <span className={`text-lg font-black tracking-tight ${hitCap ? 'text-success' : 'text-primaryText'}`}>
              ₹{fmtNum(cappedTotal)} <span className="text-secondaryText/60 font-medium text-sm">/ ₹1,50,000</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-bordercol">
            <div 
              className={`h-full transition-all duration-300 ${hitCap ? 'bg-success' : 'bg-primary'}`}
              style={{ width: `${Math.min(100, Math.round(total80C / CAP_80C * 100))}%` }}
            ></div>
          </div>
          {hitCap ? (
            <p className="text-xs text-success font-bold pt-1">🎉 You've hit the ₹1,50,000 cap! Any further 80C investments won't reduce your tax more.</p>
          ) : (
            <p className="text-xs text-secondaryText font-medium pt-1">₹{fmtNum(CAP_80C - total80C)} more can still earn a tax benefit.</p>
          )}
        </div>
      )}

      <div className="border-t border-bordercol pt-8 mb-8">
        <h4 className="text-base font-bold text-primaryText mb-1">Do you personally invest in NPS?</h4>
        <p className="text-sm text-secondaryText font-medium mb-6">NPS = National Pension System. A government retirement scheme. (Section 80CCD1B)</p>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { update({ hasPersonalNPS: true }); setErrors(e => ({...e, hasPersonalNPS: null})) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasPersonalNPS === true ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => { update({ hasPersonalNPS: false, personalNPS: '' }); setErrors(e => ({...e, hasPersonalNPS: null})) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasPersonalNPS === false ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            No
          </button>
        </div>
        {errors.hasPersonalNPS && <p className="text-xs font-bold text-error mb-4">{errors.hasPersonalNPS}</p>}

        {data.hasPersonalNPS === true && (
          <div className="reveal space-y-4 p-6 bg-primary/5 border border-primary/10 rounded-2xl mt-6">
            <p className="text-xs font-bold text-primary tracking-wide mb-2 uppercase">How are you entering this?</p>
            <FreqToggle 
              freq={npsFreq} 
              onChange={(f) => setNpsFreq(f)} 
            />
            <NumberInput 
              id="personalNPS"
              label={npsFreq === 'monthly' ? "Amount per month" : "Amount per year"}
              value={npsDisplayVal}
              onChange={(val) => handleNPSChange(val)}
            />
            {errors.personalNPS && <p className="text-xs font-bold text-error mt-2">{errors.personalNPS}</p>}
            
            {npsFreq === 'monthly' && Number(data.personalNPS) > 0 && (
              <p className="text-xs font-bold text-primary mt-2 reveal">
                = ₹{fmtNum(data.personalNPS)} per year
              </p>
            )}
            <div className="p-3 bg-white border border-bordercol rounded-xl mt-4">
              <p className="text-[11px] font-medium text-secondaryText">
                <span className="text-primaryText font-bold">Note:</span> Capped at ₹50,000 for deduction. Any extra doesn't reduce tax further.
              </p>
            </div>
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
