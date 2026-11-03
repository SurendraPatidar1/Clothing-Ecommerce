import { INDIAN_STATES } from '@/utils/shippingAddress';

const FIELDS = [
  { name: 'fullName', label: 'Full Name', autoComplete: 'name', span: 2 },
  { name: 'phone', label: 'Mobile Number', autoComplete: 'tel-national', inputMode: 'numeric', maxLength: 10, span: 1 },
  { name: 'pincode', label: 'Pincode', autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6, span: 1 },
  { name: 'addressLine1', label: 'Address Line 1', autoComplete: 'address-line1', placeholder: 'House no., building, street', span: 2 },
  { name: 'addressLine2', label: 'Address Line 2 (Optional)', autoComplete: 'address-line2', placeholder: 'Area, landmark', span: 2 },
  { name: 'city', label: 'City', autoComplete: 'address-level2', span: 1 },
];

const DIGITS_ONLY = new Set(['phone', 'pincode']);

export default function ShippingAddressForm({ values, errors, onChange, disabled }) {
  const handle = (e) => {
    const { name, value } = e.target;
    onChange(name, DIGITS_ONLY.has(name) ? value.replace(/\D/g, '') : value);
  };

  const fieldCls = (name) => `input ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`;

  return (
    <fieldset disabled={disabled} className="grid gap-5 sm:grid-cols-2">
      <legend className="sr-only">Shipping address</legend>
      {FIELDS.map((f) => (
        <div key={f.name} className={f.span === 2 ? 'sm:col-span-2' : ''}>
          <label htmlFor={f.name} className="label">{f.label}</label>
          <input
            id={f.name}
            name={f.name}
            value={values[f.name]}
            onChange={handle}
            autoComplete={f.autoComplete}
            inputMode={f.inputMode}
            maxLength={f.maxLength}
            placeholder={f.placeholder}
            className={fieldCls(f.name)}
            aria-invalid={Boolean(errors[f.name])}
            aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
          />
          {errors[f.name] && (
            <p id={`${f.name}-error`} className="mt-1 text-xs text-red-600">{errors[f.name]}</p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="state" className="label">State</label>
        <select
          id="state"
          name="state"
          value={values.state}
          onChange={handle}
          autoComplete="address-level1"
          className={fieldCls('state')}
          aria-invalid={Boolean(errors.state)}
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
      </div>
    </fieldset>
  );
}
