import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { saveOrganization } from '../../services/authService'
import { useAppContext } from '../../context/AuthContext'

const CATEGORIES = [
  'Healthcare',
  'Finance & Banking',
  'Government & NGO',
  'Education',
  'Technology',
  'Retail',
  'Other',
]

const EMPLOYEE_OPTIONS = [
  '1-15',
  '16-49',
  '50-199',
  '200-1999',
  '2000-4999',
  'just-me',
]

const ChevronDown = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const RadioCircle = ({ selected }) => (
  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-[#1a5c6b]' : 'border-gray-300'}`}>
    {selected && <div className="w-2 h-2 rounded-full bg-[#1a5c6b]" />}
  </div>
)

const CategoryForm = () => {
  const [category, setCategory] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { email } = location.state || {}
  const { token } = useAppContext()

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleContinue = async () => {
    if (!category || !employeeCount) return
    if (!token) {
      toast.error('Session expired. Please verify your email again.')
      return
    }

    setLoading(true)
    try {
      console.log('Saving organization:', { category, employeeCount, token: token?.slice(0, 10) + '...' })
      const result = await saveOrganization({ category, employeeCount }, token)
      console.log('Organization saved successfully:', result)
      navigate('/onboarding/workspace', { state: { email, category, employeeCount } })
    } catch (err) {
      console.error('Organization save error:', err)
      const errorMsg = err.message || 'Failed to save organization info.'

      // Helpful error messages
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        toast.error('Your session has expired. Please verify your email again.')
      } else if (errorMsg.includes('Network error') || errorMsg.includes('Unable to reach')) {
        toast.error('Backend server is not responding. Please try again in a moment.')
      } else {
        toast.error(errorMsg)
      }

      setLoading(false)
    }
  }

  const canContinue = category && employeeCount

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About your organization</h1>
        <p className="text-gray-500 text-sm">Two quick questions to set up your perfect workspace.</p>
      </div>

      {/* Q1: Business Category */}
      <div className="mb-7">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          1. Your business category?
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between py-3 px-5 rounded-full border border-gray-300 bg-white text-sm outline-none hover:border-[#1a5c6b] transition-colors"
          >
            <span className={category ? 'text-gray-900' : 'text-gray-400'}>
              {category || 'Select your industry'}
            </span>
            <ChevronDown open={dropdownOpen} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat)
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-5 py-3 text-sm transition-colors hover:bg-teal-50
                    ${category === cat ? 'bg-teal-50 text-[#1a5c6b] font-medium' : 'text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Q2: Employee Count */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          2. How many full-time employees do you have?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {EMPLOYEE_OPTIONS.map((option) => {
            const selected = employeeCount === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => setEmployeeCount(option)}
                className={`flex items-center gap-3 border rounded-xl py-3 px-4 text-sm cursor-pointer transition-colors text-left
                  ${selected
                    ? 'border-[#1a5c6b] bg-teal-50/40 text-gray-900'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <RadioCircle selected={selected} />
                <span>{option}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || loading}
          className="w-full max-w-xs py-3 rounded-full font-medium text-sm text-white transition-opacity disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default CategoryForm
