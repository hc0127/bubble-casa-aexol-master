<template>
  <div class="breadcrumbs" v-if="breadcrumbs" :class="{'smaller-text': breadcrumbs.length > 10 }">
    <span @click="() => handleRedirect(0)">Search</span>
    <span
      v-for="(node, index) in breadcrumbs"
      :key="node.id"
      :class="breadcrumbs.length === index + 1 && 'breadcrumbs__last'"
      @click="() => handleRedirect(node.id)"
    >
      {{ changerBreadcrumbsDisplayedNames(node.name) }}
    </span>
  </div>
</template>

<script>
import ArticleListFooter from '../article/ArticleListFooter.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { callApi } from '../../api/callApi.js';
import { ref } from '@vue/reactivity';
import IconArrowRight from '../icons/IconArrowRight.vue';
import IconBreadcrumbsDivider from '../icons/IconBreadcrumbsDivider.vue';

export default {
  name: 'ArticleBreadcrumbs',
  components: {
    IconBreadcrumbsDivider,
    IconArrowRight,
    ArticleListFooter,
  },

  props: {
    id: {
      type: Number,
    },
  },

  setup(props) {
    const router = useRouter();
    const breadcrumbs = ref([]);

    const handleRedirect = (id) => {
      router.push({ path: '/', query: { node: id } });
    };

    const updateBreadcrumbs = async () => {
      const res = await callApi('node', 'getPathForNode', { node_id: props.id });
      breadcrumbs.value = res.result.map(node => {
        return { name: node.name, id: node.id }
      });
    };

    const changerBreadcrumbsDisplayedNames = (name) => {
      if (name === 'root') return 'discover'
      return name;
    }

    onMounted(async () => {
      await updateBreadcrumbs();
    });

    return {
      breadcrumbs,
      changerBreadcrumbsDisplayedNames,
      handleRedirect,
    };
  },
};
</script>


<style lang="scss">
.breadcrumbs {
  padding-right: 20px;

  span {
    text-transform: uppercase;

    &:last-child {
      color: black
    }

    &:not(:last-child) {
      margin-right: 10px;

      &:after {
        content: ' >'
      }
    }
  }
}

.smaller-text span {
  font-size: 14px;
}

</style>
