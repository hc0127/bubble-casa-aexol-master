<template>
  <BasePopup class="confirm-email">
    <h1 class="confirm-email__title popup-title">Please confirm your email:</h1>
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
    <p v-if="confirmation_error" style="color: red; margin-bottom: 10px">
      check the login details or contact the administrator
    </p>
    <BaseButton @click="handleConfirm"> Confirm </BaseButton>
  </BasePopup>
</template>

<script>
import BaseButton from "../components/common/BaseButton.vue";
import BaseInput from "../components/common/BaseInput.vue";
import BasePopup from "../components/common/BasePopup.vue";
import { useRouter, useRoute } from "vue-router";
import { ref } from "@vue/reactivity";
import { callApi } from "../api/callApi";
import useValidator from "../validator/validator";
import IconEnvelope from "../components/icons/IconEnvelope.vue";
import IconKey from "../components/icons/IconKey.vue";

export default {
  name: "EmailConfirmation",
  components: {
    BaseButton,
    BaseInput,
    BasePopup,
    IconEnvelope,
    IconKey,
  },
  setup() {
    const body = ref({
      email: "",
      password: null,
    });

    const confirmation_error = ref(false);

    const router = useRouter();
    const route = useRoute();

    const { validateNow, validate, error, is_error } = useValidator(
      body,
      "auth",
      "login"
    );

    const handleConfirm = async () => {
      const token = route.query.token;
      if (validateNow()) {
        callApi("auth", "confirmAccount", {
          email: body.value.email,
          password: body.value.password,
          token: token,
        }).then((response) => {
          if (!response.success) {
            confirmation_error.value = true;
          } else {
            confirmation_error.value = false;
            router.push("/").then(() => window.location.reload());
          }
        });
      }
    };

    return {
      body,
      handleConfirm,
      error,
      validate,
      confirmation_error,
    };
  },
};
</script>
