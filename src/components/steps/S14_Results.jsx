import { SectionA_Verdict } from '../results/SectionA_Verdict'
import { SectionB_TaxSummary } from '../results/SectionB_TaxSummary'
import { SectionC_DetailedBreakdown } from '../results/SectionC_DetailedBreakdown'
import { SectionD_Education } from '../results/SectionD_Education'
import { SectionE_NextSteps } from '../results/SectionE_NextSteps'
import { Shield, Clock, Lock } from 'lucide-react'

export function S14_Results({ results, data, reset, skipTo }) {
  if (!results) return null

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1536px] 3xl:max-w-[1720px] 4xl:max-w-[1840px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Column */}
          <div className="w-full lg:w-[55%] flex flex-col gap-8">
            <SectionA_Verdict results={results} data={data} />
            <SectionE_NextSteps results={results} data={data} />
            <SectionD_Education results={results} data={data} />
            
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6 space-y-2 mt-4">
              <h4 className="text-sm font-bold text-warning uppercase tracking-wide">Important disclaimer</h4>
              <p className="text-sm font-medium text-warning/90 leading-relaxed">
                This is an estimate based on the information you provided — not exact tax advice.
                This calculator covers standard salary deductions for FY 2025-26. It does <strong>not</strong> account for: surcharge on incomes above ₹50 lakh, capital gains (stocks/mutual funds), rental income from properties, or other complex tax situations. Always verify your final tax liability with a CA or on the official Income Tax portal.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button 
                onClick={() => skipTo(4)}
                className="flex-1 py-4 px-6 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors shadow-sm text-center"
              >
                Go back and edit my inputs
              </button>
              <button 
                onClick={reset}
                className="flex-1 py-4 px-6 bg-white border-2 border-bordercol text-secondaryText font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-center"
              >
                Start Over
              </button>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="w-full lg:w-[45%] flex flex-col gap-8 lg:sticky lg:top-10">
            <SectionB_TaxSummary results={results} data={data} />
            <SectionC_DetailedBreakdown results={results} data={data} />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-6 px-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-secondaryText uppercase">
                <Shield className="w-4 h-4 text-primary/70" />
                FY 2025-26 Rules
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-secondaryText uppercase">
                <Lock className="w-4 h-4 text-primary/70" />
                Data is private
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-secondaryText uppercase">
                <Clock className="w-4 h-4 text-primary/70" />
                Takes 3-5 mins
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
