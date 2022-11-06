<template>
  <BasePopup class="manage-relations">
    <h1 class="manage-relations__title popup-title">Menage relations</h1>
    <BaseInput label="Ad to one more node" placeholder="ID:"/>
    <BaseTextarea label="Related articles" placeholder="ID: 1234, 823423, 2345"/>
    <BaseButton>Upload</BaseButton>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';
import BaseInput from '../common/BaseInput.vue';
import BaseButton from '../common/BaseButton.vue';
import BaseTextarea from '../common/BaseTextarea.vue';

export default {
  name: 'manage-relations',
  components: {
    BaseTextarea,
    BaseButton,
    BaseInput,
    BasePopup
  },
};
</script>
