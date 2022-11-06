<template>
  <BasePopup class="forget-password">
    <div class="icon-email">
      <IconEmail/>
    </div>
    <h1 class="forget-password__title popup-title">Password changed</h1>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';
import IconEmail from '../icons/IconEmail.vue';

export default {
  name: 'password-changed',
  components: {
    IconEmail,
    BasePopup
  },
};
</script>
