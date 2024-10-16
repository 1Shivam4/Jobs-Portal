import axios from 'axios';
import { showAlert } from './alert';

export const createJob = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/jobs',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'New product has been added');

      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
