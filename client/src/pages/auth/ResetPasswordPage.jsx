import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button.jsx';
import { Input } from '@/components/common/Input.jsx';
import { authApi } from '@/api/auth.api.js';
import { parseApiError } from '@/api/axios.js';
import { useToast } from '@/components/common/Toast.jsx';
import { ROUTES } from '@/utils/constants.js';
import { AuthShell } from './AuthShell.jsx';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[a-z]/, 'Include a lowercase letter')
      .regex(/[A-Z]/, 'Include an uppercase letter')
      .regex(/[0-9]/, 'Include a number'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setErrorMsg] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    setErrorMsg('');
    try {
      await authApi.resetPassword(token, password);
      toast({ message: 'Password updated. Please sign in.', type: 'success' });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (e) {
      setErrorMsg(parseApiError(e).message);
    }
  };

  return (
    <AuthShell title="Choose a new password" subtitle="Make it strong and memorable.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10">
            {error}
          </p>
        )}
        <Input label="New password" type="password" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" error={errors.confirm?.message} {...register('confirm')} />
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
          Update password
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-500">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default ResetPasswordPage;
