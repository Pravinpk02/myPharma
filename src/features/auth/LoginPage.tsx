import { useState, useEffect } from "react";
import { loginApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const MyPharmaLogo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
      <span className="text-white font-extrabold text-sm">M</span>
    </div>
    <span className="text-lg font-bold text-gray-900 tracking-tight">MyPharma</span>
  </div>
);

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, loading, navigate]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginApi({ email, password });
      login(response.token, { email });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } 
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      // Send to Spring Boot backend
      const response = await axiosInstance.post(
        '/auth/google',
        { idToken: idToken }
      );

      // Save session via AuthContext
      login(response.data.token, { email: response.data.email });
      navigate('/dashboard');

    } catch (err) {
      setError('Google login failed. Please try again.');
      console.error(err);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex min-h-[600px] border border-slate-100 dark:border-slate-700">

        {/* ── LEFT PANEL ── */}
        <div className="flex flex-col w-full md:w-1/2 px-10 py-10">
          {/* Logo */}
          <MyPharmaLogo />

          {/* Form area */}
          <div className="flex-1 flex flex-col justify-center mt-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Login</h1>
            <p className="text-sm text-gray-400 dark:text-slate-400 mb-8">
              Welcome back. Access your admin tools.
            </p>

            {/* Google Login Button */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'transparent'
            }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="380"
                size="large"
                text="signin_with"
                shape="rectangular"
                theme="outline"
              />
            </div>

            {/* Error message */}
            {error && (
              <p style={{ color: 'red', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
                {error}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6 mt-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
              <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">or Sign In with Email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="mail@website.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-transparent"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-slate-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-transparent"
              />
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600 dark:text-slate-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium transition-colors"
                onClick={() => navigate('/forgot-password')}
              >
                Forget password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition-colors duration-150 shadow-md shadow-emerald-100 dark:shadow-none mb-6"
            >
              Login
            </button>

            {/* Register link */}
            <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
              Not registered yet?{" "}
              <button
                type="button"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold transition-colors"
                onClick={() => navigate("/create-account")}
              >
                Create an Account
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-10">© {new Date().getFullYear()} MyPharma. All rights reserved.</p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-700 flex-col items-center justify-center px-12 py-16 text-center relative overflow-hidden">
          {/* Subtle decorative blobs */}
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <h2 className="text-white text-4xl font-extrabold leading-tight mb-5 relative z-10">
            Welcome to the<br />MyPharma Portal
          </h2>

          <p className="text-white/80 text-sm leading-relaxed max-w-xs mb-12 relative z-10">
            Securely manage pharmaceutical inventories, monitor purchase order workflows, analyze real-time sales telemetry, and manage customer accounts.
          </p>

          <p className="text-white font-bold text-2xl mb-2 relative z-10">
            Operations & Analytics
          </p>
          <p className="text-white/80 text-sm mb-10 relative z-10">
            Optimized for all administrative roles
          </p>
        </div>

      </div>
    </div>
  );
}
