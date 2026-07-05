import { useState, useRef } from 'react'
import { CommonQuestions } from '../CommonQuestions'
import { NumberInput } from '../NumberInput'
import { FrequencyInput } from '../FrequencyInput'
import { ConfusedLink } from '../ConfusedLink'
import { fmtNum } from '../../utils'
import { Wallet } from 'lucide-react'

const QUESTIONS = [
  { q: 'What is take-home salary vs CTC?', a: 'Take-home salary (or In-hand salary) is the actual amount credited to your bank account after all deductions like EPF, TDS, and Professional Tax. CTC (Cost to Company) includes these deductions plus employer contributions.' },
  { q: 'Why do you need my basic pay?', a: 'Basic pay is required to calculate your HRA exemption and the maximum limit for EPF/NPS deductions under the old regime.' },
  { q: 'Should I include my variable pay?', a: 'Yes, if you received a bonus, performance pay, or variable pay during the year, answer "Yes" to the bonus question and enter the amount.' },
  { q: 'I changed jobs this year. What should I do?', a: 'Combine the take-home salary, basic pay, and bonuses from all employers during FY 2025-26 and enter the total annual amounts.' },
  { q: 'My salary varies every month', a: 'Calculate the average monthly salary and multiply by 12, or just enter your total expected annual take-home.' }
]

