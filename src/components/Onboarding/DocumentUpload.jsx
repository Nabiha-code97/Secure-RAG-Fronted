import { useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { uploadDocuments } from '../../services/authService'
import { useAppContext } from '../../context/AuthContext'

const ALLOWED_TYPES = ['.pdf', '.docx', '.txt', '.doc']
const ALLOWED_MIME = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'application/msword']
const MAX_SIZE_MB = 15
const MAX_FILES = 10

const CloudUploadIcon = () => (
  <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16.243A4 4 0 0 1 5.172 9a6 6 0 0 1 11.656 0A4 4 0 0 1 20 16.243" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12v9M9 15l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const XCircleIcon = ({ color = '#9ca3af' }) => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)


const WarningIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ea580c" strokeWidth="1.8" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="0.5" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)


let fileIdCounter = 0

const DocumentUpload = () => {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || {}
  const { token } = useAppContext()

  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles)
    setFiles((prev) => {
      const toAdd = []

      for (const file of fileArray) {
        if (prev.length + toAdd.length >= MAX_FILES) break
        const id = ++fileIdCounter
        const nameLower = file.name.toLowerCase()
        const hasAllowedExt = ALLOWED_TYPES.some((ext) => nameLower.endsWith(ext))
        const tooLarge = file.size > MAX_SIZE_MB * 1024 * 1024

        if (!hasAllowedExt || tooLarge) {
          toAdd.push({
            id,
            name: file.name,
            status: 'error',
            progress: 0,
            errorMsg: !hasAllowedExt
              ? 'This document is not supported, please delete and upload another file.'
              : `File exceeds the ${MAX_SIZE_MB}MB size limit.`,
          })
        } else {
          toAdd.push({ id, name: file.name, file, status: 'ready', progress: 0, errorMsg: '' })
        }
      }

      return [...prev, ...toAdd]
    })
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleBrowse = () => fileInputRef.current?.click()

  const handleFileInput = (e) => {
    if (e.target.files.length) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const readyFiles = files.filter((f) => f.status === 'ready')
  const totalFiles = files.length

  const showWarning = files.length > 0 && readyFiles.length === 0

  const canContinue = readyFiles.length > 0 && !uploading

  const handleContinue = async () => {
    if (!canContinue) return
    setUploading(true)
    try {
      await uploadDocuments(readyFiles.map((f) => f.file), token)
      navigate('/onboarding/plan', { state })
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Documents</h1>
        <p className="text-gray-500 text-sm">Upload documents you want to ask questions from.</p>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleBrowse}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors mb-2
          ${isDragging
            ? 'border-[#1a5c6b] bg-teal-50/20'
            : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
          }`}
      >
        <CloudUploadIcon />
        <p className="mt-4 text-sm text-gray-600">
          Drag &amp; drop files or{' '}
          <span className="font-semibold underline text-gray-800">Browse</span>
        </p>
        <p className="mt-1.5 text-xs text-gray-400">Supported formats: PDF, DOCX, TXT, DOC</p>
      </div>

      {/* Info Row */}
      <p className="text-xs text-gray-400 mb-5 text-center">
        &#9432; Max file size: 15MB per file &middot; Up to 10 documents on free plan
      </p>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.doc"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            {uploading
              ? `Uploading – ${totalFiles} files`
              : `${readyFiles.length}/${totalFiles} ready to upload`
            }
          </p>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`border rounded-xl px-4 py-2.5 flex items-center gap-3 transition-colors
                  ${file.status === 'ready' ? 'border-gray-300 bg-white' : ''}
                  ${file.status === 'error' ? 'border-red-400 bg-red-50/20' : ''}
                `}
              >
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <>
                    <p className="text-sm text-gray-800 truncate">{file.name}</p>
                    {file.status === 'error' && (
                      <p className="text-xs text-red-500 mt-0.5">{file.errorMsg}</p>
                    )}
                  </>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                  {file.status === 'error' ? (
                    <XCircleIcon color="#ef4444" />
                  ) : (
                    <XCircleIcon color="#9ca3af" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning */}
      {showWarning && (
        <div className="flex items-center justify-center gap-2 mb-4 text-sm text-orange-600">
          <WarningIcon />
          <span>At least 1 document is required to use SecureRAG</span>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full max-w-xs py-3 rounded-full font-medium text-sm text-white transition-opacity disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #1a5c6b, #0f3d48)' }}
        >
          {uploading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default DocumentUpload
