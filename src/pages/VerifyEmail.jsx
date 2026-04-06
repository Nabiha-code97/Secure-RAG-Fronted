import OnboardingLayout from '../components/Onboarding/OnboardingLayout'
import EmailVerifyForm from '../components/Auth/EmailVerifyForm'

const VerifyEmail = () => (
  <OnboardingLayout>
    <div className="flex-1 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <EmailVerifyForm />
      </div>
    </div>
  </OnboardingLayout>
)

export default VerifyEmail
