<template>
  <button
      class="button"
      :disabled="disabled"
      :class="[`button__${color}`, `button__${variant}`]"
  >
    <IconLoader v-if="loading" />
    <slot v-else/>
  </button>
</template>

<script>
import IconLoader from '../icons/IconLoader.vue';
export default {
  name: 'BaseButton',
  components: { IconLoader },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'yellow',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
};
</script>
