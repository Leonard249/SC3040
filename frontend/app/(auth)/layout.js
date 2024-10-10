"use client";

const AuthLayout = ({ children }) => {

  return (
      <div className="h-full flex items-center justify-center bg-bananaYellow">
          <div className="md:h-auto md:w-[420px]">
              {children}
          </div>
    </div>
  )
}

export default AuthLayout