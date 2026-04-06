import OnboardingLayout from '../../components/Onboarding/OnboardingLayout'
import CategoryForm from '../../components/Onboarding/CategoryForm'

const Category = () => (
  <OnboardingLayout>
    <div className="flex-1 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-xl">
        <CategoryForm />
      </div>
    </div>
  </OnboardingLayout>
)

export default Category
