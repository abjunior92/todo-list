import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Eye } from "../components/icons/Eye";
import { EyeOff } from "../components/icons/EyeOff";
import { Link } from "../components/common/Link";
import { AuthDecorativeSection } from "../components/common/AuthDecorativeSection";
import { signup, type ApiError } from "../lib/api";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      // Redirect to login page on success
      navigate("/login");
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitError(
        apiError.message || "Si è verificato un errore durante la registrazione"
      );

      // Map backend errors to form fields
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          const fieldName =
            field === "first_name"
              ? "firstName"
              : field === "last_name"
              ? "lastName"
              : field === "email"
              ? "email"
              : field === "password"
              ? "password"
              : field;

          if (
            fieldName in
            { firstName: true, lastName: true, email: true, password: true }
          ) {
            setError(fieldName as keyof SignupFormData, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl flex">
        {/* Left Section - Decorative Background */}
        <AuthDecorativeSection />

        {/* Right Section - Sign Up Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-black mb-8">Sign up</h1>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name Input */}
            <Input
              id="firstName"
              type="text"
              label="First Name"
              placeholder="First Name"
              error={errors.firstName?.message}
              {...register("firstName", {
                required: "Il nome è obbligatorio",
                minLength: {
                  value: 1,
                  message: "Il nome deve contenere almeno 1 carattere",
                },
              })}
            />

            {/* Last Name Input */}
            <Input
              id="lastName"
              type="text"
              label="Last Name"
              placeholder="Last Name"
              error={errors.lastName?.message}
              {...register("lastName", {
                required: "Il cognome è obbligatorio",
                minLength: {
                  value: 1,
                  message: "Il cognome deve contenere almeno 1 carattere",
                },
              })}
            />

            {/* Email Input */}
            <Input
              id="email"
              type="email"
              label="E-mail address"
              placeholder="E-mail address"
              error={errors.email?.message}
              {...register("email", {
                required: "L'email è obbligatoria",
                pattern: {
                  value: /^[^\s]+@[^\s]+$/,
                  message:
                    "L'email deve contenere il simbolo @ e non può contenere spazi",
                },
              })}
            />

            {/* Password Input */}
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Password"
              error={errors.password?.message}
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
              {...register("password", {
                required: "La password è obbligatoria",
                minLength: {
                  value: 8,
                  message: "La password deve contenere almeno 8 caratteri",
                },
              })}
            />

            {/* Re-enter Password Input */}
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Re-enter the password"
              placeholder="Re-enter the password"
              error={errors.confirmPassword?.message}
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
              {...register("confirmPassword", {
                required: "La conferma password è obbligatoria",
                validate: (value, formValues) => {
                  return (
                    value === formValues.password ||
                    "Le password non corrispondono"
                  );
                },
              })}
            />

            {/* Sign Up Button */}
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Registrazione in corso..." : "Sign Up"}
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
