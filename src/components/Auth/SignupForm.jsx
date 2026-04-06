import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signupUser } from '../../services/authService'
import { logger } from '../../utils/logger'

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3" stroke="#9ca3af" strokeWidth="1.8"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )

const validateName = (val) => {
  if (!val.trim()) return 'Full name is required'
  if (val.trim().length < 2) return 'Name must be at least 2 characters'
  if (!/[a-zA-Z]/.test(val)) return 'Name must contain letters'
  return ''
}

const validateEmail = (val) => {
  if (!val.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address'
  return ''
}

const validatePassword = (val) => {
  if (!val) return 'Password is required'
  if (val.length < 8) return 'Must be at least 8 characters'
  if (!/[A-Z]/.test(val)) return 'Must contain at least 1 uppercase letter'
  if (!/[a-z]/.test(val)) return 'Must contain at least 1 lowercase letter'
  if (!/[0-9]/.test(val)) return 'Must contain at least 1 digit'
  return ''
}

const SignupForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleNameChange = (e) => {
    // Strip digits — names don't contain numbers
    const val = e.target.value.replace(/[0-9]/g, '')
    setName(val)
    setErrors((prev) => ({ ...prev, name: validateName(val) }))
  }

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }))
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPassword(val)
    setErrors((prev) => ({ ...prev, password: validatePassword(val) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    }
    // Remove empty errors
    Object.keys(errs).forEach((k) => { if (!errs[k]) delete errs[k] })
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      logger.warning('Validation failed', errs)
      return
    }

    setLoading(true)
    logger.section('SIGNUP ATTEMPT')
    logger.info('Submitting signup form', {
      name: name.trim(),
      email: email.trim(),
      passwordLength: password.length
    })

    try {
      const response = await signupUser({ name: name.trim(), email: email.trim(), password })
      logger.success('Signup completed successfully', response)
      toast.success('Account created! Check your email for verification code.')
      navigate('/verify-email', { state: { email: email.trim() } })
    } catch (err) {
      logger.error('Signup failed', err, { email: email.trim() })
      toast.error(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full py-3 px-5 rounded-full border outline-none text-sm transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50/30' : 'border-gray-300 focus:border-[#1a5c6b]'
    }`

  return (
    <div className="w-full">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Create your account</h1>
        <p className="text-sm text-gray-500">Start your free trial. 14 days free. No credit card needed</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={handleNameChange}
            className={inputClass('name')}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1 pl-2">{errors.name}</p>}
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleEmailChange}
            className={inputClass('email')}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 pl-2">{errors.email}</p>}
          <div className="mt-2 bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-md">
            You can use your work email or personal email (Gmail, Yahoo, etc.) to sign up.
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit"
              value={password}
              onChange={handlePasswordChange}
              className={`${inputClass('password')} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1 pl-2">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full font-medium text-sm text-white transition-opacity disabled:opacity-60 mt-2"
          style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="font-bold underline text-gray-800 hover:text-[#1a5c6b] transition-colors"
        >
          Sign In
        </button>
      </p>
    </div>
  )
}

export default SignupForm
