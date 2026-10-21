import React, { useState } from 'react';

const USERS_KEY = 'kk_users';
const SESSION_KEY = 'kk_session';

// ---- localStorage helpers --------------------------------------------------
function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ name: user.name, email: user.email, signedInAt: Date.now() })
  );
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

// ---- Brand -----------------------------------------------------------------
function Brand({ dark }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#CF3A0E" />
        <path d="M9 19c0-3.866 3.134-7 7-7s7 3.134 7 7H9z" fill="#FFFFFF" />
        <circle cx="16" cy="10" r="2" fill="#FFFFFF" />
      </svg>
      <span className={`font-heading text-[17px] font-extrabold ${dark ? 'text-text-primary' : 'text-white'}`}>
        Kenneth <span className={`text-[13px] font-normal ${dark ? 'text-primary-base' : 'text-[#FF8A5C]'}`}>Kitchen</span>
      </span>
    </span>
  );
}

// ---- Fallback: solid olive panel (no illustration) ------------------------
function PanelFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-secondary-olive">
      <svg width="72" height="72" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="opacity-40">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" />
        <path d="M9 19c0-3.866 3.134-7 7-7s7 3.134 7 7H9z" fill="#4B5A3F" />
        <circle cx="16" cy="10" r="2" fill="#4B5A3F" />
      </svg>
    </div>
  );
}

// ---- Component -------------------------------------------------------------
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1200&h=1600&q=82&auto=format&fit=crop&crop=entropy';

export default function SignIn({ onDone, imageSrc = DEFAULT_IMAGE }) {
  const [photoOk, setPhotoOk] = useState(true);
  const [mode, setMode] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (isSignup && !cleanName) return setError('Please enter your name.');
    if (!cleanEmail) return setError('Please enter your email.');
    if (!password) return setError('Please enter your password.');
    if (isSignup && password.length < 8) return setError('Password must be at least 8 characters.');

    setSubmitting(true);

    try {
      const users = readUsers();
      const existing = users.find((u) => u.email === cleanEmail);

      if (isSignup) {
        if (existing) {
          setError('An account with this email already exists. Try signing in.');
          return;
        }
        const user = {
          name: cleanName,
          email: cleanEmail,
          password, // NOTE: plaintext. Prototype only.
          createdAt: Date.now(),
        };
        writeUsers([...users, user]);
        saveSession(user);
        onDone?.({ name: user.name, email: user.email });
      } else {
        if (!existing || existing.password !== password) {
          setError('Email or password is incorrect.');
          return;
        }
        saveSession(existing);
        onDone?.({ name: existing.name, email: existing.email });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode() {
    setMode(isSignup ? 'signin' : 'signup');
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-secondary-olive md:grid md:grid-cols-2 md:bg-white">
      {/* Food panel — real photo with a graceful fallback */}
      <div className="flex flex-col md:min-h-dvh">
        <div className="flex h-14 items-center px-4 md:hidden"><Brand /></div>
        <div className="vendor-hero-media relative h-[34dvh] overflow-hidden bg-secondary-olive md:h-auto md:flex-1">
          {photoOk ? (
            <img
              src={imageSrc}
              alt=""
              onError={() => setPhotoOk(false)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 40%' }}
              loading="eager"
              decoding="async"
            />
          ) : (
            <PanelFallback />
          )}
        </div>
      </div>

      <div className="signin-sheet -mt-6 flex flex-1 flex-col rounded-t-2xl bg-white p-6 md:mt-0 md:justify-center md:rounded-none md:px-16">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <div className="hidden md:block"><Brand dark /></div>

          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-[28px] font-extrabold leading-[34px] text-text-primary">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-[15px] leading-6 text-text-secondary">
              {isSignup
                ? 'Save your orders, addresses, and favourite kitchens.'
                : 'Sign in to see your orders and saved addresses.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            {isSignup && (
              <label className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-text-primary">Name</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="h-12 rounded-lg border border-border-visible bg-white px-3 text-[15px] text-text-primary outline-none focus:border-primary-base"
                />
              </label>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-text-primary">Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 rounded-lg border border-border-visible bg-white px-3 text-[15px] text-text-primary outline-none focus:border-primary-base"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-medium text-text-primary">Password</span>
              <input
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                className="h-12 rounded-lg border border-border-visible bg-white px-3 text-[15px] text-text-primary outline-none focus:border-primary-base"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="h-12 rounded-lg bg-primary-base text-[15px] font-semibold text-white disabled:opacity-60"
            >
              {submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={switchMode}
              className="h-10 text-[14px] font-medium text-secondary-olive underline underline-offset-2"
            >
              {isSignup ? 'Already have an account? Sign in' : 'New here? Create an account'}
            </button>

            {error && (
              <p role="alert" className="text-[13px] text-status-error">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}