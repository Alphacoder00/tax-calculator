import { forwardRef, useState, useImperativeHandle, useRef } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'

export const CommonQuestions = forwardRef(function CommonQuestions({ questions = [] }, ref) {
  const [open, setOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  const containerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    openAndScroll() {
      setOpen(true)
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 80)
    }
  }))

  if (!questions || questions.length === 0) return null

  return (
    <div ref={containerRef} className="rounded-xl overflow-hidden mt-6 bg-white border-2 border-bordercol transition-all hover:border-gray-300">
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors text-left focus:outline-none"
      >
        <div className="text-sm font-bold text-secondaryText flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-primary" />
          Common questions about this
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-transform duration-300 ${open ? 'rotate-180 bg-primary/10 text-primary' : 'text-secondaryText'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {open && (
        <div className="divide-y divide-bordercol border-t border-bordercol">
          {questions.map((q, i) => (
            <div key={i} className="bg-white">
              <button 
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition-colors focus:outline-none"
              >
                <span className="text-[13px] font-bold text-primaryText pr-4 leading-snug">{q.q}</span>
                <ChevronDown 
                  className={`w-4 h-4 text-secondaryText transition-transform duration-200 flex-shrink-0 mt-0.5 ${openIndex === i ? 'rotate-180 text-primary' : ''}`} 
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 reveal">
                  <p className="text-[13px] font-medium text-secondaryText leading-relaxed whitespace-pre-wrap">{q.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
