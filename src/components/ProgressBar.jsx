export function ProgressBar({ current, total, stepName }) {
  // Generate dots up to total
  const dots = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] font-black tracking-widest uppercase text-secondaryText">
          Step <span className="text-primaryText">{current}</span> of {total}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-bordercol hidden sm:inline"></span>
        <span className="text-xs font-bold text-primary truncate max-w-[160px] hidden sm:inline uppercase tracking-wide">
          {stepName}
        </span>
      </div>
      
      <div className="flex items-center gap-2 flex-1 justify-end">
        {dots.map(step => (
          <div 
            key={step}
            role="progressbar"
            aria-valuenow={current >= step ? 100 : 0}
            aria-valuemin="0"
            aria-valuemax="100"
            className={`rounded-full transition-all duration-500 ease-out ${
              step < current ? 'w-2 h-2 bg-primary' :
              step === current ? 'w-2 h-2 bg-primary/40' :
              'w-1.5 h-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
