import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { selectSampleDoc } from '../../services/authService'
import { useAppContext } from '../../context/AuthContext'

const SAMPLE_DOCS = {
  'Finance & Banking': [
    { id: 'refund', title: 'Refund Policy', desc: 'Standard refund & return policy template for finance teams', pages: 2 },
    { id: 'kyc', title: 'KYC Guidelines', desc: 'Know Your Customer compliance document', pages: 4 },
    { id: 'loan', title: 'Loan FAQ', desc: 'Frequently asked questions about loan products', pages: 3 },
    { id: 'account', title: 'Account Terms', desc: 'Terms and conditions for account holders', pages: 4 },
  ],
  'Healthcare': [
    { id: 'hipaa', title: 'HIPAA Guidelines', desc: 'Health data privacy and compliance guide', pages: 6 },
    { id: 'patient', title: 'Patient FAQ', desc: 'Frequently asked questions for patients', pages: 3 },
    { id: 'consent', title: 'Consent Form', desc: 'Standard patient consent form template', pages: 2 },
    { id: 'billing', title: 'Billing Policy', desc: 'Medical billing and payment policy', pages: 4 },
  ],
  'Government & NGO': [
    { id: 'proc', title: 'Procurement Policy', desc: 'Standard government procurement guidelines', pages: 8 },
    { id: 'grant', title: 'Grant Guidelines', desc: 'NGO grant application guidelines', pages: 5 },
    { id: 'comp', title: 'Compliance Doc', desc: 'Regulatory compliance requirements', pages: 4 },
    { id: 'pfaq', title: 'Public Services FAQ', desc: 'FAQs about public services', pages: 3 },
  ],
  'Other': [
    { id: 'handbook', title: 'Employee Handbook', desc: 'Standard employee policies and procedures', pages: 10 },
    { id: 'privacy', title: 'Privacy Policy', desc: 'Data privacy and protection policy', pages: 3 },
    { id: 'terms', title: 'Service Terms', desc: 'Terms of service agreement', pages: 5 },
    { id: 'ops', title: 'Operations Manual', desc: 'Standard operating procedures', pages: 7 },
  ],
}

const RadioCircle = ({ selected }) => (
  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-[#1a5c6b]' : 'border-gray-300'}`}>
    {selected && <div className="w-2 h-2 rounded-full bg-[#1a5c6b]" />}
  </div>
)

const DocumentsChoice = () => {
  const [choice, setChoice] = useState(null) // 'yes' | 'no'
  const [selectedSamples, setSelectedSamples] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}
  const { category } = state
  const { token } = useAppContext()

  const sampleDocs = SAMPLE_DOCS[category] || SAMPLE_DOCS['Other']

  const toggleSample = (id) => {
    setSelectedSamples((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const canContinue = choice === 'yes' || (choice === 'no' && selectedSamples.length > 0)

  const handleContinue = async () => {
    if (!canContinue) return
    if (choice === 'yes') {
      navigate('/onboarding/upload', { state })
    } else {
      setLoading(true)
      try {
        await Promise.all(selectedSamples.map((docId) => selectSampleDoc(docId, token)))
      } catch (err) {
        toast.error(err.message || 'Failed to select sample documents.')
        setLoading(false)
        return
      }
      setLoading(false)
      navigate('/onboarding/plan', { state: { ...state, selectedSamples } })
    }
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 max-w-sm mx-auto leading-tight">
          Do you have documents ready to upload?
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Your chatbot learns from your documents. Choose how you&apos;d like to proceed.
        </p>
      </div>

      {/* Option Cards */}
      <div className="max-w-lg mx-auto space-y-3 mb-6">
        {/* Card 1: Yes */}
        <button
          type="button"
          onClick={() => setChoice('yes')}
          className={`w-full border rounded-2xl p-4 cursor-pointer text-left flex items-start gap-4 transition-colors
            ${choice === 'yes'
              ? 'border-[#1a5c6b] bg-teal-50/30'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
        >
          <RadioCircle selected={choice === 'yes'} />
          <div>
            <p className="text-sm font-semibold text-gray-900">Yes, I have documents ready</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Upload your own PDF, DOCX, or TXT files. Your chatbot will be trained on your actual content.
            </p>
          </div>
        </button>

        {/* Card 2: No */}
        <button
          type="button"
          onClick={() => setChoice('no')}
          className={`w-full border rounded-2xl p-4 cursor-pointer text-left flex items-start gap-4 transition-colors
            ${choice === 'no'
              ? 'border-[#1a5c6b] bg-teal-50/30'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
        >
          <RadioCircle selected={choice === 'no'} />
          <div>
            <p className="text-sm font-semibold text-gray-900">No, show me sample documents</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              We&apos;ll give you ready made sample documents based on your industry so you can explore SecureRAG right away.
            </p>
          </div>
        </button>
      </div>

      {/* Sample Documents Section (shown when "No" selected) */}
      {choice === 'no' && (
        <div className="max-w-lg mx-auto mb-6">
          {/* Industry Badge */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm font-semibold text-gray-900">{category || 'Other'}</p>
            <p className="text-xs text-gray-400 mt-0.5">Based on your selected business category</p>
          </div>

          <p className="text-sm font-semibold text-gray-800 mb-3">
            Select documents to add to your workspace
          </p>

          <div className="grid grid-cols-2 gap-3">
            {sampleDocs.map((doc) => {
              const isSelected = selectedSamples.includes(doc.id)
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleSample(doc.id)}
                  className={`relative border rounded-xl p-3 text-left cursor-pointer transition-colors
                    ${isSelected
                      ? 'border-[#1a5c6b] bg-teal-50/40'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  {/* Radio in top-right */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#1a5c6b]' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#1a5c6b]" />}
                    </div>
                  </div>

                  <p className="font-semibold text-sm text-gray-900 pr-6">{doc.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{doc.desc}</p>
                  <p className="text-xs text-gray-400 mt-2">PDF · {doc.pages} pages</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {choice && (
        <div className="max-w-lg mx-auto flex justify-center mb-3">
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
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-400 text-center">
        You can always upload or change documents later from your dashboard.
      </p>
    </div>
  )
}

export default DocumentsChoice
