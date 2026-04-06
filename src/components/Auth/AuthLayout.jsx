const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">

      {/* Left Panel — top banner on mobile/tablet, side panel on desktop */}
      <div className="w-full h-48 sm:h-56 md:h-64 lg:h-full lg:w-[45%] lg:flex-shrink-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3X6lM9VLKQpQuR0guF1en6D3Wrb9sTkFRw&s"
          alt="Secure AI Knowledge Base"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-white lg:overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-10 md:px-16 lg:px-10 py-8 lg:py-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
        <p className="text-center text-gray-400 text-xs py-4">
          © 2026 SecureKnowledge. All Rights Reserved.
        </p>
      </div>

    </div>
  )
}

export default AuthLayout
