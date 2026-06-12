import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/api/auth.api.js';
import { parseApiError } from '@/api/axios.js';
import { Button } from '@/components/common/Button.jsx';
import { ROUTES } from '@/utils/constants.js';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }
    authApi
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((e) => {
        setStatus('error');
        setMessage(parseApiError(e).message);
      });
  }, [token]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      {status === 'loading' && (
        <>
          <Loader2 size={40} className="animate-spin text-brand-500" />
          <p className="mt-4 text-ink-500">Verifying your email…</p>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle2 size={48} className="text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold">Email verified</h1>
          <p className="mt-2 text-ink-500">Your account is now active.</p>
          <Link to={ROUTES.LOGIN} className="mt-6">
            <Button variant="primary">Sign in</Button>
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle size={48} className="text-red-500" />
          <h1 className="mt-4 text-2xl font-bold">Verification failed</h1>
          <p className="mt-2 text-ink-500">{message}</p>
          <Link to={ROUTES.HOME} className="mt-6">
            <Button variant="outline">Back to home</Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default VerifyEmailPage;
