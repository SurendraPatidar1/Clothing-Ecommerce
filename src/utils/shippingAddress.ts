import type { ShippingAddress, ShippingAddressForm } from '@/types';

export type ShippingErrors = Partial<Record<keyof ShippingAddressForm, string>>;

export const EMPTY_SHIPPING_FORM: ShippingAddressForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
};

const MOBILE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^[1-9]\d{5}$/;
const NAME_RE = /^[A-Za-z][A-Za-z .'-]*$/;

// Mirrors backend constraints in ShippingAddressDto.
export function validateShippingAddress(form: ShippingAddressForm): ShippingErrors {
  const errors: ShippingErrors = {};
  const fullName = form.fullName.trim();
  const line1 = form.addressLine1.trim();
  const line2 = form.addressLine2.trim();

  if (!fullName) errors.fullName = 'Full name is required';
  else if (fullName.length < 2 || fullName.length > 100) errors.fullName = 'Must be 2-100 characters';
  else if (!NAME_RE.test(fullName)) errors.fullName = 'Only letters, spaces and . \' - are allowed';

  if (!form.phone.trim()) errors.phone = 'Mobile number is required';
  else if (!MOBILE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit Indian mobile number';

  if (!line1) errors.addressLine1 = 'Address line 1 is required';
  else if (line1.length < 5) errors.addressLine1 = 'Please enter a complete address';

  if (line1.length + line2.length + 2 > 500) errors.addressLine2 = 'Address is too long (max 500 characters)';

  if (!form.city.trim()) errors.city = 'City is required';
  else if (form.city.trim().length > 80) errors.city = 'Max 80 characters';

  if (!form.state.trim()) errors.state = 'State is required';

  if (!form.pincode.trim()) errors.pincode = 'Pincode is required';
  else if (!PINCODE_RE.test(form.pincode.trim())) errors.pincode = 'Enter a valid 6-digit pincode';

  return errors;
}

export function toShippingAddress(form: ShippingAddressForm): ShippingAddress {
  const line2 = form.addressLine2.trim();
  return {
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    addressLine: line2 ? `${form.addressLine1.trim()}, ${line2}` : form.addressLine1.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.trim(),
  };
}

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];
