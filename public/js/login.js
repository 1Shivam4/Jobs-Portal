import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/login',
      data: { email, password }, // Make sure you're sending 'email' instead of 'phone'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'You are logged in');
      window.setTimeout(() => {
        location.assign('/'); // Redirect after a successful login
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const register = async (
  name,
  phone,
  email,
  password,
  confirmPassword
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'api/v1/user/signup',
      data: { name, phone, email, password, confirmPassword },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'You are logged in');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/user/logout',
    });
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
