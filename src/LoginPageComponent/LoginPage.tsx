import { useState } from "react";
import { loginApi } from "./api/authApi";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

const BischenLogo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-white opacity-80" />
    </div>
    <span className="text-lg font-semibold text-gray-900 tracking-tight">Bischen</span>
  </div>
);

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

// inside your component:
const navigate = useNavigate();

  const handleLogin = async (e:any) => {
    e.preventDefault();
     setError('');
     try {
      const response = await loginApi({ email, password });
      console.log('Token:', response.token);
      // save token, redirect, etc.
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } 
    // console.log({ email, password, remember });
  };

  function createNavigate(): void {
      navigate("/create-account")
  }

  const handleGoogleSuccess = async (credentialResponse:any) => {
  try {
    const idToken = credentialResponse.credential

    // Send to Spring Boot
    const response = await axios.post(
      'http://localhost:8080/api/auth/google',
      { idToken: idToken }
    )

    // Save token and user info
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify({
      email:   response.data.email
    }))

    // Go to dashboard
    //navigate('/dashboard')

  } catch (err) {
    setError('Google login failed. Please try again.')
    console.error(err)
  }
}

const handleGoogleError = () => {
  setError('Google sign-in was cancelled.')
}

  return (
    <div className="min-h-screen bg-[#eef8ee] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[600px]">

        {/* ── LEFT PANEL ── */}
        <div className="flex flex-col w-full md:w-1/2 px-10 py-10">
          {/* Logo */}
          <BischenLogo />

          {/* Form area */}
          <div className="flex-1 flex flex-col justify-center mt-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Login</h1>
            <p className="text-sm text-gray-400 mb-8">
              Measure the performance of cryptos, get big profits!
            </p>


            {/* Google Login Button */}
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '12px',
              overflow: 'hidden',
              background:'transparent'
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
              <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>
                {error}
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6 padngtop-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 whitespace-nowrap">or Sign In with Email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="mail@website.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                onClick={() => navigate('/forgot-password')}
              >
                Forget password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-green-200 text-white font-semibold py-3 rounded-xl transition-colors duration-150 shadow-md shadow-purple-200 mb-6"
            >
              Login
            </button>

            {/* Register link */}
            <p className="text-sm text-gray-500 text-center">
              Not registered yet?{" "}
              <button
                type="button"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                onClick={createNavigate}
              >
                Create an Account
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-10">© 2022 Bischen All rights reserved.</p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 to-teal-600 flex-col items-center justify-center px-12 py-16 text-center relative overflow-hidden">
          {/* Subtle decorative blobs */}
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <h2 className="text-white text-4xl font-extrabold leading-tight mb-5 relative z-10">
            Welcome to our<br />community
          </h2>

          <p className="text-white/80 text-sm leading-relaxed max-w-xs mb-12 relative z-10">
            Personalized, updated daily, and beautifully presented.
            Sign in to find your dream ways of earning and gain full access to platform functions.
          </p>

          <p className="text-white font-bold text-2xl mb-2 relative z-10">
            Make your dreams<br />come true.
          </p>
          <p className="text-white/80 text-sm mb-10 relative z-10">
            Quality experience on all devices
          </p>


        </div>

      </div>
    </div>
  );
}


