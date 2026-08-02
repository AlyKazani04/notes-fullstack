import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import type { Toast } from "../../hooks/useToasts";

interface AuthShellProps {
  onLogin: (email: string, password: string) => Promise<unknown>;
  onRegister: (name: string, email: string, password: string) => Promise<unknown>;
  pushToast: (message: string, type?: Toast["type"]) => void;
}

export function AuthShell({ onLogin, onRegister, pushToast }: AuthShellProps) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [prefillEmail, setPrefillEmail] = useState("");

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="hero-mark">Notes App</div>
        <div className="hero-cards" aria-hidden="true">
          <div className="hero-tab" />
          <div className="hero-card hc-3" />
          <div className="hero-card hc-2" />
          <div className="hero-card hc-1">
            <div className="hc-line l1" />
            <div className="hc-line l2" />
            <div className="hc-line l3" />
          </div>
        </div>
        <p className="hero-tag">Where your notes get properly filed.</p>
        <p className="hero-sub">
          Folders, index cards, and a page for everything in between.
        </p>
      </div>

      <div className="auth-panel">
        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Log in
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            New account
          </button>
          <div className={`auth-tab-underline ${mode}`} />
        </div>

        {mode === "login" ? (
          <LoginForm
            onLogin={onLogin}
            pushToast={pushToast}
            prefillEmail={prefillEmail}
          />
        ) : (
          <RegisterForm
            onRegister={onRegister}
            pushToast={pushToast}
            onRegistered={(email: string) => {
              setPrefillEmail(email);
              setMode("login");
            }}
          />
        )}
      </div>
    </div>
  );
}