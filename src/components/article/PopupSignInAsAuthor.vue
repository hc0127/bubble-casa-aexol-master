<template>
  <BasePopup class="sign-in-as-author">
    <h1 class="sign-in-as-author__title popup-title">Sign in as author</h1>
    <div class="sign-in-as-author__text popup-text">
      <p>You have to sign in as author to add articles</p>
    </div>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';

export default {
  name: 'email-sent',
  components: {
    BasePopup
  },
};
</script>
