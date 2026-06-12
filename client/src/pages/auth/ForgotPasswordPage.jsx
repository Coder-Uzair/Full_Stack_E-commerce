import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button.jsx';
import { Input } from '@/components/common/Input.jsx';
import { authApi } from '@/api/auth.api.js';
import { parseApiError } from '@/api/axios.js';
import { ROUTES } from '@/utils/constants.js';
import { AuthShell } from './AuthShell.jsx';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setErrorMsg] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    setErrorMsg('');
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (e) {
      setErrorMsg(parseApiError(e).message);
    }
  };

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure link.">
      {sent ? (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          If an account exists for that email, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10">
              {error}
            </p>
          )}
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-ink-500">
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-500">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default ForgotPasswordPage;
