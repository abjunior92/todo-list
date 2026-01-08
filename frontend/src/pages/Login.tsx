import { useState } from "react";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Eye } from "../components/icons/Eye";
import { EyeOff } from "../components/icons/EyeOff";
import { Link } from "../components/common/Link";

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
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              defaultValue="mail.exemple@mail.com"
              placeholder="Email"
            />

            {/* Password Input */}
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              required
              defaultValue="**************"
              placeholder="Password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {/* Sign In Button */}
            <Button type="submit" variant="primary">
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="#" variant="secondary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
