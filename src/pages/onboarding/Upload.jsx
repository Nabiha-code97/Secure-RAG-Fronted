import OnboardingLayout from '../../components/Onboarding/OnboardingLayout'
import DocumentUpload from '../../components/Onboarding/DocumentUpload'

const Upload = () => (
  <OnboardingLayout>
    <div className="flex-1 flex flex-col items-center justify-start px-5 py-10">
      <div className="w-full max-w-xl">
        <DocumentUpload />
      </div>
    </div>
  </OnboardingLayout>
)

export default Upload
