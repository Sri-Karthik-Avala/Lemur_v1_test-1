import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { seoConfigs } from '../utils/seoConfig';

export const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [errors, setErrors] = useState<{
    firstName?: string; 
    lastName?: string;
    email?: string; 
    password?: string;
    organizationName?: string;
  }>({});

  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: {
      firstName?: string; 
      lastName?: string;
      email?: string; 
      password?: string;
      organizationName?: string;
    } = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!organizationName.trim()) newErrors.organizationName = 'Organization name is required';
    if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signup(firstName.trim(), lastName.trim(), email.trim(), password, organizationName.trim());
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <SEO {...seoConfigs.signup} />
      <header className="flex items-center justify-between p-4">
        <Logo size="xl" variant="default" />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="link">
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-4 rounded-md bg-error-50 p-4 text-error-700 dark:bg-error-900 dark:text-error-300">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  label="First name"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={errors.firstName}
                  leftIcon={<User className="h-5 w-5 text-gray-400" />}
                  placeholder="John"
                  required
                />

                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  label="Last name"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={errors.lastName}
                  leftIcon={<User className="h-5 w-5 text-gray-400" />}
                  placeholder="Doe"
                  required
                />
              </div>

              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                placeholder="you@example.com"
                required
              />

              <Input
                id="organizationName"
                name="organizationName"
                type="text"
                label="Organization name"
                autoComplete="organization"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                error={errors.organizationName}
                leftIcon={<Building className="h-5 w-5 text-gray-400" />}
                placeholder="Your Company"
                required
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-lemur-600 focus:ring-lemur-500 dark:border-gray-600 dark:bg-gray-700"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  I agree to the{' '}
                  <a href="#" className="link">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="link">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};