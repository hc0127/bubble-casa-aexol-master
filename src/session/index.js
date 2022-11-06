import { computed, ref } from 'vue';
import { callApi } from '../api/callApi';

export const user_session = ref(null);

export const me = async () => {
  const res = await callApi('auth', 'me');
  if (res.session?.user_id) {
    user_session.value = res;
  } else {
    console.log('no user');
  }
};

export const logout = async () => {
  const res = await callApi('auth', 'logout');

  if (res.success) {
    user_session.value = null;
  } else {
    console.log('could not log out');
  }
};

export const login = async (body) => {
  const res = await callApi('auth', 'login', body);
  if (res.success) {
    await me();
  }
  return res;
};

export const is_author = computed(() => (user_session.value && user_session.value.session.role_id === 2))

export const is_logged = computed(() => !!user_session.value)

