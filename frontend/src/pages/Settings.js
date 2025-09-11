import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../api/companyApi';
import { setProfile } from '../store/companySlice';
import Notification from '../components/Notification';
import { toast } from 'react-toastify';

const Settings = () => {
  const dispatch = useDispatch();
  const company = useSelector((state) => state.company.profile);
  const token = useSelector((state) => state.auth.token);
  const { register, handleSubmit } = useForm({ defaultValues: company });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfile(data, token);
      dispatch(setProfile(res.data.profile));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  });

  return (
    <div>
      <h2>Edit Company Profile</h2>
      <form onSubmit={onSubmit}>
        <input {...register('company_name')} placeholder="Company Name" required />
        <input {...register('address')} placeholder="Address" required />
        <input {...register('city')} placeholder="City" required />
        <input {...register('state')} placeholder="State" required />
        <input {...register('country')} placeholder="Country" required />
        <input {...register('postal_code')} placeholder="Postal Code" required />
        <input {...register('industry')} placeholder="Industry" required />
        <input {...register('website')} placeholder="Website" />
        <button type="submit">Save</button>
      </form>
      <Notification />
    </div>
  );
};

export default Settings;
