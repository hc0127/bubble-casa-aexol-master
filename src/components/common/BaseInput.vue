<template>
  <div class="input" :class="{ error }">
    <div class="input__wrapper" :class="[variant]">
      <label v-if="label" :for="id" class="input__label">
        {{ label }}
      </label>
      <div class="input__icon">
        <slot />
      </div>
      <input
        autocomplete="false"
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        @input="updateInput"
        @blur="onBlur"
        class="input__field"
        :disabled="disabled"
        @focus="onFocus"
        @keypress.enter="articleRedirect"
      />
      <div v-if="closeIcon" @click="clearInput" class="close-icon">X</div>
      <IconError class="input__error-icon" v-if="error" />
    </div>
    <div v-if="!hide_error" class="input__error-wrapper">
      <div>{{ error }}</div>
    </div>
  </div>
</template>

<script>
import IconError from "../icons/IconError.vue";
import vClickOutside from "click-outside-vue3";

export default {
  name: "BaseInput",
  components: { IconError },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data: () => ({
    time: null,
  }),
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
    modelModifiers: {
      default: () => ({}),
    },
    type: {
      type: String,
      default: "text",
    },
    error: String,
    hide_error: {
      type: Boolean,
      default: false,
    },
    debounce: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
    },
    closeIcon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateInput(event) {
      let value = event.target.value;
      if (this.modelModifiers.email) {
        value = value.trim().toLowerCase();
      }

      if (this.debounce) {
        clearTimeout(this.time);
        this.time = setTimeout(() => {
          this.$emit("update:modelValue", value);
        }, this.debounce);
      } else {
        this.$emit("update:modelValue", value);
      }
    },
    articleRedirect(e) {
      this.$emit("redirect", e);
    },
    onBlur() {
      this.$emit("blur");
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    },
    onFocus() {
      this.$emit("focus");
    },
    clearInput() {
      this.$emit("clearInput");
    },
    handleClose() {
      this.$emit("handleClose");
    },
  },
};
</script>
