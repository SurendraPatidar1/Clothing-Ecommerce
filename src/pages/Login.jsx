import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api';
import { isValidEmail, safeRedirect } from '@/utils/validators';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return setError('Please enter a valid email.');
    if (!form.password) return setError('Please enter your password.');
    setError('');
    setLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(safeRedirect(location.state?.from), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'));
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to track orders and checkout faster.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className="input" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" className="input" value={form.password} onChange={onChange} required />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
        <p className="text-center text-sm text-gray-500">
          New here?{' '}
          <Link to="/signup" state={location.state} className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
