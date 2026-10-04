import { useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ArrowUpRight, X } from "lucide-react";
import { auth } from "../firebase";
import "./AuthModal.css";

type Props = { onClose: () => void; onSuccess: () => void };

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const finish = () => { onSuccess(); onClose(); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: name.trim() || "Film Lover" });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      finish();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message.replace("Firebase: ", "") : "Could not sign in. Please try again.");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setError(""); setBusy(true);
    try { await signInWithPopup(auth, new GoogleAuthProvider()); finish(); }
    catch (reason) { setError(reason instanceof Error ? reason.message.replace("Firebase: ", "") : "Google sign-in failed."); }
    finally { setBusy(false); }
  };

  return (
    <div className="cm-auth-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="cm-auth-card" role="dialog" aria-modal="true" aria-labelledby="cm-auth-title">
        <button className="cm-auth-close" onClick={onClose} aria-label="Close"><X size={19} /></button>
        <div className="cm-auth-mark">CM<span>.</span></div>
        <p className="cm-auth-kicker">YOUR PERSONAL CINEMA</p>
        <h2 id="cm-auth-title">{mode === "signup" ? "Make it yours." : "Welcome back."}</h2>
        <p className="cm-auth-sub">Build a film journal, save the stories you love, and curate collections worth revisiting.</p>
        <button className="cm-google-button" onClick={google} disabled={busy}><span className="cm-google-g">G</span> Continue with Google <ArrowUpRight size={15} /></button>
        <div className="cm-auth-or"><span>OR CONTINUE WITH EMAIL</span></div>
        <form onSubmit={submit} className="cm-auth-form">
          {mode === "signup" && <label>Your name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we call you?" maxLength={40} required /></label>}
          <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /></label>
          {error && <p className="cm-auth-error" role="alert">{error}</p>}
          <button className="cm-auth-submit" type="submit" disabled={busy}>{busy ? "PLEASE WAIT…" : mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}<ArrowUpRight size={15} /></button>
        </form>
        <p className="cm-auth-switch">{mode === "signup" ? "Already have an account?" : "New to CineMate?"}<button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}>{mode === "signup" ? "Sign in" : "Create account"}</button></p>
        <p className="cm-auth-legal">By continuing, your account is managed securely by Firebase Authentication.</p>
      </section>
    </div>
  );
}
