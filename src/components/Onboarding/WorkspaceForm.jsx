import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { saveWorkspace } from '../../services/authService'

const MAX_CHARS = 50
const WORKSPACE_REGEX = /^[a-zA-Z0-9 -]+$/

const WorkspaceForm = () => {
  const [workspaceName, setWorkspaceName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const prevState = location.state || {}

  const validate = (value) => {
    if (!value.trim()) return 'Workspace name is required'
    if (value.trim().length < 2) return 'Workspace name must be at least 2 characters'
    if (value.length > MAX_CHARS) return `Workspace name cannot exceed ${MAX_CHARS} characters`
    if (!WORKSPACE_REGEX.test(value)) return 'Only letters, numbers, spaces, and hyphens allowed'
    return ''
  }

  const handleChange = (e) => {
    const val = e.target.value
    if (val.length > MAX_CHARS) return
    setWorkspaceName(val)
    if (error) setError(validate(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate(workspaceName)
    if (err) {
      setError(err)
      return
    }
    setError('')
    setLoading(true)
    try {
      await saveWorkspace({ email: prevState.email, workspaceName: workspaceName.trim() })
    } catch (apiErr) {
      toast.error(apiErr.message || 'Failed to save workspace.')
      setLoading(false)
      return
    }
    setLoading(false)
    navigate('/onboarding/documents', { state: { ...prevState, workspaceName: workspaceName.trim() } })
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set up your workspace</h1>
        <p className="text-gray-500 text-sm">This is how your team will identify your workspace.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Workspace Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={workspaceName}
            onChange={handleChange}
            maxLength={MAX_CHARS}
            className={`w-full py-3 px-5 rounded-full border outline-none text-sm transition-colors
              ${error ? 'border-red-400 bg-red-50/30' : 'border-gray-300 focus:border-[#1a5c6b]'}`}
          />
          <div className="flex justify-between items-start mt-1.5">
            <div>
              {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 pl-4">
              {workspaceName.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!workspaceName.trim() || loading}
            className="w-full max-w-xs py-3 rounded-full font-medium text-sm text-white transition-opacity disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WorkspaceForm
