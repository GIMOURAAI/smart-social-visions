const STEP_LABELS = ["Briefing", "Objetivo", "Estilo", "Formato"];

interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="space-y-4">
      {/* Step dots with labels */}
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-white shadow-glow"
                    : isActive
                    ? "bg-gradient-primary text-white shadow-glow scale-110"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3.5 3.5L13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                  isActive ? "text-primary" : isCompleted ? "text-primary/60" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connecting line */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, ((currentStep - 1) / (STEP_LABELS.length - 1)) * 100)}%` }}
        />
      </div>
    </div>
  );
}
