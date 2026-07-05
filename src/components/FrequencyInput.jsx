import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

export function FrequencyInput({ id, label, value, onChange, placeholder = '', hint, note, required = false, max, prefix = '₹' }) {
  const [freq, setFreq] = useState('annual')
  
  const annualValue = Number(value) || 0
  const displayValue = freq === 'monthly' ? Math.round(annualValue / 12) : annualValue
  
  const isValid = value !== '' && value !== null && value !== undefined && Number(value) > 0

  function handleInput(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw === '') {
      onChange('')
      return
    }
    const num = Number(raw)
    onChange(freq === 'monthly' ? num * 12 : num)
  }

  function formatINR(val) {
    if (!val) return ''
    return Number(val).toLocaleString('en-IN')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
        <label htmlFor={id} className="block text-sm font-bold text-primaryText leading-tight">
          {label} {required && <span className="text-error">*</span>}
        </label>
        
        <div className="flex rounded-lg border border-bordercol overflow-hidden bg-gray-50/50 p-1 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setFreq('monthly')}
            className={`px-4 py-1.5 text-[11px] font-bold transition-all rounded-md uppercase tracking-wider ${freq === 'monthly' ? 'bg-primary text-white shadow-md' : 'text-secondaryText hover:text-primaryText hover:bg-gray-100'}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setFreq('annual')}
            className={`px-4 py-1.5 text-[11px] font-bold transition-all rounded-md uppercase tracking-wider ${freq === 'annual' ? 'bg-primary text-white shadow-md' : 'text-secondaryText hover:text-primaryText hover:bg-gray-100'}`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        {prefix && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-secondaryText font-medium pointer-events-none select-none z-10"
            style={{ fontSize: '15px', lineHeight: '1' }}
          >
            {prefix}
          </span>
        )}
        
        <input
          type="text"
          id={id}
          inputMode="numeric"
          pattern="[0-9]*"
          value={displayValue ? formatINR(displayValue) : ''}
          onChange={handleInput}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`
            w-full bg-white border border-gray-200 rounded-xl text-gray-900 font-semibold
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20
            focus:border-primary shadow-sm hover:border-gray-300 transition-all
            ${isValid ? 'border-success/40 bg-success/5 focus:border-success focus:ring-success/20' : ''}
            ${prefix ? 'pl-8 pr-4' : 'px-4'}
          `}
          style={{ height: '48px', fontSize: '15px' }}
        />
        
        {isValid && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4 pointer-events-none">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
        )}
      </div>

      {freq === 'monthly' && isValid && (
        <p className="text-xs text-primary font-bold tracking-tight reveal">
          = ₹{Number(annualValue).toLocaleString('en-IN')} per year (auto-calculated)
        </p>
      )}

      {note && (
        <p className="text-[11px] font-semibold text-warning bg-warning/10 border border-warning/20 rounded-lg px-3 py-2 mt-1 flex items-center gap-1.5">
          {note}
        </p>
      )}
      
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-secondaryText/80 font-medium leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  )
}
