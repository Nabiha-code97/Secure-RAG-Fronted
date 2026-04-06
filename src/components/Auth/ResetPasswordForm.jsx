import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resetPassword } from '../../services/authService'

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

const SuccessModal = ({ onGoToLogin }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full px-8 py-10 flex flex-col items-center text-center">
      {/* Check circle */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h2>
      <p className="text-gray-500 text-sm mb-7">
        Your password has been updated successfully. You can now sign in with your new password.
      </p>
      <button
        onClick={onGoToLogin}
        className="w-full py-3 rounded-lg font-medium text-sm text-white"
        style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
      >
        Back to Sign In
      </button>
    </div>
  </div>
)

const validate = ({ password, confirm }) => {
  const errors = {}
  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 8) {
    errors.password = 'Minimum 8 characters.'
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Must include at least one uppercase letter.'
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    errors.password = 'Must include at least one special character.'
  }
  if (!confirm) {
    errors.confirm = 'Please confirm your password.'
  } else if (password && confirm !== password) {
    errors.confirm = 'Passwords do not match.'
  }
  return errors
}

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { email, otp } = location.state || {}

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate({ password, confirm })
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors)
    setErrors({})
    setLoading(true)
    try {
      await resetPassword({ email, otp, password })
      setSuccess(true)
    } catch (err) {
      toast.error(err.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (field) =>
    `w-full border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none transition-colors ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
    }`

  return (
    <>
      {success && <SuccessModal onGoToLogin={() => navigate('/login', { replace: true })} />}

      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Password</h1>
        <p className="text-gray-500 text-sm mb-7">Ensure it differs from previous one for security.</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                className={`${fieldClass('password')} pr-11`}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })) }}
                className={`${fieldClass('confirm')} pr-11`}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium text-sm text-white transition-opacity disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </>
  )
}

export default ResetPasswordForm
