import axios from 'axios';
import { ref } from '@vue/reactivity';

// export const url = import.meta.env.VITE_SERVER_URL;
// export const url = import.meta.env.VITE_SERVER_URL || 'https://imtomeklib.aexol.com'
export const url = 'https://api-test.library.one'
export const config = ref({});
export const error = ref({});

export const setConfig = async () => {
  try {
    const res = await axios.get(`${url}/config`);
    if (res?.data) {
      config.value = res?.data;
    } else {
      console.error('Server does not responding')
      return false;
    }
  } catch (e) {
    console.error(e)
  }
};

export const callApi = async (service, action, query = {}) => {

  const configArray = Object.entries(config.value);

  const endpointOption = configArray.find((element) => {
    // eslint-disable-next-line no-unused-vars
    const [k, v] = element;
    return v.service === service && v.action === action;
  });

  if (!endpointOption) {
    return {
      success: false,
      error: 'endpoint does not exist',
    };
  }

  try {
    const result = await axios.post(url, {
      id: endpointOption[0],
      query,
    }, {
      withCredentials: true
    });

    return result.data;
  }
  catch (error) {
    return {
      success: false,
      error: error.response.data.error //add error translations from id
    };
  }
};

export const setErrorList = async () => {
  const res = await callApi('settings', 'getErrors');
  if(res.success) {
    error.value = res.errors;
  }
}