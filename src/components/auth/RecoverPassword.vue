<template>
  <BasePopup class="forget-password">
    <h1 class="forget-password__title popup-title">Recover password</h1>
    <BaseInput
        id="password"
        label="Password"
        placeholder="6+ strong characters"
        type="password"
        v-model="body.password"
        :error="error.password"
        :blur="validate('password')"
    >
      <IconKey/>
    </BaseInput>
    <BaseInput
        id="confirm_password"
        label="Confirm password"
        placeholder="6+ strong characters"
        type="password"
        v-model="body.password_confirm"
        :error="error.password_confirm"
        :blur="validate('password_confirm')"
    >
      <IconKey/>
    </BaseInput>
    <BaseButton :loading="loading" :disabled="is_error" @click="handleRecover">
      Set new password
    </BaseButton>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';
import BaseInput from '../common/BaseInput.vue';
import BaseButton from '../common/BaseButton.vue';
import IconKey from '../icons/IconKey.vue';
import { ref } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router'
import useValidator from '../../validator/validator';
import { notify } from '@kyvg/vue3-notification';
import { callApi } from '../../api/callApi';
import store from '../../store';
import { omit } from 'lodash';
import { useFetch } from '../../hooks/useFetch';

export default {
  name: 'RecoverPassword',
  components: {
    BaseButton,
    BaseInput,
    BasePopup,
    IconKey
  },
  setup() {
    const route = useRoute();
    const router = useRouter()
    const email = localStorage.getItem('email')
    const { loading, fetchData } = useFetch();

    if(!email) {
      router.push('/');
      store.triggerPopup('ForgetPassword');
    }

    const body = ref({
      email,
      password: null,
      password_confirm: null,
      token: route.params.token
    });

    const {
      validateNow,
      validate,
      error,
      is_error,
    } = useValidator(body, 'auth', 'password');

    validate('email');
    validate('token');

    const handleRecover = async () => {
      if (validateNow().value) return;
      const res = await fetchData(() => callApi('auth', 'password',
          omit(body.value, 'password_confirm')))
      if(res.success) {
        notify({
          title: 'Your password has been successfully recovered',
          type: 'success'
        })
        localStorage.removeItem('email');
        store.triggerPopup('SignIn');
      }
      localStorage.removeItem('email');
      router.push('/');
    }

    return {
      body,
      error,
      validate,
      is_error,
      handleRecover,
      loading
    }
  }
};
</script>
