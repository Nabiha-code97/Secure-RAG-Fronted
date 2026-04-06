import OnboardingLayout from '../../components/Onboarding/OnboardingLayout'
import PlanSelection from '../../components/Onboarding/PlanSelection'

const Plan = () => (
  <OnboardingLayout>
    <div className="flex-1 flex flex-col items-center justify-start px-5 py-10 w-full">
      <PlanSelection />
    </div>
  </OnboardingLayout>
)

export default Plan
