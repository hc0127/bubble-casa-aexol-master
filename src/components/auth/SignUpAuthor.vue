<template>
  <BasePopup class="sign-up-author">
    <div class="sign-up-author__column sign-up-author__column--left">
      <h1 class="sign-up-author__title popup-title">Author Register</h1>
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
      <BaseInput
        id="confirm_password"
        label="Confirm password"
        placeholder="6+ strong characters"
        type="password"
        :error="error.password_confirm"
        v-model="body.password_confirm"
        @blur="validate('password_confirm')"
      >
        <IconKey />
      </BaseInput>
      <BaseInput
        id="name"
        label="Your name / Company name"
        placeholder="name"
        v-model="body.name"
        :error="error.name"
        @blur="validate('name')"
      >
        <IconUser />
      </BaseInput>
      <div class="sign-up-author__text-wrapper">
        <p class="sign-up-author__text">
          Our service is addressed to professional writers / specialists /
          corporates
        </p>
        <p class="sign-up-author__text">
          Please provide additional information for verification purposes only
        </p>
      </div>
    </div>
    <div class="sign-up-author__column sign-up-author__column--right">
      <BaseRadioGroup
        v-model="body.is_corporate"
        :radio_config="radio_config"
      />
      <p>{{ error.email }}</p>
      <BaseInput
        id="website_link"
        label="Corporate/Private website/Youtube channel"
        placeholder="https://"
        v-model="body.website_link"
        :error="error.website_link"
        class="sign-up-author__input"
      >
        <IconLink />
      </BaseInput>
      <BaseInput
        id="link_first"
        label="Link to published article with your name"
        placeholder="https://"
        v-model="body.link_first"
        :error="error.link_first"
        class="sign-up-author__input"
      >
        <IconLink />
      </BaseInput>
      <BaseInput
        id="link_second"
        label="Link to published article with your name"
        placeholder="https://"
        v-model="body.link_second"
        :error="error.link_second"
        class="sign-up-author__input"
      >
        <IconLink />
      </BaseInput>
      <BaseInput
        id="link_third"
        label="Link to published article with your name"
        placeholder="https://"
        v-model="body.link_third"
        :error="error.link_third"
        class="sign-up-author__input"
      >
        <IconLink />
      </BaseInput>
      <BaseInput
        label="LinkedIn profile"
        placeholder="https://"
        v-model="body.linkedin"
        :error="error.linkedin"
        class="sign-up-author__input"
      >
        <IconLink />
      </BaseInput>
      <BaseCheckBox numeric v-model="accept">
        <span class="sign-up-user__accept">
          I agree with terms, conditions and <span>privacy policy</span>
        </span>
      </BaseCheckBox>
      <BaseButton
        :loading="loading"
        class="sign-up-user__create_button"
        @click="handleCreateAuthor"
        :disabled="is_error || !accept"
      >
        Create account
      </BaseButton>
    </div>
  </BasePopup>
</template>

<script>
import { ref } from "vue";
import BasePopup from "../common/BasePopup.vue";
import BaseButton from "../common/BaseButton.vue";
import IconGoogle from "../icons/IconGoogle.vue";
import IconFacebook from "../icons/IconFacebook.vue";
import BaseSectionTitle from "../common/BaseSectionTitle.vue";
import BaseInput from "../common/BaseInput.vue";
import IconEnvelope from "../icons/IconEnvelope.vue";
import IconKey from "../icons/IconKey.vue";
import IconUser from "../icons/IconUser.vue";
import IconLink from "../icons/IconLink.vue";
import BaseCheckBox from "../common/BaseCheckBox.vue";
import BaseRadioGroup from "../common/BaseRadioGroup.vue";
import { callApi } from "../../api/callApi.js";
import useValidator from "../../validator/validator.js";
import store from "../../store.js";
import { notify } from "@kyvg/vue3-notification";
import { useFetch } from "../../hooks/useFetch";

export default {
  name: "SignUpAuthor",
  components: {
    BaseRadioGroup,
    BaseCheckBox,
    IconUser,
    IconKey,
    IconEnvelope,
    BaseInput,
    BaseSectionTitle,
    IconFacebook,
    IconGoogle,
    BaseButton,
    BasePopup,
    IconLink,
  },
  setup() {
    const body = ref({
      email: null,
      password: null,
      password_confirm: null,
      name: null,
      website_link: undefined,
      link_first: undefined,
      link_second: undefined,
      link_third: undefined,
      linkedin: undefined,
      is_corporate: 0,
    });
    const accept = ref(false);

    const { validateNow, validate, error, is_error } = useValidator(
      body,
      "auth",
      "authorRegister"
    );
    const { loading, fetchData } = useFetch();

    const radio_config = [
      {
        value: 0,
        label: "Non-Corporate",
      },
      {
        value: 1,
        label: "Corporate",
      },
    ];

    const handleCreateAuthor = async () => {
      if (validateNow()) {
        const res = await fetchData(() =>
          callApi("auth", "authorRegister", body.value)
        );
        if (res.success) {
          notify({
            title: "Your account has been registered",
            type: "success",
          });
          store.triggerPopup("SignIn");
        }
        if (res.error == 1039) {
          error.value.website_link = "Value does not match required format";
          error.value.link_first = "Value does not match required format";
        }
        if (res.error == 1040) {
          error.value.website_link = "Value does not match required format";
        }
      }
    };
    return {
      body,
      radio_config,
      handleCreateAuthor,
      validateNow,
      validate,
      error,
      is_error,
      accept,
      loading,
    };
  },
};
</script>
