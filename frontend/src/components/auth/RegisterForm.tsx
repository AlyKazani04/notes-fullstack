import { useState } from "react";
import { Loader2 } from "lucide-react";
import { isValidEmail } from "../../utils/helpers";
import { FieldError } from "../auth/FieldError";
import type { Toast } from "../../hooks/useToasts";
import type { FormEvent } from "react";

interface RegisterFormProps {
  onRegistered: (email: string) => void;
  onRegister: (name: string, email: string, password: string) => Promise<unknown>;
  pushToast: (message: string, type?: Toast["type"]) => void;
}

type RegisterErrors = Partial<Record<"name" | "email" | "password" | "confirm", string>>;

export function RegisterForm({ onRegistered, onRegister, pushToast }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: RegisterErrors = {};
    if (!name.trim()) errs.name = "Tell us what to call you.";
    if (!isValidEmail(email)) errs.email = "Enter a valid email address.";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    if (confirm !== password) errs.confirm = "Passwords don't match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await onRegister(name, email, password);
      onRegistered(email);
      pushToast("Account created", "success");
    } catch (err: unknown) {
      pushToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <label className="field">
        <span>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
          autoComplete="name"
        />
        <FieldError>{errors.name}</FieldError>
      </label>
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <FieldError>{errors.password}</FieldError>
      </label>
      <label className="field">
        <span>Confirm password</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type it again"
          autoComplete="new-password"
        />
        <FieldError>{errors.confirm}</FieldError>
      </label>
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? <Loader2 className="spin" size={16} /> : "Create account"}
      </button>
    </form>
  );
}