<template>
  <BasePopup class="forget-password">
    <div class="icon-email">
      <IconEmail/>
    </div>
    <h1 class="forget-password__title popup-title">Check your mail</h1>
    <div class="forget-password__text">
      <p>We have sent a password recover</p>
      <p>instructions to your e-mail</p></div>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';
import IconEmail from '../icons/IconEmail.vue';

export default {
  name: 'email-sent',
  components: {
    IconEmail,
    BasePopup
  },
};
</script>
