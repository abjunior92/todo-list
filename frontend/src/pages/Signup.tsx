import { useState } from "react";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Eye } from "../components/icons/Eye";
import { EyeOff } from "../components/icons/EyeOff";
import { Link } from "../components/common/Link";
import { AuthDecorativeSection } from "../components/common/AuthDecorativeSection";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl flex">
        {/* Left Section - Decorative Background */}
        <AuthDecorativeSection />

        {/* Right Section - Sign Up Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-black mb-8">Sign up</h1>

          <form className="space-y-6">
            {/* First Name Input */}
            <Input
              id="firstName"
              name="firstName"
              type="text"
              label="First Name"
              required
              placeholder="First Name"
            />

            {/* Last Name Input */}
            <Input
              id="lastName"
              name="lastName"
              type="text"
              label="Last Name"
              required
              placeholder="Last Name"
            />

            {/* Email Input */}
            <Input
              id="email"
              name="email"
              type="email"
              label="E-mail address"
              required
              placeholder="E-mail address"
            />

            {/* Password Input */}
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              required
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

            {/* Re-enter Password Input */}
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Re-enter the password"
              required
              placeholder="Re-enter the password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {/* Sign Up Button */}
            <Button type="submit" variant="primary">
              Sign Up
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" variant="secondary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
