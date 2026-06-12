import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button.jsx';
import { Input } from '@/components/common/Input.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/components/common/Toast.jsx';
import { ROUTES } from '@/utils/constants.js';
import { AuthShell } from './AuthShell.jsx';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const returnTo = new URLSearchParams(location.search).get('returnTo') || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError('');
    const res = await login(values);
    if (res.ok) {
      toast({ message: `Welcome back, ${res.user.firstName}!`, type: 'success' });
      navigate(res.user.role === 'admin' ? ROUTES.ADMIN : returnTo, { replace: true });
    } else {
      if (res.errors) {
        Object.entries(res.errors).forEach(([k, v]) => setError(k, { message: v }));
      }
      setServerError(res.message);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Aurora account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10"
          >
            {serverError}
          </motion.p>
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link to={ROUTES.FORGOT} className="text-sm font-medium text-brand-600 hover:text-brand-500">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 rounded-xl bg-ink-50 p-3 text-center text-xs text-ink-500 dark:bg-ink-900">
        Demo: <strong>demo@aurora.shop</strong> / <strong>Demo@12345</strong>
        <br />
        Admin: <strong>admin@aurora.shop</strong> / <strong>Admin@12345</strong>
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        New here?{' '}
        <Link to={ROUTES.REGISTER} className="font-semibold text-brand-600 hover:text-brand-500">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export default LoginPage;
