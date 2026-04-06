import OnboardingLayout from '../../components/Onboarding/OnboardingLayout'
import DocumentsChoice from '../../components/Onboarding/DocumentsChoice'

const Documents = () => (
  <OnboardingLayout showSignIn>
    <div className="flex-1 flex flex-col items-center justify-start px-5 py-10">
      <div className="w-full max-w-xl">
        <DocumentsChoice />
      </div>
    </div>
  </OnboardingLayout>
)

export default Documents
