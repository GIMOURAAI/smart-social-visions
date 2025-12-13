interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <div
          key={stepNum}
          className={`h-2 rounded-full transition-all duration-300 ${
            stepNum === currentStep
              ? "w-8 bg-primary"
              : stepNum < currentStep
              ? "w-2 bg-primary/60"
              : "w-2 bg-muted"
          }`}
        />
      ))}
    </div>
  );
}
