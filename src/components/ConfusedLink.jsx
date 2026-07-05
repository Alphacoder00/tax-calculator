import { HelpCircle } from 'lucide-react'

export function ConfusedLink({ faqRef, label = 'Not sure? See examples' }) {
  return (
    <button 
      type="button" 
      onClick={() => faqRef?.current?.openAndScroll()}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider focus:outline-none"
    >
      <HelpCircle className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}
