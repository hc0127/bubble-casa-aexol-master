<template>
  <BasePopup>
    <div class="sign-in">
      <h1 class="sign-in--title popup-title">Sign In</h1>
      <BaseInput
        id="email"
        label="E-mail"
        placeholder="example@email.com"
        type="email"
        v-model.email="body.email"
        :error="error.email"
        @blur="validate('email')"
      >
        <IconEnvelope />
      </BaseInput>
      <BaseInput
        id="password"
        label="Password"
        placeholder="6+ strong characters"
        type="password"
        v-model="body.password"
        :error="error.password"
        @blur="validate('password')"
      >
        <IconKey />
      </BaseInput>
      <div class="sign-in__flex-box">
        <button
          class="sign-in__lost-password-button"
          @click="() => triggerPopup('ForgetPassword')"
        >
          Lost password?
        </button>
      </div>
      <BaseButton
        :loading="loading"
        @click="handleSignIn"
        @enter="handleSignIn"
        :disabled="is_error"
      >
        Login
      </BaseButton>
      <BaseSectionTitle title="Or register" />
      <div class="sign-in__footer">
        <BaseButton @click="() => triggerPopup('SignUpAuthor')">
          Register as Author
        </BaseButton>
        <BaseButton @click="() => triggerPopup('SignUpUser')">
          Register as User
        </BaseButton>
      </div>
    </div>
  </BasePopup>
</template>

<script>
import store from "../../store";
import BasePopup from "../common/BasePopup.vue";
import BaseInput from "../common/BaseInput.vue";
import BaseIcon from "../common/BaseIcon.vue";
import IconEnvelope from "../icons/IconEnvelope.vue";
import IconKey from "../icons/IconKey.vue";
import BaseButton from "../common/BaseButton.vue";
import BaseSectionTitle from "../common/BaseSectionTitle.vue";
import BaseCheckBox from "../common/BaseCheckBox.vue";
import { useRouter } from "vue-router";
import { login } from "../../session";
import useValidator from "../../validator/validator";
import { ref } from "@vue/reactivity";
import { useFetch } from "../../hooks/useFetch";

export default {
  name: "sign-in",
  components: {
    BaseCheckBox,
    BaseSectionTitle,
    BaseButton,
    IconKey,
    IconEnvelope,
    BaseIcon,
    BaseInput,
    BasePopup,
  },
  setup() {
    const body = ref({
      email: "",
      password: null,
      accept: false,
    });

    const router = useRouter();

    const { validateNow, validate, error, is_error } = useValidator(
      body,
      "auth",
      "login"
    );
    const { loading, fetchData } = useFetch();

    const handleSignIn = async () => {
      if (validateNow()) {
        const res = await fetchData(() => login(body.value));

        if (res.success) {
          triggerPopup(null);
          router.push("/");
        }
      }
    };

    const triggerPopup = (name) => {
      store.triggerPopup(name);
    };

    return {
      body,
      triggerPopup,
      handleSignIn,
      error,
      is_error,
      validate,
      loading,
    };
  },
};
</script>
