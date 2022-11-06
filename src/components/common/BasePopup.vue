<template>
  <div class="popup" @click="closePopup">
    <div class="popup--inner" @click="resetClick">
      <IconClose v-if="closeButton" class="popup--close" @click="closePopup"/>
      <slot/>
    </div>
  </div>
</template>

<script>
import IconClose from '../icons/IconClose.vue';
import store from '../../store';

export default {
  name: 'BasePopup',
  components: { IconClose },
  props: {
    closeButton: {
      type: Boolean,
      default: true
    },
    useProps: {
      type: Boolean,
      default: true
    }
  },
  setup({ useProps }, { emit }) {
    const closePopup = () => {
      if (useProps) {
        emit('close')
      } else {
        store.triggerPopup(null);
      }
    };
    const resetClick = (e) => {
      e.stopPropagation();
    };

    return {
      closePopup,
      resetClick
    };
  }
};
</script>
