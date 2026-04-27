import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AuthContext'
import { loginUser } from '../../services/authService'

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)

const validateEmail = (val) => {
  if (!val.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.'
  return ''
}

const validatePassword = (val) => {
  if (!val) return 'Password is required.'
  return ''
}

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { navigate, setUser, setToken } = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = { email: validateEmail(email), password: validatePassword(password) }
    Object.keys(errs).forEach((k) => { if (!errs[k]) delete errs[k] })
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const data = await loginUser({ email, password })
      // If user needs to complete onboarding, redirect to organization form
      if (data.needs_onboarding && data.onboarding_token) {
        setToken(data.onboarding_token)
        setUser({ email })
        toast.success('Email verified! Please complete your organization setup.')
        navigate('/onboarding/category', { state: { email } })
      } else if (data.access_token) {
        setToken(data.access_token)
        setUser({ email })
        toast.success('Signed in successfully!')
        navigate('/dashboard')
      } else {
        throw new Error('No token in response')
      }
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (field) =>
    `w-full border rounded-lg px-4 py-2.5 sm:py-3 text-sm placeholder-gray-400 focus:outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-300 focus:border-gray-500'
    }`

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
        Sign in to your workspace
      </h1>
      <p className="text-gray-500 text-xs sm:text-sm mb-5 sm:mb-6">
        Enter your credentials to access your secure knowledge base.
      </p>

      {/* Google Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-black text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm mb-4 sm:mb-5 hover:bg-gray-800 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
          <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-xs whitespace-nowrap">Or, sign in with email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: validateEmail(e.target.value) })) }}
            placeholder="name@company.com"
            className={fieldClass('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: validatePassword(e.target.value) })) }}
              placeholder="Enter password"
              className={`${fieldClass('password')} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-4 sm:mb-5">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm text-white transition-opacity disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-5">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => navigate('/signup')}
          className="font-semibold text-gray-900 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  )
}

export default LoginForm
