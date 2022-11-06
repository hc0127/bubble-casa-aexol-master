<template>
  <div class="tooltip">
    <div
        class="tooltip__message"
        :class="[`tooltip__${variant}`]"
    >
      {{ message }}
    </div>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'BaseTooltip',
  props: {
    message: String | Number,
    variant: String
  }
};
</script>
