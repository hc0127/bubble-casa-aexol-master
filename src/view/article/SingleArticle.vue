<template>
  <Header small>
  </Header>
  <div class="single-article">
    <div class="single-article__main">
      <div class="title">
        {{ article.title }}
      </div>
      <div v-if="iframe_path">
        <iframe :src="iframe_path" frameborder="0" allow-same-origin="true">
          <httpProtocol>
            <customHeaders>
              <add name="X-Frame-Options" value="sameorigin"/>
            </customHeaders>
          </httpProtocol>

        </iframe>
      </div>
      <div v-else>
        <div class="title">
          {{ article.title }}
        </div>
        <div class="info">
          <div class="author">
            by damian glowa
          </div>
          <IconDot/>
          <div class="date">
            october 20, 2021
          </div>
          <IconDot/>
          <div class="read-time">
            5 minutes read
          </div>
        </div>
        <div class="text">
          <p>
            {{ article.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <SingleArticleFooter/>

</template>

<script>
import ArticleBreadcrumbs from '../../components/article/ArticleBreadcrumbs.vue';
import IconDot from '../../components/icons/IconDot.vue';
import SingleArticleFooter from '../../components/article/SingleArticleFooter.vue';
import { computed, onMounted } from 'vue';
import { callApi } from '../../api/callApi.js';
import { useRoute } from 'vue-router';
import { ref } from '@vue/reactivity';
import Header from '../../components/header/Header.vue';

export default {
  name: '_id',
  components: {
    Header,
    SingleArticleFooter,
    IconDot,
    ArticleBreadcrumbs
  },
  setup() {
    const route = useRoute();
    const article = ref({});

    const iframe_path = computed(() => {
      if (!(article && article.value && article.value.iframe)) {
        return '';
      }
      const { iframe } = article.value;
      return iframe.includes('http') ? iframe : `https://${iframe}`;

    });

    onMounted(async () => {
      const res = await callApi('article', 'getOne', { id: +route.params.id });
      if (res) {
        article.value = res;
      }
    });
    return {
      article,
      iframe_path
    };
  }
};
</script>
