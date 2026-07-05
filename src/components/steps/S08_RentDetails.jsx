import { useState } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { NumberInput } from '../NumberInput'
import { Home } from 'lucide-react'

const QUESTIONS = [
  { q: 'Why do you need to know my city?', a: 'HRA rules differentiate between Metro cities (Delhi, Mumbai, Chennai, Kolkata) and Non-Metro cities (everywhere else). Metro residents can claim up to 50% of their basic pay, while non-metro residents can claim up to 40%.' },
  { q: 'I live in Bangalore/Hyderabad/Pune. Is it a metro?', a: 'For income tax purposes, ONLY Delhi, Mumbai, Chennai, and Kolkata are considered Metro cities. All other cities, including Bangalore, Hyderabad, Pune, and Gurgaon, are classified as Non-Metro.' },
  { q: 'What if I pay rent but don\'t get HRA?', a: 'If your salary doesn\'t include an HRA component, you cannot claim the standard HRA exemption under Section 10(13A). You might be eligible for a smaller deduction under Section 80GG (not covered in this calculator).' },
  { q: 'Do I need to submit rent receipts?', a: 'Your employer will usually ask for rent receipts to give you the HRA tax benefit in your monthly TDS. If your annual rent exceeds ₹1,00,000 (approx ₹8,333/month), you must also submit your landlord\'s PAN.' }
]

export function S08_RentDetails({ data, update, goNext, ...props }) {
  const [errors, setErrors] = useState({})

  function handleNext() {
    const newErrors = {}
    if (!data.monthlyRent) newErrors.monthlyRent = 'Required'
    if (!data.cityType) newErrors.cityType = 'Required'
    if (data.hasHRAInSalary === null) newErrors.hasHRAInSalary = 'Required'

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
          <Home className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Housing
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-8">
        Tell us about your rent
      </h3>

      <div className="space-y-8 mb-8">
        <div>
          <NumberInput 
            id="monthlyRent"
            label="How much rent do you pay per month?"
            value={data.monthlyRent}
            onChange={(val) => { update({ monthlyRent: val }); setErrors(e => ({...e, monthlyRent: null})) }}
            required
          />
          {errors.monthlyRent && <p className="text-xs font-bold text-error mt-2">{errors.monthlyRent}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-primaryText tracking-wide mb-3">Which city do you live in? <span className="text-error">*</span></label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div 
              onClick={() => { update({ cityType: 'metro' }); setErrors(e => ({...e, cityType: null})) }}
              className={`flex-1 p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.cityType === 'metro' ? 'border-primary bg-primary/5 shadow-sm' : 'border-bordercol bg-white hover:border-gray-300 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.cityType === 'metro' ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}>
                  {data.cityType === 'metro' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div>
                  <div className="font-bold text-primaryText">Metro City</div>
                  <div className="text-[11px] font-medium text-secondaryText leading-tight mt-1">Delhi, Mumbai, Chennai, Kolkata</div>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => { update({ cityType: 'nonMetro' }); setErrors(e => ({...e, cityType: null})) }}
              className={`flex-1 p-5 rounded-2xl border-2 cursor-pointer transition-all ${data.cityType === 'nonMetro' ? 'border-primary bg-primary/5 shadow-sm' : 'border-bordercol bg-white hover:border-gray-300 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.cityType === 'nonMetro' ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}>
                  {data.cityType === 'nonMetro' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div>
                  <div className="font-bold text-primaryText">Non-Metro City</div>
                  <div className="text-[11px] font-medium text-secondaryText leading-tight mt-1">Bangalore, Pune, Hyderabad, and all others</div>
                </div>
              </div>
            </div>
          </div>
          {errors.cityType && <p className="text-xs font-bold text-error mt-2">{errors.cityType}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-primaryText tracking-wide mb-3">Does your salary include an HRA component? <span className="text-error">*</span></label>
          <div className="flex gap-4">
            <button
              onClick={() => { update({ hasHRAInSalary: true }); setErrors(e => ({...e, hasHRAInSalary: null})) }}
              className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                data.hasHRAInSalary === true ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => { update({ hasHRAInSalary: false }); setErrors(e => ({...e, hasHRAInSalary: null})) }}
              className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                data.hasHRAInSalary === false ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
              }`}
            >
              No
            </button>
          </div>
          {errors.hasHRAInSalary && <p className="text-xs font-bold text-error mt-2">{errors.hasHRAInSalary}</p>}
        </div>
      </div>

      {data.hasHRAInSalary === false && (
        <div className="reveal px-5 py-4 bg-warning/10 border border-warning/20 rounded-2xl mb-8">
          <p className="text-sm font-bold text-warning mb-1">No HRA Component</p>
          <p className="text-xs font-medium text-warning/80">Because your salary doesn't have an HRA component, you cannot claim the HRA tax exemption even though you pay rent. This calculator does not cover Section 80GG deductions.</p>
        </div>
      )}

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