export function S04_SalaryDetails({ data, update, goNext, ...props }) {
  const faqRef = useRef(null)
  const [errors, setErrors] = useState({})

  const takeHome = Number(data.takeHomeSalaryMonthly) || 0
  const basic = Number(data.basicSalaryMonthly) || 0
  const bonus = (data.hasBonus && Number(data.bonus) > 0) ? Number(data.bonus) : 0

  const annualTakeHome = takeHome * 12
  const totalGrossIncome = annualTakeHome + bonus

  const basicGreaterThanTakeHome = basic > 0 && takeHome > 0 && basic > takeHome
  const surchargeWarning = annualTakeHome > 5000000

  // We rely on the sticky footer "Continue" button now, but we can also leave an internal error check.
  // Actually, since the footer button calls goNext directly without validating, we should perhaps validate there? 
  // Wait, in the original, S04 had its own internal "Continue" button which did `handleNext`. 
  // In DashboardLayout, I added a "Continue" button for all steps!
  // BUT the footer button doesn't know about `errors` validation. 
  // Let's keep the internal validation button in the step, or remove the footer button for form steps?
  // Since S04 has required fields, it's safer to use the internal button for S04, or just hide the footer button.
  // Actually, if we just keep the form as is with its own button, we can hide the footer's Continue button.
  // Let's modify S04 to render its content.
  
  function handleNext() {
    const newErrors = {}
    if (!data.takeHomeSalaryMonthly) newErrors.takeHome = 'Required'
    if (!data.basicSalaryMonthly) newErrors.basic = 'Required'
    if (data.hasBonus === null) newErrors.hasBonus = 'Required'
    if (data.hasBonus && !data.bonus) newErrors.bonus = 'Required'
    
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
          <Wallet className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Your Salary
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-8">
        What does your salary look like?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <NumberInput 
            id="takeHome"
            label="Take-home salary (per month)"
            value={data.takeHomeSalaryMonthly}
            onChange={(val) => { update({ takeHomeSalaryMonthly: val }); setErrors(e => ({...e, takeHome: null})) }}
            required
            hint="The amount credited to your bank account each month — not your CTC or gross salary."
          />
          {errors.takeHome && <p className="text-xs font-bold text-error mt-2">{errors.takeHome}</p>}
        </div>
        
        <div>
          <NumberInput 
            id="basic"
            label="Basic Pay (per month)"
            required
            value={data.basicSalaryMonthly}
            onChange={(val) => { update({ basicSalaryMonthly: val }); setErrors(e => ({...e, basic: null})) }}
          />
          <div className="mt-2 flex justify-between items-start">
            {errors.basic ? <p className="text-xs font-bold text-error">{errors.basic}</p> : <div></div>}
            <ConfusedLink faqRef={faqRef} label="What's basic pay?" />
          </div>
        </div>
      </div>

      {takeHome > 0 && !basicGreaterThanTakeHome && (
        <div className="reveal px-6 py-4 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
          <span className="text-sm font-bold text-primary">Your total annual salary:</span>
          <span className="text-2xl font-black text-primary">₹{fmtNum(annualTakeHome)}</span>
        </div>
      )}

      {basicGreaterThanTakeHome && (
        <div className="px-6 py-4 bg-warning/10 border border-warning/20 rounded-2xl mb-8">
          <p className="text-sm font-bold text-warning mb-1">Are you sure?</p>
          <p className="text-xs font-medium text-warning/80">Your basic pay (₹{fmtNum(basic)}) cannot be higher than your take-home salary (₹{fmtNum(takeHome)}). Basic pay is usually 40-50% of your total salary. Please check your salary slip again.</p>
        </div>
      )}

      {surchargeWarning && (
        <div className="px-6 py-4 bg-warning/10 border border-warning/20 rounded-2xl mb-8">
          <p className="text-sm font-bold text-warning mb-1">High Income Alert</p>
          <p className="text-xs font-medium text-warning/80">Incomes above ₹50,00,000 attract a surcharge. This calculator provides a basic estimate and does not currently compute surcharge. We recommend consulting a tax professional.</p>
        </div>
      )}

      <div className="border-t border-bordercol pt-8 mb-8">
        <h4 className="text-sm font-bold text-primaryText mb-4">Do you get any extra money apart from your fixed monthly salary?</h4>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { update({ hasBonus: true }); setErrors(e => ({...e, hasBonus: null})) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasBonus === true ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => { update({ hasBonus: false, bonus: '' }); setErrors(e => ({...e, hasBonus: null})) }}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
              data.hasBonus === false ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-white border-bordercol text-secondaryText hover:bg-gray-50'
            }`}
          >
            No
          </button>
        </div>
        {errors.hasBonus && <p className="text-xs font-bold text-error -mt-2 mb-4">{errors.hasBonus}</p>}

        {data.hasBonus === true && (
          <div className="reveal p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-5">
            <FrequencyInput 
              id="bonusAmount"
              label="How much extra do you receive?"
              value={data.bonus}
              onChange={(val) => { update({ bonus: val }); setErrors(e => ({...e, bonus: null})) }}
              required
            />
            {errors.bonus && <p className="text-xs font-bold text-error">{errors.bonus}</p>}
            
            <div className="p-4 bg-white border border-bordercol rounded-xl">
              <p className="text-xs font-bold text-primaryText mb-1.5">Not sure of the exact amount?</p>
              <p className="text-[11px] font-medium text-secondaryText leading-relaxed">Enter an estimate. This includes performance bonus, variable pay, joining bonus, leave encashment, etc.<br/><br/><span className="text-primaryText font-bold">Don't include:</span> your fixed monthly salary, expense reimbursements, or PF/NPS matching.</p>
            </div>
          </div>
        )}

        {data.hasBonus === false && (
          <div className="reveal p-4 bg-gray-50 border border-bordercol rounded-xl text-sm font-medium text-secondaryText text-center">
            Got it — we'll use only your fixed monthly salary.
          </div>
        )}
      </div>

      {takeHome > 0 && data.hasBonus && bonus > 0 && (
        <div className="reveal px-6 py-5 bg-success/10 border border-success/20 rounded-2xl mb-8 flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-success">Total Gross Income</div>
            <div className="text-[11px] font-semibold text-success/80 mt-1">Salary (₹{fmtNum(annualTakeHome)}) + Bonus (₹{fmtNum(bonus)})</div>
          </div>
          <div className="text-2xl font-black text-success">₹{fmtNum(totalGrossIncome)}</div>
        </div>
      )}

      {/* Internal Continue Button to handle validation */}
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
