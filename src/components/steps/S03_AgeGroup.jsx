import { UserCircle } from 'lucide-react'

export function S03_AgeGroup({ data, update, goNext }) {
  const options = [
    { value: 'below60', label: 'Below 60 years', desc: 'Regular taxpayers' },
    { value: 'senior', label: '60 to 79 years', desc: 'Senior citizens' },
    { value: 'superSenior', label: '80 years and above', desc: 'Super senior citizens' }
  ]

  return (
    <div className="glass-card p-6 sm:p-10 mb-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <UserCircle className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
          Age Group
        </h2>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight mb-4">
        What is your age group?
      </h3>
      <p className="text-secondaryText font-medium mb-8">
        Tax slabs and basic exemption limits in the Old Regime vary based on your age.
      </p>

      <div className="space-y-4 mb-10">
        {options.map(opt => (
          <label 
            key={opt.value} 
            className={`relative flex items-center p-5 cursor-pointer rounded-2xl border-2 transition-all ${
              data.ageGroup === opt.value 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-bordercol bg-white hover:bg-gray-50'
            }`}
          >
            <input 
              type="radio" 
              name="ageGroup" 
              value={opt.value} 
              checked={data.ageGroup === opt.value}
              onChange={(e) => update({ ageGroup: e.target.value })}
              className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            />
            <div className="ml-4 flex flex-col">
              <span className={`text-lg font-bold ${data.ageGroup === opt.value ? 'text-primaryText' : 'text-gray-700'}`}>
                {opt.label}
              </span>
              <span className="text-sm font-medium text-secondaryText">
                {opt.desc}
              </span>
            </div>
          </label>
        ))}
      </div>

      <button onClick={goNext} className="premium-btn-primary py-4 px-10 text-base w-full md:w-auto">
        Continue
      </button>
    </div>
  )
}
