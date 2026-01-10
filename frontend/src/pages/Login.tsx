import { useState } from "react";
import { GoogleIcon, FacebookIcon } from "@/components/icons/CustomIcons";
import Logo from "@/components/icons/Logo";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Errors
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const { logInUser } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateInputs()) {
      const formData = new FormData(event.currentTarget);

      const email = (formData.get("email") as string).trim();
      const password = formData.get("password") as string;

      try {
        const result = await logInUser(email, password);

        if (result.success === false) {
          if ((result.error as any).code === "invalid_credentials") {
            setPasswordError(true);
            setPasswordErrorMessage("Invalid email or password");
          } else {
            setError(result.error.message);
          }
          return;
        }

        navigate("/dashboard");
      } catch (err) {
        setError("an error occured");
      } finally {
        setLoading(false);
      }
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_50%_50%,_hsl(210,100%,97%),_hsl(0,0%,100%))] dark:bg-[radial-gradient(at_50%_50%,_hsla(210,100%,16%,0.5),_hsl(220,30%,5%))]">
      {/* Card Container */}
      <div className="w-full max-w-[450px] bg-card text-card-foreground border border-border p-8 rounded-lg shadow-card space-y-6">
        <div className="flex flex-col gap-2">
          <div className="pointer-events-none">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Log in
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                emailError ? "border-error ring-error" : "border-input"
              }`}
            />
            {emailError && (
              <p className="text-xs text-error font-medium">
                {emailErrorMessage}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              aria-label="Password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••"
              autoComplete="current-password"
              required
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                passwordError ? "border-error ring-error" : "border-input"
              }`}
            />
            {passwordError && (
              <p className="text-xs text-error font-medium">
                {passwordErrorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
