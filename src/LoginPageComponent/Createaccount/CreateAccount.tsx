import { useState, useEffect } from "react";
import { registerApi } from "../api/authApi";

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// const GoogleIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 48 48">
//     <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
//     <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
//     <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
//     <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
//   </svg>
// );

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#eee", "#e53935", "#fb8c00", "#fdd835", "#1db954"];
  return { score, label: labels[score], color: colors[score], width: score * 25 };
}

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  hintType?: "bad" | "good" | "";
  optional?: boolean;
}

function InputField({ label, id, type = "text", placeholder, value, onChange, hint, hintType, optional }: InputFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
      <label htmlFor={id} style={{ fontSize: 12, color: "#555", marginBottom: 4, fontWeight: 600, letterSpacing: "0.02em" }}>
        {label}
        {optional && <span style={{ color: "#aaa", fontWeight: 400, marginLeft: 4 }}>(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          padding: "9px 12px",
          border: `1px solid ${hintType === "bad" ? "#e53935" : "#ddd"}`,
          borderRadius: 8,
          fontSize: 13,
          color: "#222",
          outline: "none",
          fontFamily: "inherit",
          background: "#fff",
          transition: "border 0.15s",
          width: "100%",
        }}
        onFocus={e => { if (hintType !== "bad") e.target.style.borderColor = "#1db954"; }}
        onBlur={e => { if (hintType !== "bad") e.target.style.borderColor = "#ddd"; }}
      />
      {hint && (
        <span style={{ fontSize: 11, marginTop: 3, color: hintType === "bad" ? "#e53935" : hintType === "good" ? "#1db954" : "#aaa" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  hintType?: "bad" | "good" | "";
  showStrength?: boolean;
}

function PasswordField({ label, id, placeholder, value, onChange, hint, hintType, showStrength }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getStrength(value) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
      <label htmlFor={id} style={{ fontSize: 12, color: "#555", marginBottom: 4, fontWeight: 600, letterSpacing: "0.02em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            padding: "9px 36px 9px 12px",
            border: `1px solid ${hintType === "bad" ? "#e53935" : "#ddd"}`,
            borderRadius: 8,
            fontSize: 13,
            color: "#222",
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            width: "100%",
            transition: "border 0.15s",
          }}
          onFocus={e => { if (hintType !== "bad") e.target.style.borderColor = "#1db954"; }}
          onBlur={e => { if (hintType !== "bad") e.target.style.borderColor = "#ddd"; }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: show ? "#1db954" : "#999",
            display: "flex", alignItems: "center", padding: 0,
          }}
        >
          <EyeIcon open={show} />
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div style={{ height: 3, borderRadius: 2, background: "#eee", overflow: "hidden", marginTop: 5 }}>
          <div style={{ height: "100%", width: `${strength?.width}%`, background: strength?.color, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
        </div>
      )}
      {hint && (
        <span style={{ fontSize: 11, marginTop: 3, color: hintType === "bad" ? "#e53935" : hintType === "good" ? "#1db954" : "#888" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

export default function CreateAccount() {
  const [form, setForm] = useState<{ firstName: string; lastName: string; email: string; phoneNumber: string; password: string; confirm: string }>({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [status, setStatus] = useState<{ msg: string; type: "success" | "error" | "" }>({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const strength = getStrength(form.password);
  const pwMatch = form.confirm.length > 0 && form.password === form.confirm;

  const handleSubmit = async () => {
    const { firstName, lastName, email, password, phoneNumber, confirm } = form;
    if (!firstName.trim() || !lastName.trim()) { setStatus({ msg: "Please enter your full name.", type: "error" }); return; }
    if (!emailValid) { setStatus({ msg: "Enter a valid email address.", type: "error" }); return; }
    if (password.length < 8) { setStatus({ msg: "Password must be at least 8 characters.", type: "error" }); return; }
    if (password !== confirm) { setStatus({ msg: "Passwords don't match.", type: "error" }); return; }
    if (!terms) { setStatus({ msg: "Please accept the Terms of Service.", type: "error" }); return; }
    setStatus({ msg: "", type: "" });
    setLoading(true);
    
     try {
      const response = await registerApi({ firstName, lastName, email, password, phoneNumber });
      console.log('Token:', response.token);
      // save token, redirect, etc.
    } catch (err: any) {
      setStatus({ msg: err.response?.data?.message || 'Registration failed', type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Live crypto performance dashboard",
    "Daily profit & loss reports",
    "Smart alerts & price notifications",
    "Works on all your devices",
    "Free to get started",
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#e8f5e9", display: "flex",
      alignItems: "flex-start", justifyContent: "center", padding: "28px 16px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        display: "flex", width: "100%", maxWidth: 860, background: "#fff",
        borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ flex: 1, padding: "36px 40px 32px", display: "flex", flexDirection: "column" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{ width: 32, height: 32, background: "#1db954", borderRadius: "50%" }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Bischen</span>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 3px" }}>Create Account</h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>Start tracking cryptos and grow your portfolio today!</p>

          {/* Google Sign-Up */}
          {/* <button
            onClick={handleGoogleSignUp}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, padding: "11px 16px", border: "1px solid #dadce0", borderRadius: 8,
              background: "#fff", fontSize: 14, fontWeight: 500, color: "#3c4043",
              cursor: "pointer", marginBottom: 18, fontFamily: "inherit", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <GoogleIcon />
            Sign up with Google
          </button> */}

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e8e8e8" }} />
            <span style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>or create with email</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e8e8e8" }} />
          </div>

          {/* Name Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <InputField label="First Name" id="firstName" placeholder="John" value={form.firstName} onChange={set("firstName")}
              hint={form.firstName.length > 0 && form.firstName.trim().length < 2 ? "Too short" : ""}
              hintType={form.firstName.length > 0 && form.firstName.trim().length < 2 ? "bad" : ""} />
            <InputField label="Last Name" id="lastName" placeholder="Doe" value={form.lastName} onChange={set("lastName")}
              hint={form.lastName.length > 0 && form.lastName.trim().length < 2 ? "Too short" : ""}
              hintType={form.lastName.length > 0 && form.lastName.trim().length < 2 ? "bad" : ""} />
          </div>

          <InputField label="Email Address" id="email" type="email" placeholder="mail@website.com"
            value={form.email} onChange={set("email")}
            hint={form.email.length > 0 ? (emailValid ? "Looks good!" : "Enter a valid email") : ""}
            hintType={form.email.length > 0 ? (emailValid ? "good" : "bad") : ""} />

          <InputField label="Phone Number" id="phoneNumber" type="tel" placeholder="+91 98765 43210"
            value={form.phoneNumber} onChange={set("phoneNumber")} optional />

          {/* Password Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <PasswordField label="Password" id="password" placeholder="Min. 8 characters"
              value={form.password} onChange={set("password")} showStrength
              hint={form.password.length > 0 ? strength.label : ""}
              hintType={strength.score < 2 ? "bad" : strength.score >= 4 ? "good" : ""} />
            <PasswordField label="Confirm Password" id="confirm" placeholder="Re-enter password"
              value={form.confirm} onChange={set("confirm")}
              hint={form.confirm.length > 0 ? (pwMatch ? "Passwords match" : "Passwords don't match") : ""}
              hintType={form.confirm.length > 0 ? (pwMatch ? "good" : "bad") : ""} />
          </div>

          {/* Terms */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, margin: "10px 0 16px", fontSize: 12, color: "#666", cursor: "pointer" }}>
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
              style={{ marginTop: 2, accentColor: "#1db954", flexShrink: 0 }} />
            I agree to the{" "}
            <a href="#" style={{ color: "#1db954", textDecoration: "none", marginLeft: 3 }}>Terms of Service</a>
            {" "}and{" "}
            <a href="#" style={{ color: "#1db954", textDecoration: "none" }}>Privacy Policy</a>
          </label>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: 12, background: loading ? "#a5d6b4" : "#1db954",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 15,
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "background 0.15s", letterSpacing: "0.2px",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#17a347"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#1db954"; }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          {/* Status */}
          {status.msg && (
            <p style={{ marginTop: 10, fontSize: 13, textAlign: "center", color: status.type === "success" ? "#1db954" : "#e53935" }}>
              {status.msg}
            </p>
          )}

          <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#888" }}>
            Already have an account?{" "}
            <a href="#" style={{ color: "#1db954", textDecoration: "none", fontWeight: 600 }}>Sign In</a>
          </p>

          <p style={{ marginTop: "auto", paddingTop: 16, fontSize: 11, color: "#ccc" }}>
            © 2022 Bischen All rights reserved.
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          flex: 1, background: "#1db954", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 40, color: "#fff", textAlign: "center",
        }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
            Join thousands of crypto traders
          </h1>
          <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.7, marginBottom: 28 }}>
            Get personalized insights, real-time tracking, and powerful tools to grow your portfolio.
          </p>
          <ul style={{ listStyle: "none", width: "100%", textAlign: "left", padding: 0 }}>
            {features.map((f, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                padding: "8px 0", borderBottom: i < features.length - 1 ? "1px solid rgba(255,255,255,0.18)" : "none",
                opacity: 0.92,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <CheckIcon />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
