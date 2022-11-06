<template>
  <div id="content-loader" class="content-loader content-loader__article-list">
    <ContentLoader
      v-for="(color, index) in backgroundColor"
      :key="index + 1"
      width="100%"
      :height="90"
      :backgroundColor="color"
      foregroundColor="#fafafa"
    >
      <rect x="300" y="15" rx="5" ry="5" width="100%" height="20" />
      <rect x="300" y="50" rx="5" ry="5" width="100%" height="10" />
      <rect x="300" y="70" rx="5" ry="5" width="100%" height="10" />
      <rect x="20" y="10" rx="0" ry="0" width="160" height="90" />
    </ContentLoader>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';
import { reactive } from 'vue';

export default {
  name: 'ArticleListLoader',
  components: {
    ContentLoader
  },
  setup() {
    const backgroundColor = reactive(['#ababab', '#bfbfbf', '#dadada', '#ececec', '#ececec'])

    return {
      backgroundColor,
    }
  }
};
</script>
