import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AuthContext'
import { selectPlan } from '../../services/authService'

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M20 6L9 17l-5-5" stroke="#1a5c6b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PLANS = [
  {
    name: 'Free',
    tagline: 'Perfect for individuals trying SecureRAG for the first time.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Up to 10 documents',
      '1 workspace',
      'Max 15MB per file',
      '50 questions per month',
      'Free Exclusives',
    ],
  },
  {
    name: 'Pro',
    tagline: 'For professionals and small teams who need more power and security.',
    monthlyPrice: 19,
    yearlyPrice: 15,
    features: [
      'Up to 100 documents',
      'Max 50MB per file',
      'Unlimited questions',
      'Up to 5 workspaces',
      'Up to 5 team members',
      'Role-based access control',
    ],
    emphasized: true,
  },
  {
    name: 'Pro+',
    tagline: 'For organizations with advanced security, compliance, and scale needs.',
    monthlyPrice: 32,
    yearlyPrice: 26,
    features: [
      'Unlimited documents',
      'Unlimited file size',
      'Unlimited questions',
      'Unlimited team members',
      'Custom security & compliance',
    ],
  },
]

const PlanSelection = () => {
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'yearly'
  const [loading, setLoading] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}

  const handleSelectPlan = async (planName) => {
    setLoading(planName)
    try {
      await selectPlan({ email: state.email, plan: planName })
    } catch (err) {
      // Non-blocking: proceed even if API fails during onboarding
    } finally {
      setLoading(null)
      navigate('/dashboard')
    }
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose your trial</h1>
        <p className="text-gray-500 text-sm">Start free. No credit card required.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-gray-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              billing === 'monthly'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={billing === 'monthly' ? { background: '#1a5c6b' } : {}}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              billing === 'yearly'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={billing === 'yearly' ? { background: '#1a5c6b' } : {}}
          >
            Yearly{' '}
            <span className={billing === 'yearly' ? 'text-teal-200' : 'text-teal-600'}>
              (Save 20%)
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full max-w-5xl mx-auto">
        {PLANS.map((plan) => {
          const isYearly = billing === 'yearly'
          const price = isYearly && plan.yearlyPrice > 0 ? plan.yearlyPrice : plan.monthlyPrice
          const originalPrice = plan.monthlyPrice
          const showDiscount = isYearly && plan.yearlyPrice > 0 && plan.yearlyPrice !== plan.monthlyPrice

          return (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col bg-white
                ${plan.emphasized
                  ? 'border-2 border-[#1a5c6b] shadow-md'
                  : 'border border-gray-200'
                }`}
            >
              {/* Plan name + tagline */}
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-xs text-gray-500 leading-relaxed">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">${price}</span>
                  <span className="text-base text-gray-500">/mo</span>
                </div>
                {showDiscount && (
                  <p className="text-xs text-gray-400 mt-1 line-through">
                    ${originalPrice}/mo
                  </p>
                )}
                {plan.monthlyPrice === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Forever free</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <CheckIcon />
                    <span className="text-sm text-gray-600">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.name === 'Free' && (
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loading === plan.name}
                  className="w-full py-2.5 rounded-full text-sm font-semibold border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  {loading === plan.name ? 'Loading...' : 'Join Free'}
                </button>
              )}
              {plan.name === 'Pro' && (
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loading === plan.name}
                  className="w-full py-2.5 rounded-full text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
                >
                  {loading === plan.name ? 'Loading...' : 'Join Pro'}
                </button>
              )}
              {plan.name === 'Pro+' && (
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loading === plan.name}
                  className="w-full py-2.5 rounded-full text-sm font-semibold bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-60"
                >
                  {loading === plan.name ? 'Loading...' : 'Join Pro+'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlanSelection
