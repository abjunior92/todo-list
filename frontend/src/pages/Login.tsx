import { useState } from "react";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Eye } from "../components/icons/Eye";
import { EyeOff } from "../components/icons/EyeOff";
import { Link } from "../components/common/Link";
import { AuthDecorativeSection } from "../components/common/AuthDecorativeSection";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../lib/api";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl flex">
        {/* Left Section - Decorative Background */}
        <AuthDecorativeSection />

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-black mb-8">Sign in</h1>

          <form
            className="space-y-6"
            onSubmit={async e => {
              e.preventDefault();
              setError(null);
              setIsLoading(true);

              const formData = new FormData(e.currentTarget);
              const data: LoginFormData = {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
              };

              try {
                await login(data);
              } catch (err) {
                const apiError = err as ApiError;
                setError(
                  apiError.message ||
                    "Si è verificato un errore durante il login"
                );
                setIsLoading(false);
              }
            }}
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Email Input */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              placeholder="Email"
              disabled={isLoading}
            />

            {/* Password Input */}
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              required
              placeholder="Password"
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {/* Sign In Button */}
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Accesso in corso..." : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" variant="secondary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
