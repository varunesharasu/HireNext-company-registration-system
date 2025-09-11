import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import MultiStepForm from '../components/MultiStepForm';
import ImageUploader from '../components/ImageUploader';
import { register as registerUser } from '../api/authApi';
import { registerCompany } from '../api/companyApi';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/authSlice';
import { setProfile } from '../store/companySlice';
import Notification from '../components/Notification';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch = useDispatch();
  const [stepData, setStepData] = useState({});
  const { register, handleSubmit } = useForm();

  const steps = [
    <div key="user-step">
      <h2>User Registration</h2>
      <input {...register('full_name')} placeholder="Full Name" required />
      <input {...register('email')} type="email" placeholder="Email" required />
      <input {...register('password')} type="password" placeholder="Password" required />
      <input {...register('mobile_no')} placeholder="Mobile Number" required />
      <select {...register('gender')} required>
        <option value="">Gender</option>
        <option value="m">Male</option>
        <option value="f">Female</option>
        <option value="o">Other</option>
      </select>
    </div>,
    <div key="company-step">
      <h2>Company Registration</h2>
      <input {...register('company_name')} placeholder="Company Name" required />
      <input {...register('address')} placeholder="Address" required />
      <input {...register('city')} placeholder="City" required />
      <input {...register('state')} placeholder="State" required />
      <input {...register('country')} placeholder="Country" required />
      <input {...register('postal_code')} placeholder="Postal Code" required />
      <input {...register('industry')} placeholder="Industry" required />
      <input {...register('website')} placeholder="Website" />
      <ImageUploader label="Logo" onChange={() => {}} />
      <ImageUploader label="Banner" onChange={() => {}} />
    </div>
  ];

  const onSubmit = handleSubmit(async (data) => {
    try {
      const userRes = await registerUser(data);
      dispatch(setUser(userRes.data.user));
      dispatch(setToken(userRes.data.token));
      toast.success('User registered!');
      const companyRes = await registerCompany(data, userRes.data.token);
      dispatch(setProfile(companyRes.data.profile));
      toast.success('Company registered!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  });

  return (
    <div>
      <MultiStepForm steps={steps} onSubmit={onSubmit} />
      <Notification />
    </div>
  );
};

export default Register;
