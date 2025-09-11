import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../api/authApi';
import { setUser, setToken } from '../store/authSlice';
import Notification from '../components/Notification';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await login(data);
      dispatch(setUser(res.data.user));
      dispatch(setToken(res.data.token));
      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  });

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input {...register('email')} type="email" placeholder="Email" required />
        <input {...register('password')} type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <Notification />
    </div>
  );
};

export default Login;
