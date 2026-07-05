import { useState } from 'react'
import { INITIAL_STATE } from './constants'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { S01_Landing } from './components/steps/S01_Landing'
import { S02_FinancialYear } from './components/steps/S02_FinancialYear'
import { S03_AgeGroup } from './components/steps/S03_AgeGroup'
import { S04_SalaryDetails } from './components/steps/S04_SalaryDetails'
import { S05_SalaryComponents } from './components/steps/S05_SalaryComponents'
import { S06_OtherIncome } from './components/steps/S06_OtherIncome'
import { S07_PaysRent } from './components/steps/S07_PaysRent'
import { S08_RentDetails } from './components/steps/S08_RentDetails'
import { S09_TaxSavingInvestments } from './components/steps/S09_TaxSavingInvestments'
import { S10_HealthInsurance } from './components/steps/S10_HealthInsurance'
import { S11_HomeLoan } from './components/steps/S11_HomeLoan'
import { S12_TDS } from './components/steps/S12_TDS'
import { S13_Calculating } from './components/steps/S13_Calculating'
import { S14_Results } from './components/steps/S14_Results'

export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL_STATE)
  const [results, setResults] = useState(null)

  function update(fields) { setData(prev => ({ ...prev, ...fields })) }
  function goNext() { setStep(s => s + 1) }
  function goBack() { setStep(s => Math.max(1, s - 1)) }
  function skipTo(targetStep) { setStep(targetStep) }
  function reset() { setData(INITIAL_STATE); setResults(null); setStep(1) }

  const sharedProps = { data, update, goNext, goBack, skipTo, step, setResults }

  return (
    <DashboardLayout step={step} data={data} goBack={goBack} reset={reset} goNext={goNext}>
      {step === 1 && <S01_Landing goNext={goNext} />}
      {step === 2 && <S02_FinancialYear {...sharedProps} />}
      {step === 3 && <S03_AgeGroup {...sharedProps} />}
      {step === 4 && <S04_SalaryDetails {...sharedProps} />}
      {step === 5 && <S05_SalaryComponents {...sharedProps} />}
      {step === 6 && <S06_OtherIncome {...sharedProps} />}
      {step === 7 && <S07_PaysRent {...sharedProps} />}
      {step === 8 && <S08_RentDetails {...sharedProps} />}
      {step === 9 && <S09_TaxSavingInvestments {...sharedProps} />}
      {step === 10 && <S10_HealthInsurance {...sharedProps} />}
      {step === 11 && <S11_HomeLoan {...sharedProps} />}
      {step === 12 && <S12_TDS {...sharedProps} />}
      {step === 13 && <S13_Calculating {...sharedProps} />}
      {step === 14 && <S14_Results results={results} data={data} reset={reset} skipTo={skipTo} />}
    </DashboardLayout>
  )
}
