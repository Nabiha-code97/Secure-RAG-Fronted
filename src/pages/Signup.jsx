import OnboardingLayout from '../components/Onboarding/OnboardingLayout'
import SignupForm from '../components/Auth/SignupForm'

const Signup = () => (
  <OnboardingLayout>
    <div className="flex-1 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  </OnboardingLayout>
)

export default Signup
