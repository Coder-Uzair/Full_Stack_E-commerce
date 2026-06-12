import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const schema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
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

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ confirm, ...values }) => {
    setServerError('');
    const res = await registerUser(values);
    if (res.ok) {
      toast({
        message: 'Account created! Check your email to verify.',
        type: 'success',
      });
      navigate(ROUTES.LOGIN, { replace: true });
    } else {
      if (res.errors) {
        Object.entries(res.errors).forEach(([k, v]) => setError(k, { message: v }));
      }
      setServerError(res.message);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Join Aurora in less than a minute.">
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
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" placeholder="••••••••" error={errors.confirm?.message} {...register('confirm')} />
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-500">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default RegisterPage;
