import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import VerifyOTP from '../pages/VerifyOTP'
import ResetPassword from '../pages/ResetPassword'
import Dashboard from '../pages/Dashboard'
import Signup from '../pages/Signup'
import VerifyEmail from '../pages/VerifyEmail'
import Category from '../pages/onboarding/Category'
import Workspace from '../pages/onboarding/Workspace'
import Documents from '../pages/onboarding/Documents'
import Upload from '../pages/onboarding/Upload'
import Plan from '../pages/onboarding/Plan'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboarding/category" element={<Category />} />
      <Route path="/onboarding/workspace" element={<Workspace />} />
      <Route path="/onboarding/documents" element={<Documents />} />
      <Route path="/onboarding/upload" element={<Upload />} />
      <Route path="/onboarding/plan" element={<Plan />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
