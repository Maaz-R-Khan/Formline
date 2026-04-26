import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebase'
import './Login.css'

const googleProvider = new GoogleAuthProvider()

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signin')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitLabel, setSubmitLabel] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.body.classList.add('login-page')
    return () => document.body.classList.remove('login-page')
  }, [])

  const isSignup = tab === 'signup'
  const baseSubmitText = isSignup ? 'Create your account' : 'Step into the gym'
  const buttonText = submitLabel ?? baseSubmitText

  const handleError = (err) => {
    setSubmitLabel(null)
    const map = {
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-not-found': 'No account found with that email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-credential': 'Email or password is incorrect.',
    }
    setError(map[err.code] ?? 'Something went wrong. Please try again.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError(null)
    setSubmitLabel('Warming up…')
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      console.error('Auth error:', err.code, err.message)
      handleError(err)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/dashboard')
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <div className="formline-login">
      <main className="page">
        <aside className="visual">
          <div className="visual-inner">
            <div className="v-top">
              <Link to="/" className="brand">
                <span className="brand-mark"></span>
                FORMLINE<small>AI Personal Trainer.</small>
              </Link>
              <Link to="/" className="v-back">← Back to site</Link>
            </div>

            <div className="v-mid">
              <div className="v-eyebrow">I &nbsp;/&nbsp; SESSION 001</div>
              <h2 className="v-headline">Your <em>coach</em> is<br />warming up.</h2>
              <p className="v-sub">Pick up where you left off. Yesterday's session, today's mobility, tomorrow's plan — all waiting on the other side.</p>
            </div>

            <div className="v-foot">
              <span>FORM · TRACK · ADAPT</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </aside>

        <section className="form-panel">
          <div className="form-top">
            <a href="#" onClick={(e) => { e.preventDefault(); setTab('signup'); setError(null) }}>
              <span>New to Formline?&nbsp;</span><strong>Create account →</strong>
            </a>
          </div>

          <div className="form-inner">
            <div className="form-eyebrow">II &nbsp;/&nbsp; {isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}</div>
            <h1>
              {isSignup ? <>Begin your <em>journey.</em></> : <>Welcome <em>back.</em></>}
            </h1>
            <p className="lede">
              {isSignup
                ? 'Two minutes to set up. The plan adapts from your very first session.'
                : 'Step in. Your program adapts the second you log a set.'}
            </p>

            <div className="tabs" role="tablist">
              <button
                type="button"
                className={`tab ${!isSignup ? 'active' : ''}`}
                onClick={() => { setTab('signin'); setError(null) }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`tab ${isSignup ? 'active' : ''}`}
                onClick={() => { setTab('signup'); setError(null) }}
              >
                Create account
              </button>
            </div>

            <div className="socials">
              <button className="social" type="button" onClick={handleGoogle}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21.6 12.23c0-.7-.06-1.36-.18-2H12v3.78h5.4a4.6 4.6 0 0 1-2 3v2.5h3.23c1.9-1.74 2.97-4.32 2.97-7.28Z" fill="#4285F4"/>
                  <path d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.22-2.5c-.9.6-2.04.96-3.4.96-2.6 0-4.82-1.76-5.6-4.13H3.07v2.6A10 10 0 0 0 12 22Z" fill="#34A853"/>
                  <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.07a10 10 0 0 0 0 9l3.33-2.6Z" fill="#FBBC05"/>
                  <path d="M12 5.86c1.47 0 2.78.5 3.82 1.5l2.86-2.85A10 10 0 0 0 3.07 7.5L6.4 10.1c.78-2.37 3-4.24 5.6-4.24Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="divider">or with email</div>

            {error && (
              <p style={{ color: '#b94040', fontSize: 13, marginBottom: 12, fontFamily: 'var(--mono, monospace)', letterSpacing: '0.02em' }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="pw-wrap">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPw((s) => !s)}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="row">
                <label className="check">
                  <input type="checkbox" /> Keep me signed in
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button className="submit" type="submit">
                {buttonText}
                <span className="arr">→</span>
              </button>

              <p className="legal">
                By continuing you agree to Formline's <a href="#">Terms</a> and <a href="#">Privacy Policy</a>. We never sell your training data.
              </p>
            </form>
          </div>

          <div className="form-foot">
            <span>NEED HELP? <a href="#" style={{ color: 'var(--ink)' }}>SUPPORT</a></span>
            <span>v 1.4.0</span>
          </div>
        </section>
      </main>
    </div>
  )
}
