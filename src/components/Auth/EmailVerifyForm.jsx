import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyEmail, resendOTP } from '../../services/authService'
import { useAppContext } from '../../context/AuthContext'

const RESEND_COOLDOWN = 60

const EmailVerifyForm = () => {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const { email } = location.state || {}
  const { setToken } = useAppContext()

  useEffect(() => {
    if (!email) navigate('/signup', { replace: true })
  }, [email, navigate])

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const updated = [...digits]
    updated[index] = value
    setDigits(updated)
    if (value && index < 3) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    const updated = ['', '', '', '']
    pasted.split('').forEach((ch, i) => { updated[i] = ch })
    setDigits(updated)
    const nextEmpty = updated.findIndex((d) => d === '')
    inputRefs.current[nextEmpty === -1 ? 3 : nextEmpty]?.focus()
  }

  const handleVerify = async () => {
    const code = digits.join('')
    if (code.length < 4) return toast.error('Please enter the 4-digit code.')
    setLoading(true)
    try {
      const data = await verifyEmail({ email, otp: code })
      console.log('verifyEmail response:', data)
      if (data.access_token || data.token) setToken(data.access_token || data.token)
      toast.success('Email verified!')
      navigate('/onboarding/category', { state: { email } })
    } catch (err) {
      toast.error(err.message || 'Invalid or expired code.')
      setDigits(['', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    try {
      await resendOTP(email)
      toast.success('Verification code resent!')
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      toast.error(err.message || 'Failed to resend code.')
    }
  }

  return (
    <div className="w-full text-center">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Please verify your email</h1>
      <p className="text-gray-500 text-sm mb-2">
        We&apos;ve sent a verification code to
      </p>
      <p className="text-gray-900 font-semibold text-sm mb-8">{email}</p>

      {/* OTP Inputs */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-xl font-semibold border-2 rounded-xl outline-none transition-colors
              ${digit
                ? 'border-[#1a5c6b] bg-teal-50/30 text-gray-900'
                : 'border-gray-300 text-gray-400 bg-white'
              } focus:border-[#1a5c6b]`}
          />
        ))}
      </div>

      {/* Resend */}
      <p className="text-sm text-gray-500 mb-8">
        Didn&apos;t receive the code?{' '}
        {cooldown > 0 ? (
          <span className="text-gray-400">Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-gray-900 hover:underline hover:text-[#1a5c6b] transition-colors"
          >
            Resend code
          </button>
        )}
      </p>

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || digits.join('').length < 4}
        className="w-full py-3 rounded-full font-medium text-sm text-white transition-opacity disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>

      <p className="text-xs text-gray-400 mt-5">
        Wrong email?{' '}
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="text-gray-600 underline hover:text-[#1a5c6b]"
        >
          Go back
        </button>
      </p>
    </div>
  )
}

export default EmailVerifyForm
