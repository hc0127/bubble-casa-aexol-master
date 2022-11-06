<template>
  <BasePopup class="not-allowed-popup">
    <div class="not-allowed-popup__text popup-text">
      <p>You cannot add posts in this category, please find appropriate subcategory.</p>
    </div>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';

export default {
  name: 'not-allowed-to-add',
  components: {
    BasePopup
  },
};
</script>
