import { Calendar } from 'lucide-react'

export function S02_FinancialYear({ data, update, goNext }) {
  return (
    <div className="glass-card p-6 sm:p-10 mb-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[16px] bg-secondaryAccent/10 flex items-center justify-center text-secondaryAccent shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-secondaryAccent uppercase tracking-widest">
          Financial Year
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-primaryText tracking-tight mb-4">
        Which year are you filing for?
      </h3>
      <p className="text-secondaryText font-medium mb-8">
        This calculator uses the latest tax rules announced in the July 2024 Budget.
      </p>

      <div className="space-y-4 mb-10">
        <label className="relative flex items-center p-5 cursor-pointer rounded-[20px] border-2 transition-all border-primary bg-primary/5 shadow-sm">
          <input 
            type="radio" 
            name="fy" 
            value="2025-26" 
            checked={true}
            readOnly
            className="w-5 h-5 text-primary border-bordercol focus:ring-primary"
          />
          <div className="ml-4 flex flex-col">
            <span className="text-lg font-bold text-primaryText">FY 2025–26 (AY 2026-27)</span>
            <span className="text-sm font-medium text-secondaryText">For income earned between Apr 2025 - Mar 2026</span>
          </div>
          <div className="ml-auto bg-secondaryAccent text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Current
          </div>
        </label>
      </div>

      <button onClick={goNext} className="premium-btn-primary py-4 px-10 text-base w-full md:w-auto">
        Continue
      </button>
    </div>
  )
}
