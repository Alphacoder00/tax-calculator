import { motion } from 'framer-motion'
import { CheckCircle2, Circle, User, Wallet, Receipt, FileText, PieChart, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react'
import { TaxPreviewPanel } from '../TaxPreviewPanel'
import { fmtNum } from '../../utils'
import { computeTax } from '../../taxEngine'

const SIDEBAR_GROUPS = [
  { id: 1, title: 'Personal Details', icon: User, steps: [2, 3] },
  { id: 2, title: 'Income', icon: Wallet, steps: [4, 5, 6] },
  { id: 3, title: 'Deductions', icon: Receipt, steps: [7, 8, 9, 10, 11] },
  { id: 4, title: 'TDS & Summary', icon: FileText, steps: [12, 13] },
  { id: 5, title: 'Compare & Review', icon: PieChart, steps: [14] },
]

export function DashboardLayout({ children, goBack, reset, step, data, goNext }) {
  // Compute active group
  const activeGroup = SIDEBAR_GROUPS.find(g => g.steps.includes(step))?.id || 1

  // Compute live tax for sticky footer if data is present
  const results = data ? computeTax(data) : null
  const autoRecommended = results?.recommended || 'new'
  const activeData = autoRecommended === 'old' ? results?.oldRegime : results?.newRegime
  const hasIncome = (results?.newRegime.grossIncome || 0) > 0

  if (step === 1) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-brandbg flex flex-col md:flex-row font-sans">
      
      {/* Sidebar - Hidden on mobile, w-72 on desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-cardbg border-r border-bordercol sticky top-0 h-screen p-6">
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={reset}>
          <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <CalculatorIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primaryText tracking-tight leading-none">TaxWise</span>
            <span className="text-xs text-secondaryText font-medium mt-1">FY 2025-26</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {SIDEBAR_GROUPS.map((group, idx) => {
            const isActive = activeGroup === group.id
            const isCompleted = activeGroup > group.id
            const Icon = group.icon

            return (
              <div
                key={group.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/5 border border-primary/10 shadow-sm' : 'hover:bg-gray-50'}`}
              >
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-[10px] transition-colors ${isActive ? 'bg-white text-primary shadow-sm border border-primary/10' : isCompleted ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400'}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />}
                  {idx !== SIDEBAR_GROUPS.length - 1 && (
                    <div className="absolute top-10 left-1/2 -ml-[1px] w-[2px] h-4 bg-bordercol" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-gray-400'}`}>Step {group.id}</span>
                  <span className={`text-sm font-semibold ${isActive ? 'text-primaryText' : isCompleted ? 'text-gray-600' : 'text-gray-500'}`}>{group.title}</span>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Trust Signals */}
        <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-bordercol">
          <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-success">100% Private</p>
              <p className="text-[11px] text-success/80 mt-1">Your data never leaves your browser. CA reviewed formulas.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative pb-32">
        
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-bordercol px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-2" onClick={reset}>
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
               <CalculatorIcon />
             </div>
             <span className="text-base font-bold text-primaryText tracking-tight">TaxWise</span>
           </div>
           {step > 1 && step < 14 && (
             <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
               Step {activeGroup} of 5
             </span>
           )}
        </header>

        <main className="flex-1 w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1536px] 3xl:max-w-[1720px] 4xl:max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Form / Content */}
            <div className={`col-span-1 ${step === 14 ? 'lg:col-span-12' : 'lg:col-span-7'} pb-10`}>
              {step > 1 && step < 14 && (
                <button type="button" onClick={goBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-secondaryText hover:text-primaryText transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back
                </button>
              )}
              <motion.div 
                key={step} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }} 
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </div>

            {/* Sticky Live Tax Panel (Hidden on results step S14) */}
            {data && step < 14 && (
              <div className="hidden lg:block lg:col-span-5 relative">
                <div className="sticky top-10">
                  <TaxPreviewPanel data={data} />
                </div>
              </div>
            )}

          </div>
        </main>
        
        {/* Sticky Bottom Summary Footer */}
        {hasIncome && step > 3 && step < 14 && (
          <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/80 backdrop-blur-xl border-t border-bordercol shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 p-4 md:px-10">
            <div className="max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1536px] 3xl:max-w-[1720px] 4xl:max-w-[1840px] mx-auto flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col">
                  <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">Est. Tax Payable</span>
                  <span className="text-lg font-black text-primaryText">₹{fmtNum(activeData?.totalTax || 0)}</span>
                </div>
                {results?.savings > 0 && (
                  <div className="flex flex-col border-l border-gray-200 pl-6">
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">Money Saved</span>
                    <span className="text-lg font-black text-success">₹{fmtNum(results.savings)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold text-secondaryText uppercase tracking-wider">Recommended</span>
                  <span className="text-sm font-black text-primary">{autoRecommended === 'new' ? 'New Regime' : 'Old Regime'}</span>
                </div>
              </div>
              
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function CalculatorIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.502-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm-9.75-9h13.5c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5H5.25c-.828 0-1.5-.672-1.5-1.5V10.5c0-.828.672-1.5 1.5-1.5Zm0 0V6c0-.828.672-1.5 1.5-1.5h10.5c.828 0 1.5.672 1.5 1.5v3" />
    </svg>
  )
}
