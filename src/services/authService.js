const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://securerag-backend-new.onrender.com/api/v1'

// 🔹 Generic request handler
const request = async (endpoint, method = 'POST', body, token, isForm = false) => {
  const options = {
    method,
    headers: {},
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

  console.log(`[REQUEST] ${method} ${BASE_URL}${endpoint}`, body || '')

  const res = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await res.json()

  console.log(`[RESPONSE] ${method} ${endpoint} → status: ${res.status}`, data)

  if (!res.ok) {
    console.error(`[ERROR] ${method} ${endpoint} → ${res.status}`, data)
    throw new Error(data.message || 'Request failed')
  }

  return data
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
export const signupUser = ({ name, email, password }) =>
  request('/auth/signup', 'POST', {
    full_name: name,
    email,
    password,
  })

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

// ✅ Organization Info (Protected)
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

// ✅ Workspace
export const saveWorkspace = ({ email, workspaceName }) =>
  request('/auth/workspace', 'POST', {
    email,
    workspace_name: workspaceName,
  })

// ✅ Select Plan
export const selectPlan = ({ email, plan }) =>
  request('/auth/select-plan', 'POST', {
    email,
    plan_name: plan.toLowerCase(),
  })

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