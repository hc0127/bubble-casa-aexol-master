<template>
  <BasePopup class="forget-password">
    <h1 class="forget-password__title popup-title">Forgot password</h1>
    <div class="forget-password__text">
      <p>We will send a password recover</p>
      <p>instructions to your e-mail</p></div>
    <BaseInput
        v-model="body.email"
        label="E-mail"
        placeholder="example@email.com"
        type="email"
        :error="error.email"
        @blur="() => validate('email')"
    >
      <IconEnvelope/>
    </BaseInput>
    <BaseButton :loading="loading" :disabled="is_error" @click="handleRecover">
      Send mail
    </BaseButton>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';
import BaseInput from '../common/BaseInput.vue';
import IconEnvelope from '../icons/IconEnvelope.vue';
import BaseButton from '../common/BaseButton.vue';
import store from '../../store';
import { callApi } from '../../api/callApi.js';
import { ref } from '@vue/reactivity';
import useValidator from '../../validator/validator';
import { useFetch } from '../../hooks/useFetch';

export default {
  name: 'forget-password',
  components: {
    BaseButton,
    IconEnvelope,
    BaseInput,
    BasePopup,
  },
  setup() {
    const body = ref({
      email: null,
    });

    const {
      validateNow,
      validate,
      error,
      is_error,
    } = useValidator(body, 'auth', 'recover');
    const { loading, fetchData } = useFetch();

    const handleRecover = async () => {
      if (validateNow().value) return;
        const res = await fetchData(() => callApi('auth', 'recover', body.value));
        if (res.success) {
          triggerPopup('EmailSent');
          localStorage.setItem('email', body.value.email)
        }
    };

    const triggerPopup = (name) => {
      store.triggerPopup(name);
    };

    return {
      body,
      triggerPopup,
      handleRecover,
      validateNow,
      validate,
      error,
      is_error,
      loading
    };
  }
};
</script>
