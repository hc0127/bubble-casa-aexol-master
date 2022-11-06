<template>
  <div class="textarea" :class="{ error }">
    <div
      class="textarea__wrapper"
      :class="{ [`textarea__${variant}`]: variant }"
    >
      <label v-if="label" :for="id" class="textarea--label">
        {{ label }}
      </label>
      <slot />
      <textarea
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        @input="updateInput"
        class="textarea--field"
        @blur="onBlur"
        :maxlength="maxlength"
      />
      <IconError v-if="error" />
    </div>
    <div class="input__error-wrapper">
      <div>{{ error }}</div>
    </div>
  </div>
</template>

<script>
import IconError from "../icons/IconError.vue";

export default {
  name: "BaseTextarea",
  components: { IconError },
  props: {
    id: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "primary",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    maxlength: {
      type: Number,
      default: undefined,
    },
    error: String,
  },
  methods: {
    updateInput(event) {
      this.$emit("update:modelValue", event.target.value);
    },
    onBlur() {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    },
  },
};
</script>
