import { useState, useRef } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { NumberInput } from '../NumberInput'
import { FrequencyInput } from '../FrequencyInput'
import { ConfusedLink } from '../ConfusedLink'
import { FileText, CheckCircle2 } from 'lucide-react'

const COMPONENTS = [
  { key: 'hasHRA', label: 'HRA — House Rent Allowance', tag: 'Section 10(13A)', emoji: '🏠', description: 'A part of your salary meant for rent. Can be partially tax-free if you pay rent.' },
  { key: 'hasProfTax', label: 'Professional Tax', tag: 'Section 16(iii)', emoji: '🏛️', description: 'State govt tax deducted monthly from your salary. Usually ₹200/month (max ₹2,400/year).' },
  { key: 'hasEmployerNPS', label: 'Employer NPS contribution', tag: 'Section 80CCD(2)', emoji: '🏦', description: 'Your company puts money into your NPS retirement account as part of your pay package.' }
]

const QUESTIONS = [
  { q: 'Where do I find these components?', a: 'All of these will be clearly listed on your monthly salary slip or in your CTC (Cost to Company) breakdown document.' },
  { q: 'I get HRA but I don\'t pay rent', a: 'If you receive HRA but live in your own house or with parents without paying rent, the entire HRA amount is taxable. You should still tick the HRA box here so we can account for it correctly.' },
  { q: 'Is Professional Tax the same as Income Tax?', a: 'No, Professional Tax is a small tax levied by your State Government (like Karnataka, Maharashtra). Income tax is levied by the Central Government. The maximum Professional Tax anyone pays is ₹2,500 per year.' },
  { q: 'What is Employer NPS vs Personal NPS?', a: 'Employer NPS is when your company deposits money directly into your NPS account. Personal NPS is when you invest your own money from your bank account. This step is only for the Employer contribution.' },
  { q: 'Should I include my employer\'s EPF contribution?', a: 'No. Employer\'s contribution to EPF (usually 12% of basic) is generally tax-exempt up to ₹7.5 Lakhs and does not need to be entered for this calculation.' }
]

export function S05_SalaryComponents({ data, update, goNext, ...props }) {
  const faqRef = useRef(null)
  const [errors, setErrors] = useState({})

  function toggleComponent(key) {
    update({ [key]: !data[key] })
    setErrors(e => ({ ...e, [key]: null }))
  }

  function handleNext() {
    const newErrors = {}
    if (data.hasHRA && !data.hraMonthly) newErrors.hasHRA = 'Required'
    if (data.hasProfTax && !data.professionalTax) newErrors.hasProfTax = 'Required'
    if (data.hasEmployerNPS && !data.employerNPS) newErrors.hasEmployerNPS = 'Required'

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
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Salary Components
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-4">
        Does your salary slip show any of these?
      </h3>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <p className="text-secondaryText font-medium">Tick all that appear on your slip. Leave the rest blank.</p>
        <ConfusedLink faqRef={faqRef} label="What are these?" />
      </div>

      <div className="space-y-4 mb-8">
        {COMPONENTS.map(({ key, label, tag, emoji, description }) => {
          const isSelected = data[key]
          return (
            <div key={key} className={`rounded-2xl border-2 overflow-hidden transition-all ${isSelected ? 'border-primary shadow-sm' : 'border-bordercol hover:border-gray-300'}`}>
              <div 
                className={`p-5 cursor-pointer flex items-start gap-4 ${isSelected ? 'bg-primary/5' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => toggleComponent(key)}
              >
                <div className={`w-6 h-6 rounded-md border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xl">{emoji}</span>
                    <span className="font-bold text-primaryText text-lg">{label}</span>
                    {tag && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase">{tag}</span>}
                  </div>
                  <p className="text-sm text-secondaryText font-medium">{description}</p>
                </div>
              </div>

              {isSelected && (
                <div className="px-5 pb-5 bg-primary/5 border-t border-primary/10 pt-5">
                  {key === 'hasHRA' && (
                    <NumberInput 
                      id="hraMonthly"
                      label="How much HRA do you receive per month?"
                      value={data.hraMonthly}
                      onChange={(val) => { update({ hraMonthly: val }); setErrors(e => ({...e, hasHRA: null})) }}
                      hint="Find it on your salary slip under Earnings."
                      required
                    />
                  )}
                  {key === 'hasProfTax' && (
                    <FrequencyInput 
                      id="professionalTax"
                      label="How much Professional Tax is deducted?"
                      value={data.professionalTax}
                      onChange={(val) => { update({ professionalTax: val }); setErrors(e => ({...e, hasProfTax: null})) }}
                      placeholder="200"
                      note="Usually ₹200/month = ₹2,400/year. Maximum is ₹2,500 per year."
                      required
                    />
                  )}
                  {key === 'hasEmployerNPS' && (
                    <FrequencyInput 
                      id="employerNPS"
                      label="How much does your employer contribute to NPS?"
                      value={data.employerNPS}
                      onChange={(val) => { update({ employerNPS: val }); setErrors(e => ({...e, hasEmployerNPS: null})) }}
                      placeholder="0"
                      hint="Check your CTC breakdown or salary slip. This is your employer's contribution, not yours."
                      required
                    />
                  )}
                  {errors[key] && <p className="text-xs font-bold text-error mt-2">{errors[key]}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-sm font-medium text-secondaryText/70 text-center mb-8">
        If none of these appear on your slip, leave them all unticked and continue.
      </p>

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
