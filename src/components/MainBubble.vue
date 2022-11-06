<template>
  <div
    :class="`main-bubble main-bubble__${name}`"
    :style="{
      backgroundImage:
        name !== 'choose' && `url(./src/asset/bubbles/${name}.png)`,
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "MainBubble",
  props: {
    name: String,
  },
};
</script>

