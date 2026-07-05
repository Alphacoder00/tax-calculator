import { calc80CTotal } from '../../utils'
import { CAP_80C } from '../../constants'
import { Lightbulb, Info } from 'lucide-react'

function SuggestionCard({ title, desc, isFirst }) {
  return (
    <div className={`p-5 rounded-2xl border-2 transition-all shadow-sm ${isFirst ? 'bg-primary/5 border-primary/20 hover:border-primary/40' : 'bg-white border-bordercol hover:border-gray-300'} mb-4`}>
      <h4 className={`text-sm font-black mb-2 tracking-wide ${isFirst ? 'text-primaryText' : 'text-primaryText'}`}>
        {title}
      </h4>
      <p className={`text-xs font-medium leading-relaxed ${isFirst ? 'text-secondaryText' : 'text-secondaryText'}`}>
        {desc}
      </p>
    </div>
  )
}

export function SectionE_NextSteps({ results, data }) {
  const suggestions = []
  
  if (results.recommended === 'new' && !data.hasEmployerNPS) {
    suggestions.push({
      title: "Ask your HR about Corporate NPS",
      desc: "Employer NPS (Section 80CCD(2)) is one of the only deductions allowed in the New Tax Regime. Asking your employer to restructure your CTC to include Corporate NPS can reduce your taxable income significantly."
    })
  }
  
  if (results.recommended === 'old') {
    const total80C = calc80CTotal(data)
    if (total80C < CAP_80C) {
      suggestions.push({
        title: "Max out your 80C limit",
        desc: `You have only used ₹${Number(total80C).toLocaleString('en-IN')} out of the ₹1,50,000 limit. Consider investing the remaining amount in ELSS, PPF, or Tax Saver FDs to lower your tax further.`
      })
    }
    
    if (!data.hasPersonalNPS) {
      suggestions.push({
        title: "Open an NPS Tier-1 Account",
        desc: "You can claim an additional ₹50,000 deduction under Section 80CCD(1B) by investing in NPS. This is over and above your 1.5L 80C limit."
      })
    }
    
    if (!data.hasSelfInsurance) {
      suggestions.push({
        title: "Get independent Health Insurance",
        desc: "Buying a health insurance policy for yourself or your parents gives you a deduction under Section 80D, while also protecting you from medical emergencies."
      })
    }
  }
  
  if (data.paysRent && !data.hasHRA) {
    suggestions.push({
      title: "Ask for HRA in your salary structure",
      desc: "You pay rent but don't receive HRA. If you can negotiate with your employer to add an HRA component to your CTC, you can claim significant tax exemptions under the old regime."
    })
  }
  
  if (suggestions.length === 0) {
    suggestions.push({
      title: "You're all set!",
      desc: `Your current tax setup looks highly optimized for the ${results.recommended === 'new' ? 'New' : 'Old'} Regime. Just ensure you file your ITR before the July 31st deadline.`
    })
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-black text-primaryText tracking-tight">Smart Next Steps</h3>
      </div>
      
      {suggestions.map((s, i) => (
        <SuggestionCard key={i} title={s.title} desc={s.desc} isFirst={i === 0} />
      ))}
      
      <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-bordercol">
        <Info className="w-4 h-4 text-secondaryText shrink-0 mt-0.5" />
        <p className="text-[11px] font-medium text-secondaryText leading-relaxed">
          <strong className="font-bold text-primaryText uppercase tracking-wider">Important:</strong> These suggestions are general pointers based on your inputs — not personalised financial or tax advice. Every person's situation is different. Please consult a qualified Chartered Accountant or tax professional before making investment or filing decisions.
        </p>
      </div>
    </div>
  )
}
