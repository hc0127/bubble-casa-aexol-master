<template>
  <div class="title-section">
    <div class="title-section__bar" />
    <div class="title-section__title" >{{ title }}</div>
    <div class="title-section__bar" />
  </div>
</template>

<script>
export default {
name: "BaseSectionTitle",
  props: {
    title: {
      type: String,
      default: null
    }
  }
}
</script>
