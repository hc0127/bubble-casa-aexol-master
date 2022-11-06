<template>
  <p>Target page doesn't allow to open it using iFrame</p>
  <p>Please use the link below</p>
  <a :href="link" target="_blank" rel="noreferrer noopener">{{ link }}</a>
</template>

<script>
export default {
  name: 'articleError',
  props: {
    link: String
  }
};
</script>
