const OnboardingLayout = ({ children, showSignIn }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Bar */}
      <header
        className="w-full flex items-center justify-between px-6 sm:px-10"
        style={{
          height: '48px',
          background: 'linear-gradient(90deg, #050f14 0%, #0d3d4a 55%, #0a5566 100%)',
        }}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white font-semibold text-sm tracking-wide">SecureRAG</span>
        </div>

        {/* Optional Sign In button */}
        {showSignIn && (
          <a
            href="/login"
            className="text-white text-sm px-4 py-1.5 rounded-full transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.4)' }}
          >
            Sign in
          </a>
        )}
      </header>

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {children}
      </div>
    </div>
  )
}

export default OnboardingLayout
