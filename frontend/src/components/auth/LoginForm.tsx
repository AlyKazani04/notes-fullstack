import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { isValidEmail } from "../../utils/helpers";
import { FieldError } from "../auth/FieldError";
import type { Toast } from "../../hooks/useToasts";
import type { FormEvent } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<unknown>;
  pushToast: (message: string, type?: Toast["type"]) => void;
  prefillEmail?: string;
}

type LoginErrors = Partial<Record<"email" | "password", string>>;

export function LoginForm({
  onLogin,
  pushToast,
  prefillEmail = "",
}: LoginFormProps) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (prefillEmail) {
      pushToast("Account created — log in to continue.", "success");
      setEmail(prefillEmail);
    }
  }, [prefillEmail, pushToast]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: LoginErrors = {};
    if (!isValidEmail(email)) errs.email = "Enter a valid email address.";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await onLogin(email, password);
      pushToast("Logged in", "success");
    } catch (err: unknown) {
      pushToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.edu"
          autoComplete="email"
        />
        <FieldError>{errors.email}</FieldError>
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <FieldError>{errors.password}</FieldError>
      </label>
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? <Loader2 className="spin" size={16} /> : "Log in"}
      </button>
      <p className="auth-hint">
        Try any email + an 8-character password — this runs on mock data.
      </p>
    </form>
  );
}