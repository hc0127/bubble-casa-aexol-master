<template>
  <BasePopup class="forget-password">
    <h1 class="forget-password__title popup-title">Change password</h1>
    <BaseInput
        v-model="body.password"
        :error="error.password"
        label="Old password"
        placeholder="6+ strong characters"
        type="password"
        @blur="validate('password')"
    >
      <IconKey/>
    </BaseInput>
    <BaseInput
        v-model="body.password_new"
        :error="error.password_new"
        label="New password"
        placeholder="6+ strong characters"
        type="password"
        @blur="validate('password_new')"
    >
      <IconKey/>
    </BaseInput>
    <BaseInput
        v-model="body.password_confirm"
        :error="error.password_confirm"
        label="Confirm new password"
        placeholder="6+ strong characters"
        type="password"
        @blur="validate('password_confirm')"
    >
      <IconKey/>
    </BaseInput>
    <BaseButton :disabled="is_error" @click="handleChangePassword">
      Change password
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
import useValidator from '../../validator/validator.js';
import { useFetch } from '../../hooks/useFetch';
import { notify } from '@kyvg/vue3-notification';

export default {
  name: 'change-password',
  components: {
    BaseButton,
    IconEnvelope,
    BaseInput,
    BasePopup
  },
  setup() {
    const body = ref({
      password: null,
      password_new: null,
      password_confirm: null,
    });

    const {
      validateNow,
      validate,
      error,
      is_error
    } = useValidator(body, 'user', 'password');

    const { loading, fetchData } = useFetch();

    const handleChangePassword = async () => {
      if (validateNow()) {
        const res = await fetchData(() => callApi('user', 'password', body.value));
        if (res.success) {
          notify({
            title: 'Password has been changed successfully.',
            type: 'success'
          })
          triggerPopup('PasswordChanged');
        }
      }
    };

    const triggerPopup = (name) => {
      store.triggerPopup(name);
    };

    return {
      body,
      triggerPopup,
      handleChangePassword,
      validateNow,
      validate,
      error,
      is_error
    };
  }
};
</script>
