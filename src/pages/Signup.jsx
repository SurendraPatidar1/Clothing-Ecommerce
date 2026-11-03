import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api';
import { isStrongPassword, isValidEmail, isValidMobile, safeRedirect } from '@/utils/validators';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'phone' ? value.replace(/\D/g, '') : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Please enter your name.');
    if (!isValidEmail(form.email)) return setError('Please enter a valid email.');
    if (form.phone && !isValidMobile(form.phone)) return setError('Please enter a valid 10-digit mobile number.');
    if (!isStrongPassword(form.password)) {
      return setError('Password must be 8-64 characters with at least one letter and one digit.');
    }
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError('');
    setLoading(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone || undefined,
      });
      navigate(safeRedirect(location.state?.from), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create account. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join us for exclusive drops and faster checkout.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <input id="name" name="name" autoComplete="name" className="input" value={form.name} onChange={onChange} required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" className="input" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label htmlFor="phone" className="label">Mobile (Optional)</label>
            <input id="phone" name="phone" inputMode="numeric" maxLength={10} autoComplete="tel-national" className="input" value={form.phone} onChange={onChange} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" className="input" value={form.password} onChange={onChange} required />
          </div>
          <div>
            <label htmlFor="confirm" className="label">Confirm</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" className="input" value={form.confirm} onChange={onChange} required />
          </div>
        </div>
        <p className="text-xs text-gray-500">At least 8 characters, including a letter and a digit.</p>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </Button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-accent hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
