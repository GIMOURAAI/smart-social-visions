interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const pct = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-muted-foreground">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-primary font-bold">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-primary transition-all duration-500 rounded-full shadow-glow"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
