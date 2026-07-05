import { useState, useEffect, useRef } from 'react'
import { computeTax } from '../../taxEngine'
import { Loader2, CheckCircle2, Circle } from 'lucide-react'

const STEPS = [
  "Adding up all your income",
  "Applying your salary components",
  "Computing old regime with all deductions",
  "Computing new regime",
  "Comparing both regimes",
  "Finding the best option for you"
]

export function S13_Calculating({ data, goNext, setResults }) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i)
        if (i > 0) {
          setDoneSteps(prev => [...prev, i - 1])
        }
      }, i * 380)
    })

    const totalDelay = STEPS.length * 380 + 300
    
    setTimeout(() => {
      setDoneSteps(prev => [...prev, STEPS.length - 1])
      const results = computeTax(data)
      setResults(results)
      
      setTimeout(goNext, 400)
    }, totalDelay)
  }, [data, goNext, setResults])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 bg-background">
      <div className="glass-card p-10 max-w-sm w-full space-y-10 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-3xl rounded-full opacity-50"></div>

        <div className="relative">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-primaryText tracking-tight">Crunching your numbers</h2>
            <p className="text-sm font-medium text-secondaryText mt-2">This will take just a moment</p>
          </div>
        </div>
        
        <div className="space-y-4 text-left relative">
          {STEPS.map((step, i) => {
            const isDone = doneSteps.includes(i)
            const isActive = activeStep === i && !isDone
            const isUpcoming = !isDone && !isActive

            return (
              <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${isUpcoming ? 'opacity-40' : 'opacity-100'} ${isActive ? 'scale-105 origin-left' : ''}`}>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : isActive ? (
                  <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                )}
                
                <span className={`text-sm font-bold tracking-wide ${isDone ? 'text-primaryText' : isActive ? 'text-primary' : 'text-secondaryText'}`}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
