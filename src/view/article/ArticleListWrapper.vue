<template>
  <ArticleList :key="node_id" />
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ArticleList from '../../components/article/ArticleList.vue';

export default {
  name: "ArticleListWrapper",
  components: { ArticleList },

  setup() {
    const route = useRoute();
    const node_id = computed(()=> +route.params.id)

    return {
      node_id
    }
  }
};
</script>
