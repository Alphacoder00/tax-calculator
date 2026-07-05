import { ProgressBar } from './ProgressBar'
import { TaxPreviewPanel } from './TaxPreviewPanel'

export function StepWrapper({ children, goBack, reset, showProgress, progressStep, TOTAL_PROGRESS, step, data, stepName }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center gap-3">
          <button type="button" onClick={reset} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.502-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm-9.75-9h13.5c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5H5.25c-.828 0-1.5-.672-1.5-1.5V10.5c0-.828.672-1.5 1.5-1.5Zm0 0V6c0-.828.672-1.5 1.5-1.5h10.5c.828 0 1.5.672 1.5 1.5v3" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-gray-900 tracking-tight leading-none">TaxWise</span>
              <span className="text-[10px] text-gray-400 leading-none mt-0.5 hidden sm:block">India Tax Calculator</span>
            </div>
          </button>

          {step > 1 && (
            <button type="button" onClick={goBack} className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
          )}

          {showProgress && (
            <div className="flex-1 min-w-0">
              <ProgressBar current={progressStep} total={TOTAL_PROGRESS} stepName={stepName} />
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 shrink-0 ml-auto">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-semibold text-gray-600 leading-none">100% Private</span>
              <span className="text-[10px] text-gray-400 leading-none mt-0.5">Data stays in your browser</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <main className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 card-enter">
              {children}
            </div>
          </main>
          {data && (
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-20">
                <TaxPreviewPanel data={data} />
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-4 text-xs text-center text-gray-300">
        Salaried individuals · FY 2025-26 · No data saved
      </footer>
    </div>
  )
}
