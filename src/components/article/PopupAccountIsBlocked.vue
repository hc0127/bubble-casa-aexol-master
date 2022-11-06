<template>
  <BasePopup class="not-allowed-popup">
    <div class="not-allowed-popup__text popup-text">
      <p>Your account is blocked</p>
    </div>
  </BasePopup>
</template>

<script>
import BasePopup from "../common/BasePopup.vue";

export default {
  name: "account-is-blocked",
  components: {
    BasePopup,
  },
};
</script>
