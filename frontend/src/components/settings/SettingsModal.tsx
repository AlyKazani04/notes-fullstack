import { useState } from "react";
import { X, Check, Loader2, LogOut } from "lucide-react";
import { auth as authApi } from "../../api";
import type { Toast } from "../../hooks/useToasts";
import type { User } from "../../types";
import type { FormEvent } from "react";

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onLoggedOut: () => void | Promise<void>;
  pushToast: (message: string, type?: Toast["type"]) => void;
}

export function SettingsModal({ user, onClose, onLoggedOut, pushToast }: SettingsModalProps) {
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const dirty =
    name !== user.username || email !== user.email || newPassword.length > 0;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await authApi.updateProfile({
        name: name !== user.username ? name : undefined,
        email: email !== user.email ? email : undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setSaved(true);
      pushToast("Profile updated", "success");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Account settings</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-body" onSubmit={submit}>
          <div className="modal-section-label">Identity</div>
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <div className="modal-section-label">Security</div>
          <label className="field">
            <span>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required to change email or password"
            />
          </label>
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </label>

          {error && <div className="field-error modal-error">{error}</div>}
          {saved && (
            <div className="save-banner">
              <Check size={14} /> Changes saved
            </div>
          )}

          <button
            className="btn btn-primary btn-block"
            disabled={!dirty || busy}
          >
            {busy ? <Loader2 className="spin" size={16} /> : "Save changes"}
          </button>
        </form>

        <div className="modal-footer">
          <button className="btn btn-danger btn-block" onClick={onLoggedOut}>
            <LogOut size={15} /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}