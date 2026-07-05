import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Scale, PiggyBank, Receipt, MessageSquare, BookOpen, GitCompare, FileText, ChevronDown } from 'lucide-react'

export function S01_Landing({ goNext }) {
  const [activePanel, setActivePanel] = useState(null) // 'how-it-works' | 'compare-regimes' | 'resources'
  const panelRef = useRef(null)

  function togglePanel(id) {
    setActivePanel(prev => (prev === id ? null : id))
  }

  // Scroll to panel after it opens
  useEffect(() => {
    if (activePanel && panelRef.current) {
      setTimeout(() => {
        const el = panelRef.current
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo({ top, behavior: 'smooth' })
      }, 50)
    }
  }, [activePanel])

  const navLinks = [
    { id: 'how-it-works', label: 'How it Works', icon: BookOpen },
    { id: 'compare-regimes', label: 'Compare Regimes', icon: GitCompare },
    { id: 'resources', label: 'Resources', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-brandbg flex flex-col font-sans relative overflow-x-hidden">
      {/* Background ambient blobs (warm tones only, no purple) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E07856]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7BA88F]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── Header ─── */}
      <header className="relative z-20 w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1536px] 3xl:max-w-[1720px] 4xl:max-w-[1840px] mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondaryAccent rounded-[12px] flex items-center justify-center shadow-sm">
            <CalculatorIcon />
          </div>
          <div>
            <span className="text-xl font-serif font-bold text-primaryText tracking-tight">TaxWise</span>
            <span className="text-[10px] font-bold text-secondaryText block -mt-0.5 tracking-widest uppercase">Know. Compare. Save.</span>
          </div>
        </div>

        {/* Nav — each button is a sage green pill when active */}
        <nav className="hidden sm:flex items-center gap-2">
          {navLinks.map(({ id, label }) => {
            const isActive = activePanel === id
            return (
              <button
                key={id}
                onClick={() => togglePanel(id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                  isActive
                    ? 'bg-secondaryAccent text-white shadow-sm'
                    : 'text-secondaryText hover:text-primaryText hover:bg-secondaryAccent/10'
                }`}
              >
                {label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-secondaryAccent bg-secondaryAccent/10 border border-secondaryAccent/20 rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondaryAccent animate-pulse" />
            FY 2025-26
          </div>
        </div>
      </header>

      {/* ─── Dropdown Panel (shown below header when active) ─── */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            ref={panelRef}
            key={activePanel}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative z-10 w-full border-b border-bordercol bg-white/95 backdrop-blur-xl shadow-sm"
          >
            <div className="w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1536px] 3xl:max-w-[1720px] 4xl:max-w-[1840px] mx-auto px-6 sm:px-12 py-10">
              {activePanel === 'how-it-works' && <HowItWorksPanel goNext={goNext} />}
              {activePanel === 'compare-regimes' && <CompareRegimesPanel />}
              {activePanel === 'resources' && <ResourcesPanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero ─── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1536px] 3xl:max-w-[1720px] 4xl:max-w-[1840px] mx-auto px-6 sm:px-12 py-16 lg:py-24 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left copy - Asymmetric (7 cols wide for reassurance, 5 cols for the card) */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Pill tags with hairline border */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-secondaryText bg-transparent border border-bordercol rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-3.5 h-3.5 text-accent" />
              Smart decisions. Bigger savings.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-semibold text-primaryText leading-[1.2] tracking-tight mb-6">
              Find out <span className="text-[#E07856]">which tax regime</span> saves you more money this year.
            </h1>

            <p className="text-base sm:text-lg text-secondaryText leading-relaxed mb-10 max-w-xl">
              Answer a few simple questions about your salary and expenses. We'll compare both tax regimes and show you which one saves you more money — with a clear rupee-by-rupee estimate.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-primaryText bg-white border border-bordercol px-4 py-2 rounded-full">
                ⏱ 2 min
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-secondaryText bg-transparent border border-bordercol px-4 py-2 rounded-full">
                <ShieldCheck className="w-4 h-4 text-secondaryAccent" /> 100% Free
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-secondaryText bg-transparent border border-bordercol px-4 py-2 rounded-full">
                <ShieldCheck className="w-4 h-4 text-secondaryAccent" /> Private & Secure
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button onClick={goNext} className="premium-btn-primary px-8 py-4 text-base w-full sm:w-auto">
                Start Calculation
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => togglePanel('how-it-works')}
                className="premium-btn-secondary px-8 py-4 text-base w-full sm:w-auto"
              >
                <BookOpen className="w-5 h-5 text-secondaryAccent" /> How it works
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-secondaryText">
              <CheckCircle2 className="w-4 h-4 text-secondaryAccent" />
              Built for salaried individuals only
              <span className="w-1 h-1 rounded-full bg-bordercol mx-1" />
              FY 2025-26
            </div>
          </motion.div>

          {/* Right preview card - 5 cols wide, Asymmetric */}
          <motion.div
            className="lg:col-span-5 relative w-full"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="relative glass-card p-8 rounded-[24px] bg-white border border-bordercol">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif font-bold text-primaryText">Your Tax Summary</h3>
                <div className="flex items-center gap-2 bg-secondaryAccent/10 border border-secondaryAccent/20 text-secondaryAccent text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondaryAccent animate-pulse" />
                  Live Preview
                </div>
              </div>

              {/* Recommended panel - Warm and welcoming card (no purple gradient!) */}
              <div className="bg-[#7BA88F]/10 border border-[#7BA88F]/20 rounded-[20px] p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center shrink-0 border border-[#7BA88F]/30">
                  <CheckCircle2 className="w-7 h-7 text-secondaryAccent" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-secondaryText uppercase tracking-widest mb-1">Recommended</div>
                  <div className="text-2xl sm:text-3xl font-serif font-semibold text-primaryText tracking-tight mb-1">You save ₹18,540</div>
                  <div className="text-sm font-medium text-secondaryText">by choosing the New Regime</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative p-5 rounded-[20px] border-2 border-primary bg-primary/5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-wider">
                    ★ Best for you
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2 text-center text-primary mt-2">New Regime</div>
                  <div className="text-2xl font-bold text-center text-primaryText mb-1">₹62,400</div>
                  <div className="text-[11px] font-semibold text-center text-secondaryText">Total Tax</div>
                </div>
                <div className="relative p-5 rounded-[20px] border border-bordercol bg-white flex flex-col justify-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2 text-center text-secondaryText">Old Regime</div>
                  <div className="text-2xl font-bold text-center text-primaryText mb-1">₹80,940</div>
                  <div className="text-[11px] font-semibold text-center text-secondaryText">Total Tax</div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 bg-secondaryAccent/10 rounded-[16px] py-3 border border-secondaryAccent/20">
                <span className="text-lg">🌿</span>
                <span className="text-xs font-bold text-secondaryAccent">New Regime is better for you by saving ₹18,540</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Feature Pills ─── */}
        <motion.div
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { icon: Scale, color: 'text-primary bg-primary/10 border border-primary/20', label: 'Old vs New', desc: 'Side-by-side comparison of both regimes.' },
            { icon: PiggyBank, color: 'text-secondaryAccent bg-secondaryAccent/10 border border-secondaryAccent/20', label: 'Exact Savings', desc: 'Down to the last rupee — no guesswork.' },
            { icon: Receipt, color: 'text-primary bg-primary/10 border border-primary/20', label: 'Refund or Due', desc: 'Factors in TDS so you know your balance.' },
            { icon: MessageSquare, color: 'text-secondaryAccent bg-secondaryAccent/10 border border-secondaryAccent/20', label: 'Plain English', desc: 'No CA jargon. Simple terms for everyone.' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 flex flex-col gap-3 rounded-[24px]">
              <div className={`w-12 h-12 ${item.color} rounded-[16px] flex items-center justify-center mb-2`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-primaryText">{item.label}</h3>
              <p className="text-sm font-medium text-secondaryText">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* ─── Trust Footer ─── */}
        <motion.div
          className="mt-20 mb-8 rounded-[24px] bg-[#EDE6DD]/40 border border-[#EDE6DD] p-10 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-lg mb-6">
              <Zap className="w-5 h-5 text-primary" /> Why choose TaxWise?
            </div>
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, label: '100% Private', sub: 'Your data stays on your device. Never stored or sent.' },
                { icon: Receipt, label: 'Accurate Calculations', sub: 'Based on the latest Finance Act for FY 2025-26.' },
                { icon: Zap, label: 'Saves Time', sub: 'Complete your comparison in under 2 minutes.' },
                { icon: Scale, label: 'For Salaried People', sub: 'Designed specifically for Indian salaried employees.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <item.icon className="w-5 h-5 text-secondaryText mb-1" />
                  <span className="text-sm font-bold text-primaryText">{item.label}</span>
                  <span className="text-xs text-secondaryText leading-snug">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:border-l lg:border-[#EDE6DD] lg:pl-12">
            <div className="flex items-center gap-2 text-primaryText font-bold text-lg mb-4">
              <ShieldCheck className="w-5 h-5 text-secondaryAccent" /> Trusted. Secure. Reliable.
            </div>
            <p className="text-sm text-secondaryText leading-relaxed mb-6">
              All calculations happen entirely in your browser. We follow industry best practices to ensure your data is always safe and never shared.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {['🔒 No Data Stored', '🛡️ Secure by Design', '🇮🇳 Made in India'].map(tag => (
                <span key={tag} className="text-xs font-semibold text-secondaryText bg-white border border-[#EDE6DD] rounded-full px-4 py-2">{tag}</span>
              ))}
            </div>
            <button onClick={goNext} className="premium-btn-primary px-8 py-4 text-base">
              Get My Tax Estimate <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

/* ─── Panel Content Components ─── */

function HowItWorksPanel({ goNext }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-bold text-secondaryAccent bg-secondaryAccent/10 border border-secondaryAccent/20 rounded-full px-4 py-1.5 mb-6 w-fit">
        <BookOpen className="w-3.5 h-3.5" /> How it Works
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primaryText tracking-tight mb-2">Your result in 3 simple steps</h2>
      <p className="text-sm text-secondaryText mb-8 max-w-xl">No spreadsheets, no CA required. Just answer a few questions and we'll handle the math.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { step: '01', icon: '💼', title: 'Enter your income', desc: 'Tell us your take-home salary, bonus, and any other income like FD interest.' },
          { step: '02', icon: '🧾', title: 'Add your deductions', desc: 'Enter investments (80C, NPS), health insurance, home loan interest, and TDS.' },
          { step: '03', icon: '✅', title: 'Get your recommendation', desc: 'We compare Old vs New Regime instantly and show how much you save — rupee by rupee.' },
        ].map((item, i) => (
          <div key={i} className="bg-[#FBF7F2] border border-bordercol rounded-[20px] p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-secondaryAccent text-white font-bold text-base flex items-center justify-center shadow-sm">{item.step}</div>
            <div className="text-2xl">{item.icon}</div>
            <h3 className="text-base font-serif font-bold text-primaryText">{item.title}</h3>
            <p className="text-xs text-secondaryText leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button onClick={goNext} className="premium-btn-primary px-8 py-3.5 text-sm">
          Start Free Calculation <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function CompareRegimesPanel() {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-bold text-secondaryAccent bg-secondaryAccent/10 border border-secondaryAccent/20 rounded-full px-4 py-1.5 mb-6 w-fit">
        <GitCompare className="w-3.5 h-3.5" /> Compare Regimes
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primaryText tracking-tight mb-2">Old vs New Tax Regime</h2>
      <p className="text-sm text-secondaryText mb-8 max-w-xl">Both regimes have different slabs and rules. Here's a quick overview to help you decide.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#FBF7F2] border border-bordercol rounded-[20px] p-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-secondaryText mb-3">Old Regime</div>
          <h3 className="text-lg font-serif font-bold text-primaryText mb-2">More deductions, more complexity</h3>
          <p className="text-xs text-secondaryText leading-relaxed mb-5">Allows many deductions (80C, HRA, 80D, home loan interest) to lower taxable income. Best if you have significant eligible investments.</p>
          <ul className="space-y-2">
            {['Standard deduction: ₹50,000', 'Claim 80C up to ₹1,50,000', 'HRA exemption if you pay rent', 'Section 80D health insurance', 'Home loan interest (Section 24b)'].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs font-semibold text-primaryText">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondaryAccent shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#7BA88F]/5 border-2 border-secondaryAccent/20 rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondaryAccent">New Regime</div>
            <span className="text-[9px] font-bold bg-secondaryAccent text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Default from FY24</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-primaryText mb-2">Lower slabs, simpler filing</h3>
          <p className="text-xs text-secondaryText leading-relaxed mb-5">Features lower tax rates and zero tax up to ₹12L income (with rebate). Best for people with fewer deductions or higher income.</p>
          <ul className="space-y-2">
            {['Standard deduction: ₹75,000', 'Zero tax up to ₹12L (87A rebate)', 'Employer NPS deductible (80CCD2)', 'Lower slab rates (5% starts at ₹4L)', 'Simpler ITR filing'].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs font-semibold text-primaryText">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondaryAccent shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ResourcesPanel() {
  const items = [
    { section: 'Section 80C', limit: '₹1,50,000', desc: 'EPF, PPF, ELSS funds, LIC premium, home loan principal, NSC, 5-yr tax saver FD, school tuition fees.' },
    { section: 'Section 80D', limit: '₹25,000 – ₹1,00,000', desc: 'Health insurance premiums for self, spouse & children (+₹25K). Additional ₹50K for senior citizen parents.' },
    { section: 'Section 80CCD(1B)', limit: '₹50,000 extra', desc: 'Personal NPS Tier-1 contributions — over and above the 80C cap of ₹1.5L.' },
    { section: 'Section 24(b)', limit: '₹2,00,000', desc: 'Interest on home loan for self-occupied property (old regime only).' },
    { section: 'Section 87A Rebate', limit: 'Up to ₹60,000', desc: 'Full tax rebate if total income ≤ ₹12L (new regime). Old regime: ₹12,500 rebate if income ≤ ₹5L.' },
    { section: 'Standard Deduction', limit: '₹75K / ₹50K', desc: 'Auto-applied for salaried employees. ₹75,000 (New Regime) or ₹50,000 (Old Regime). No proof required.' },
  ]
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-bold text-secondaryAccent bg-secondaryAccent/10 border border-secondaryAccent/20 rounded-full px-4 py-1.5 mb-6 w-fit">
        <FileText className="w-3.5 h-3.5" /> Resources
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primaryText tracking-tight mb-2">Quick Tax Reference — FY 2025-26</h2>
      <p className="text-sm text-secondaryText mb-8 max-w-xl">Common deductions and limits at a glance.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div key={i} className="bg-[#FBF7F2] border border-bordercol rounded-[20px] p-5 flex flex-col gap-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.section}</div>
            <div className="text-lg font-bold text-primaryText">{item.limit}</div>
            <p className="text-xs text-secondaryText leading-relaxed">{item.desc}</p>
          </div>
        ))}
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
