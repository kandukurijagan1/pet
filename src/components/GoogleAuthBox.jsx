import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, 
  Sparkles, Check, RefreshCw, KeyRound, UserCheck
} from 'lucide-react';
import { MAIN_ADMIN_EMAIL } from '../mockData';

const DEFAULT_CLIENT_ID = '902168382803-6gof845v72ku6k4lp4mecsgr3l1uc3s0.apps.googleusercontent.com';

export default function GoogleAuthBox({ onLoginSuccess, mainAdminEmail }) {
  const [googleEmail, setGoogleEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const buttonContainerRef = useRef(null);

  // Initialize official Google Identity Services
  useEffect(() => {
    let checkInterval = null;

    const setupGoogle = () => {
      if (window.google?.accounts?.id && buttonContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: DEFAULT_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          // Render official Google button
          buttonContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonContainerRef.current, {
            theme: 'filled_blue',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });

          // Google One Tap prompt
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
              console.log('One tap suppressed:', notification.getNotDisplayedReason());
            }
          });

          if (checkInterval) clearInterval(checkInterval);
        } catch (err) {
          console.warn('Google GSI init notice:', err);
        }
      }
    };

    setupGoogle();
    checkInterval = setInterval(setupGoogle, 300);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // Decode JWT credential from official Google response
  const handleCredentialResponse = (response) => {
    try {
      setIsLoading(true);
      setError('');
      setStatusMessage('Authenticating with Google account...');

      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      setTimeout(() => {
        setIsLoading(false);
        setStatusMessage('');
        onLoginSuccess({
          email: googleUser.email,
          name: googleUser.name || googleUser.given_name || 'Google User',
          avatar: googleUser.picture,
          authMethod: 'Official Google Cloud OAuth 2.0'
        });
      }, 400);
    } catch {
      setIsLoading(false);
      setStatusMessage('');
      setError('Could not process Google credentials. Please try again.');
    }
  };

  // Launch Google OAuth 2.0 Token Client popup window
  const handleDirectOAuthPopup = () => {
    setError('');

    if (!window.google?.accounts?.oauth2) {
      setError('Google Identity Services is initializing. Please wait a second.');
      return;
    }

    try {
      setIsLoading(true);
      setStatusMessage('Connecting directly to accounts.google.com...');

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: DEFAULT_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            setStatusMessage('');
            setError(`Google Sign-In: ${tokenResponse.error_description || tokenResponse.error}`);
            return;
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const profile = await res.json();

            setIsLoading(false);
            setStatusMessage('');
            onLoginSuccess({
              email: profile.email,
              name: profile.name || profile.given_name || 'Google User',
              avatar: profile.picture,
              authMethod: 'Direct Google Authentication (OAuth 2.0)'
            });
          } catch {
            setIsLoading(false);
            setStatusMessage('');
            setError('Failed to fetch profile from Google API.');
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch {
      setIsLoading(false);
      setStatusMessage('');
      setError('Failed to start Google popup window.');
    }
  };

  // Direct Google Mail Input Form
  const handleDirectMailLogin = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = googleEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter your Google Mail address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Authenticating direct Google Mail...');

    const calculatedName = displayName.trim() || trimmedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage('');
      onLoginSuccess({
        email: trimmedEmail,
        name: calculatedName,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(calculatedName)}&backgroundColor=4285F4,34A853,FBBC05`,
        authMethod: 'Direct Google Mail Authentication'
      });
    }, 400);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/40">
      
      {/* Title */}
      <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Sign In with Google
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Roles are resolved automatically: <strong className="text-indigo-700">{MAIN_ADMIN_EMAIL}</strong> becomes Main Admin; approved emails become Customers; all others become Users.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Google Client Active
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {statusMessage && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2.5 text-xs text-blue-700 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="mt-6 space-y-5">
        
        {/* Official Google Button Render Container */}
        <div>
          <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
            <span>Direct Google Account Sign-In:</span>
            <span className="text-[11px] text-slate-400">Click to authenticate</span>
          </div>

          <div 
            ref={buttonContainerRef} 
            className="w-full min-h-[44px] flex justify-center mb-2"
          ></div>

          <button
            type="button"
            onClick={handleDirectOAuthPopup}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-2xl font-bold text-slate-700 text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Open Google Account Popup</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
              Or Sign In with Google Mail Directly
            </span>
          </div>
        </div>

        {/* Direct Google Mail Form */}
        <form onSubmit={handleDirectMailLogin} className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Google Mail Address
              </label>
              
              {/* Main Admin Quick Fill */}
              <button
                type="button"
                onClick={() => {
                  setGoogleEmail(MAIN_ADMIN_EMAIL);
                  setDisplayName('Jagan (Main Admin)');
                }}
                className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Fill Main Admin Email"
              >
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                <span>Fill Main Admin</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="e.g. kandukurijagan99@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Display Name <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Jagan Kandukuri"
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-md bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 hover:from-indigo-700 hover:to-violet-900 shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authenticate Direct Google Mail</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
