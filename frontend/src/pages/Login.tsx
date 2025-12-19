import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl flex">
        {/* Left Section - Decorative Background */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-stone-100 to-stone-50 relative overflow-hidden">
          {/* Golden Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(to right, #d4af37 1px, transparent 1px),
                linear-gradient(to bottom, #d4af37 1px, transparent 1px)
              `,
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Decorative Elements */}
          <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
            {/* To Do List Note */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs transform rotate-[-2deg] relative z-10">
              <h3 className="text-black font-semibold text-lg mb-4">
                To do list
              </h3>
              <div className="space-y-2">
                {["MON", "TUE", "WED", "THU", "SAT", "SUN"].map(day => (
                  <div key={day} className="flex items-center">
                    <span className="text-sm text-gray-600 w-12">{day}</span>
                    <div className="flex-1 border-b border-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 text-6xl opacity-30">🌸</div>
            <div className="absolute bottom-16 left-12 text-4xl opacity-30">
              🌵
            </div>
            <div className="absolute bottom-8 right-16 text-3xl opacity-30">
              ☕
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-black mb-8">Sign in</h1>

          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="mail.exemple@mail.com"
                className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 text-sm"
                placeholder="Email"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                defaultValue="**************"
                className="w-full px-4 py-3 pr-12 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.42 13.42l-3.29-3.29M3 3l13.42 13.42"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-400 hover:bg-green-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-black font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
