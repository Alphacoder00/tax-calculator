# TaxWise Implementation Tasks

## Phase 1: Project Setup & Foundation
- [x] Initialize React project using Vite (`npm create vite@latest . -- --template react`).
- [x] Clean up default Vite boilerplate (remove `App.css`, modify `main.jsx`, etc.).
- [x] Install dependencies (`tailwindcss`, `postcss`, `autoprefixer`).
- [x] Configure `tailwind.config.js` with the specified theme (Inter font) and plugins.
- [x] Configure `postcss.config.js` for tailwindcss and autoprefixer.
- [x] Update `package.json` scripts and dependencies to match PRD versions.
- [x] Update `vite.config.js` with `allowedHosts: true`.
- [x] Update `index.html` with title, meta description, favicon, and Google Fonts (Inter).
- [x] Create `src/index.css` with Tailwind directives, base styles, and custom animations (`card-enter`, `reveal`).

## Phase 2: Core State & Utility Functions
- [x] Create `src/constants.js` with all tax slabs (New/Old), standard deductions, and tax caps.
- [x] Create `src/utils.js` with formatting (`fmt`, `fmtNum`) and helper functions (`toNum`, `calc80CTotal`).
- [x] Create `src/taxEngine.js` with progressive slab calculation (`applySlabs`).
- [x] Implement `calculateGrossIncome` and `calculateHRAExemption` in `taxEngine.js`.
- [x] Implement `calculateNewRegimeTax` and `calculateOldRegimeTax` in `taxEngine.js`.
- [x] Implement `compareRegimes`, `calculateTDSPosition`, and `computeTax` in `taxEngine.js`.
- [x] Set up `src/App.jsx` with `INITIAL_STATE` and main state variables (`step`, `data`, `results`).
- [x] Implement state management functions (`update`, `goNext`, `goBack`, `skipTo`, `reset`) in `App.jsx`.

## Phase 3: Shared Components
- [x] Create `src/components/ProgressBar.jsx` (dot-based progress indicator).
- [x] Create `src/components/NumberInput.jsx` (numeric input with green validation).
- [x] Create `src/components/FrequencyInput.jsx` (monthly/annual toggle input).
- [x] Create `src/components/CommonQuestions.jsx` (collapsible FAQ accordion).
- [x] Create `src/components/ConfusedLink.jsx` (inline help link with `?` icon).

## Phase 4: Layout & Navigation Shell
- [x] Create `src/components/StepWrapper.jsx` to handle the two-column layout, sticky nav, and progress bar integration.
- [x] Create `src/components/steps/S01_Landing.jsx` (landing page with hero section, trust bullets, feature cards).
- [x] Update `src/App.jsx` to render `S01_Landing` for step 1 and setup `StepWrapper` for steps 2-12.

## Phase 5: Form Steps (Data Collection)
- [x] Implement `src/components/steps/S02_FinancialYear.jsx` (locked to FY 2025-26).
- [x] Implement `src/components/steps/S03_AgeGroup.jsx` (Below 60, Senior, Super Senior radio buttons).
- [x] Implement `src/components/steps/S04_SalaryDetails.jsx` (Take-home, basic pay, bonus section with inline warnings).
- [x] Implement `src/components/steps/S05_SalaryComponents.jsx` (HRA, Professional Tax, Employer NPS checkboxes with sub-inputs).
- [x] Implement `src/components/steps/S06_OtherIncome.jsx` (FD and Savings interest with explainer cards).
- [x] Implement `src/components/steps/S07_PaysRent.jsx` (Yes/No rent toggle).
- [x] Implement `src/components/steps/S08_RentDetails.jsx` (Monthly rent, city type, HRA in salary).
- [x] Implement `src/components/steps/S09_TaxSavingInvestments.jsx` (80C items, custom FreqToggle, Personal NPS).
- [x] Implement `src/components/steps/S10_HealthInsurance.jsx` (Self and Parents insurance with custom InsuranceCard).
- [x] Implement `src/components/steps/S11_HomeLoan.jsx` (Ownership options and interest input).
- [x] Implement `src/components/steps/S12_TDS.jsx` (Employer TDS and conditional Bank TDS).

## Phase 6: Live Preview & Calculation
- [x] Implement `src/components/TaxPreviewPanel.jsx` (Live Right-Column Preview logic and UI).
- [x] Integrate `TaxPreviewPanel` into `StepWrapper.jsx` for desktop layout (steps 2-12).
- [x] Implement `src/components/steps/S13_Calculating.jsx` (Animation Screen with StrictMode guard and async computation).
- [x] Connect `S13_Calculating` to `App.jsx` to trigger `computeTax` and transition to results.

## Phase 7: Result Page & Breakdown Sections
- [x] Create `src/components/results/SectionA_Verdict.jsx` (Recommendation and savings banner).
- [x] Create `src/components/results/SectionB_TaxSummary.jsx` (Side-by-side regime cards and TDS message).
- [x] Create `src/components/results/SectionC_DetailedBreakdown.jsx` (Collapsible slab tables and detailed deductions).
- [x] Create `src/components/results/SectionD_Education.jsx` (Collapsible explanation of tax treatments).
- [x] Create `src/components/results/SectionE_NextSteps.jsx` (Conditional suggestion cards).
- [x] Implement `src/components/steps/S14_Results.jsx` (Result page layout combining Sections A-E, disclaimer, action buttons).
- [ ] Perform end-to-end verification against the 19 test cases defined in the PRD (Section 16).
