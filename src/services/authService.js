import { logger } from '../utils/logger'




const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api/v1'

logger.info(`🚀 API Endpoint: ${BASE_URL}`)

// 🔹 Generic request handler
const request = async (endpoint, method = 'POST', body, token, isForm = false) => {
  const options = {
    method,
    headers: {},
    timeout: 30000, // 30 second timeout
  }

  // 🔐 Token (for protected routes)
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }

  // 📦 Body handling
  if (body) {
    if (isForm) {
      options.body = body
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    }
  }

  const fullUrl = `${BASE_URL}${endpoint}`
  logger.request(method, endpoint, body || null)

  try {
    const startTime = performance.now()
    const res = await fetch(fullUrl, options)
    const endTime = performance.now()
    const duration = (endTime - startTime).toFixed(2)

    let data

    try {
      data = await res.json()
    } catch (parseError) {
      logger.error('[PARSE ERROR]', parseError, { status: res.status, body: await res.text() })
      throw new Error(`Server returned invalid response (${res.status})`)
    }

    logger.response(method, endpoint, res.status, data)
    logger.info(`⏱️  Request took ${duration}ms`)

    if (!res.ok) {
      const errorMsg = data.detail || data.message || `HTTP ${res.status}`
      logger.error(`API Error ${res.status}`, errorMsg, {
        status: res.status,
        endpoint,
        method,
        response: data
      })
      throw new Error(errorMsg)
    }

    return data
  } catch (err) {
    // Network error (CORS, timeout, server down, etc.)
    if (err instanceof TypeError) {
      logger.error('NETWORK ERROR', err.message, {
        method,
        endpoint: fullUrl,
        hint: 'Backend server may be down or CORS is blocked'
      })
      throw new Error(
        `Network error: Unable to reach ${BASE_URL}. Check if the backend is running.`
      )
    }

    logger.error('FETCH ERROR', err.message, { method, endpoint: fullUrl })
    throw err
  }
}

//////////////////////////////////////////////////////
// 🟢 HEALTH / TEST
//////////////////////////////////////////////////////

export const healthCheck = () =>
  fetch('https://securerag-backend-new.onrender.com/health')
    .then(res => res.json())

export const ping = () =>
  request('/ping', 'GET')

//////////////////////////////////////////////////////
// 🔐 AUTH APIs
//////////////////////////////////////////////////////

// ✅ Signup
export const signupUser = ({ name, email, password }) => {
  console.log('[SIGNUP] Attempting signup with:', { name, email })

  
  return request('/auth/signup', 'POST', {
    full_name: name,
    email,
    password,
  }).catch(err => {
    console.error('[SIGNUP ERROR]', err)
    throw err
  })

}

// ✅ Email Verification OTP
export const verifyEmail = ({ email, otp }) =>
  request('/auth/verify-email', 'POST', {
    email,
    otp_code: otp,
  })

// ✅ Resend OTP
export const resendOTP = (email) =>
  request('/auth/resend-otp', 'POST', { email })

// ✅ Login
export const loginUser = ({ email, password }) =>
  request('/auth/signin', 'POST', { email, password })

// ✅ Refresh Token
export const refreshToken = (email, otp) =>
  request('/auth/refresh', 'POST', {
    email,
    otp_code: otp,
  })

// ✅ Get Profile (Protected)
export const getProfile = (token) =>
  request('/auth/me', 'GET', null, token)

//////////////////////////////////////////////////////
// 🔑 PASSWORD RESET FLOW
//////////////////////////////////////////////////////

// ✅ Forgot Password
export const forgotPassword = (email) =>
  request('/auth/forgot-password', 'POST', { email })

// ✅ Verify Reset OTP
export const verifyResetOTP = ({ email, otp }) =>
  request('/auth/verify-reset-otp', 'POST', {
    email,
    otp_code: otp,
  })

// ✅ Reset Password
export const resetPassword = ({ email, otp, password }) =>
  request('/auth/reset-password', 'POST', {
    email,
    otp_code: otp,
    new_password: password,
    confirm_password: password,
  })

//////////////////////////////////////////////////////
// 🏢 ONBOARDING
//////////////////////////////////////////////////////

// ✅ Organization Info (Protected) - requires onboarding token
export const saveOrganization = ({ category, employeeCount }, token) =>
  request(
    '/auth/organization',
    'POST',
    {
      business_category: category,
      employee_count_range: employeeCount,
    },
    token
  )

// ✅ Workspace (Protected) - requires onboarding token
export const saveWorkspace = ({ workspaceName }, token) =>
  request(
    '/auth/workspace',
    'POST',
    {
      workspace_name: workspaceName,
    },
    token
  )

// ✅ Select Plan (Protected) - requires onboarding token
export const selectPlan = ({ plan }, token) =>
  request(
    '/auth/select-plan',
    'POST',
    {
      plan_name: plan.toLowerCase(),
    },
    token
  )

//////////////////////////////////////////////////////
// 📄 DOCUMENTS
//////////////////////////////////////////////////////

// ✅ Get Sample Documents (Protected)
export const getSampleDocs = (token) =>
  request('/documents/samples', 'GET', null, token)

// ✅ Upload Documents (Protected)
export const uploadDocuments = async (files, token) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  return request('/documents/upload', 'POST', formData, token, true)
}

// ✅ Select Sample Document (Protected)
export const selectSampleDoc = (docId, token) =>
  request(
    '/documents/select-sample',
    'POST',
    {
      sample_document_id: docId,
    },
    token
  )