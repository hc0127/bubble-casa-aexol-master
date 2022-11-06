<template>
  <BasePopup class="sign-up-user-popup">
    <div class="sign-up-user">
      <h1 class="sign-up-user--title popup-title">User register</h1>
      <BaseButton disabled color="red" class="sign-up-user__google">
        <IconGoogle/>
        <div>Sign in with Google</div>
      </BaseButton>
      <BaseButton disabled color="blue">
        <IconFacebook/>
        <div>Sign in with Facebook</div>
      </BaseButton>
      <BaseSectionTitle title="Or register"/>
      <BaseInput
          id="email"
          label="E-mail"
          placeholder="example@email.com"
          type="email"
          v-model.email="body.email"
          :error="error.email"
          @blur="validate('email')"
      >
        <IconEnvelope/>
      </BaseInput>
      <BaseInput
          id="password"
          label="Password"
          placeholder="8+ strong characters"
          type="password"
          v-model="body.password"
          :error="error.password"
          @blur="validate('password')"
      >
        <IconKey/>
      </BaseInput>
      <BaseInput
          id="confirm_password"
          label="Password"
          placeholder="8+ strong characters"
          type="password"
          :error="error.password_confirm"
          v-model="body.password_confirm"
          @blur="validate('password_confirm')"
      >
        <IconKey/>
      </BaseInput>
      <BaseInput
          class="sign-up-user__nick"
          label="Nick"
          placeholder="nick"
          v-model="body.name"
          :error="error.name"
          @blur="validate('name')"
      >
        <IconUser/>
      </BaseInput>
      <BaseCheckBox v-model="accept" numeric>
      <span class="sign-up-user__accept">
        I agree with terms and  conditions <span>and privacy policy</span>
      </span>
      </BaseCheckBox>
      <BaseButton
          :loading="loading"
          class="sign-up-user__create_button"
          :disabled="is_error || !accept"
          @click="handleCreateUser"
      >
        Create account
      </BaseButton>
    </div>
  </BasePopup>
</template>
<script>
import { reactive, ref } from 'vue';
import BasePopup from '../common/BasePopup.vue';
import BaseButton from '../common/BaseButton.vue';
import IconGoogle from '../icons/IconGoogle.vue';
import IconFacebook from '../icons/IconFacebook.vue';
import BaseSectionTitle from '../common/BaseSectionTitle.vue';
import BaseInput from '../common/BaseInput.vue';
import IconEnvelope from '../icons/IconEnvelope.vue';
import IconKey from '../icons/IconKey.vue';
import IconUser from '../icons/IconUser.vue';
import BaseCheckBox from '../common/BaseCheckBox.vue';
import useValidator from '../../validator/validator.js';
import { callApi } from '../../api/callApi';
import store from '../../store.js';
import { requestFailError, serverError } from '../../helper/notifications';
import { notify } from '@kyvg/vue3-notification';
import { useFetch } from '../../hooks/useFetch';

export default {
  name: 'SignUpUser',
  components: {
    BaseCheckBox,
    IconUser,
    IconKey,
    IconEnvelope,
    BaseInput,
    BaseSectionTitle,
    IconFacebook,
    IconGoogle,
    BaseButton,
    BasePopup
  },
  setup() {
    const body = ref({
      email: null,
      password: null,
      password_confirm: null,
      name: null,
    });

    const accept = ref(0);

    const {
      validateNow,
      validate,
      error,
      is_error,
    } = useValidator(body, 'auth', 'userRegister');
    const { loading, fetchData } = useFetch();

    const handleCreateUser = async () => {
      if (validateNow()) {
        const res = await fetchData(() => callApi('auth', 'userRegister', body.value));
        if (res.success) {
          notify({
            title: 'Your account has been registered',
            type: 'success'
          })
          store.triggerPopup('SignIn');
        }
      }
    };

    return {
      body,
      validateNow,
      validate,
      error,
      is_error,
      handleCreateUser,
      accept,
      loading
    };
  }
};
</script>
