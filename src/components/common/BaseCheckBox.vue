<template>
  <div
      class="check-box"
      tabindex="0"
      :class="{ active: modelValue, disabled }"
      @click="handleClick"
      @keypress.enter="handleClick"
  >
    <div class="check-box__input">
      <IconTick v-if="modelValue"/>
    </div>
    <div class="check-box__slot">
      <slot/>
    </div>
  </div>
</template>

<script>
import IconTick from '../icons/IconTick.vue';

export default {
  name: 'BaseCheckBox',
  components: { IconTick },
  props: {
    modelValue: {
      type: [Boolean, Number],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    numeric: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const handleClick = () => {
      if (!props.disabled) {
        if (props.numeric) {
          emit('update:modelValue', props.modelValue ? 0 : 1);
        } else {
          emit('update:modelValue', !props.modelValue);
        }
      }
    };
    return { handleClick };
  }
};
</script>
