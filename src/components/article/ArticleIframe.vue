<template>
  <Header>
    <template #left-side>
      <Author :author="user?.name" :author_is_owner="article.is_owner"/>
      <ArticleBreadcrumbs v-if="article.node_id" :id="article.node_id"/>
    </template>
  </Header>
  <div class="article-iframe">
    <div class="iframe">
      <iframe
          v-if="iframe_path"
          :src="iframe_path"
          allowfullscreen
          height="100%"
          name="X-Frame-Options"
          width="100%"
      />
    </div>
  </div>
  <SingleArticleFooter :article_id="article.id"/>
</template>

<script>
import SingleArticleFooter from './SingleArticleFooter.vue';
import ArticleBreadcrumbs from '../header/ArticleBreadcrumbs.vue';
import {computed, onMounted} from 'vue';
import {callApi} from '../../api/callApi.js';
import {useRoute, useRouter} from 'vue-router';
import {ref} from '@vue/reactivity';
import PopupRating from './PopupRating.vue';
import LogoSvg from '../Logo/LogoSvg.vue';
import axios from 'axios';
import ArticleError from './ArticleError.vue';
import Header from '../header/Header.vue';
import Author from '../header/Author.vue';

export default {
  name: 'ArticleIframe',
  components: {
    Author,
    Header,
    ArticleError,
    LogoSvg,
    PopupRating,
    SingleArticleFooter,
    ArticleBreadcrumbs
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const article = ref({});
    const open = ref(false);
    const iframe_path = ref(null);

    const generateIframePath = () => {
      if (!(article && article.value && article.value.iframe)) {
        return '';
      }
      const {iframe} = article.value;
      iframe_path.value = iframe.includes('http') ? iframe : `https://${iframe}`;
    };

    const user = computed(() => article?.value?.user);

    const checkUrl = async () => {
      try {
        await axios.post(iframe_path.value)
      } catch (e) {
        iframe_path.value && window.open(iframe_path.value, '_blank');
        router.back()
      }
    }

    onMounted(async () => {
      const res = await callApi('article', 'getOne', {id: +route.params.id});
      if (res) {
        article.value = res;
      }

      generateIframePath();
      await checkUrl()
    });

    return {
      article,
      iframe_path,
      user,
      open,
    };
  }
};
</script>
