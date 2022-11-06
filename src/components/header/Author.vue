<template>
  <div v-if="author_is_owner" class="author">
    <div class="author__thumbnail">
      <img src="../../asset/images/author.png">
    </div>
    <div class="author__name"> by {{ author }}</div>
    <BaseButton class="author__follow" variant="transparent" @click = "() => alert('follow author')">Follow Author</BaseButton>
  </div>
  <div v-else class="author">
    <div class="author__thumbnail">
      <img src="../../asset/images/author.png">
    </div>
    <div class="author__name">shared by {{ author }}</div>
  </div>
</template>

<script>
import BaseButton from '../common/BaseButton.vue';
export default {
  name: "Author",
  components: {BaseButton},
  props: {
    author: {
      type: String,
      default: ''
    },
    author_is_owner: {
      type: Boolean,
      default: false
    }
  }
}
</script>
