import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { forgotPassword } from '../../services/authService'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setError('Email is required.')
    if (!emailRegex.test(email)) return setError('Enter a valid email address.')
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      toast.success('OTP sent to your email!')
      navigate('/verify-otp', { state: { email, flow: 'reset' } })
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="mb-8 w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
      <p className="text-gray-500 text-sm mb-7">Please enter your email to reset the password</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            className={`w-full border rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none transition-colors ${
              error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium text-sm text-white transition-opacity disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordForm
