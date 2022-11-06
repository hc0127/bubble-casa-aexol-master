<template>
  <div :style="cssVars" class="block">
    <div v-if="icon" class="block__icon">
      <component :is="icon"/>
    </div>
    <span v-else class="block__circle">○</span>
    <div class="block__content">
      <div class="block__title" v-if="title">{{ title }}</div>
      <div class="block__text" v-html="text"/>
    </div>
    <span class="block__separator" />
  </div>
</template>

<script>
export default {
  name: "Block",
  props: {
    icon: {
      type: Object
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    diagonal: {
      type: String,
      default: "37px"
    },
    vertical: {
      type: String,
      default: "45px"
    },
    title_size: {
      type: String,
      default: "24px"
    }
  },

  computed: {
    cssVars() {
      return {
        '--left': this.diagonal,
        '--top': this.vertical,
        '--font': this.title_size,
      }
    }
  }
}
</script>

<style scoped lang="scss">

.block__title {
  font-size: var(--font);
}

.block__separator {
  left: var(--left);
  top: var(--top);
}

</style>

