import OnboardingLayout from '../../components/Onboarding/OnboardingLayout'
import WorkspaceForm from '../../components/Onboarding/WorkspaceForm'

const Workspace = () => (
  <OnboardingLayout>
    <div className="flex-1 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <WorkspaceForm />
      </div>
    </div>
  </OnboardingLayout>
)

export default Workspace
