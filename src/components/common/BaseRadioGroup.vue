<template>
  <div class="sign-up-author__radio-group">
    <BaseCheckBox
        v-for="radio in radio_config"
        :key="radio.value"
        :modelValue="modelValue === radio.value"
        @click="() => handleClick(radio.value)"
        @keyup.enter="() => handleClick(radio.value)"
    >
      <label>{{ radio.label }}</label>
    </BaseCheckBox>
  </div>
</template>

<script>
import BaseCheckBox from './BaseCheckBox.vue';

export default {
  name: 'BaseRadioGroup',
  components: { BaseCheckBox },
  props: {
    radio_config: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [Boolean, Number, String],
      default: false,
    },
  },
  setup(props, { emit }) {
    const handleClick = (value) => {
      emit('update:modelValue', value);
    };

    return { handleClick };
  }
};
</script>
