<template>
  <Header small>
    <template #left-side>
      <ArticleBreadcrumbs v-if="!is_favourite && !is_received" :id="node_id" />
    </template>
    <template #right-side>
      <ArticleSearch
        :isAdvanced="advancedSearch"
        :listMode="listMode"
        @changeMode="changeMode"
        @query="getQuery"
      />
      <ArticleLevel @updateUserLevel="handleNewUserLevel" />
    </template>
  </Header>
  <div class="listMode" v-if="listMode">
    <ArticleListLoader v-if="init_loading" />
    <div v-else class="article-list">
      <div class="article-list__main">
        <div class="article-list__topbar"></div>
        <div
          v-if="article_list?.data?.length"
          class="article-list__list"
          @scroll="handleScroll"
          ref="scroll_wrapper"
        >
          <ArticleListElement
            v-for="article in article_list.data"
            :key="article.id"
            :article="article"
            :is_favourite="is_favourite"
            @articleRemove="articleRemove"
          />
          <hr class="emitter" ref="emitter" />
        </div>
        <div v-else class="article-list__noarticles">
          No articles in selected category
        </div>
      </div>
    </div>
  </div>

  <div class="tilesMode" v-if="!listMode">
    <ArticleListLoader v-if="init_loading" />
    <div v-else class="article-list">
      <div class="article-list__main">
        <div class="article-list__topbar"></div>
        <div
          v-if="article_list?.data?.length"
          class="article-list__list"
          @scroll="handleScroll"
          ref="scroll_wrapper"
        >
          <ArticleTilesElement
            v-for="article in article_list.data"
            :key="article.id"
            :article="article"
            :is_favourite="is_favourite"
          />
          <hr class="emitter" ref="emitter" />
        </div>
        <div v-else class="article-list__noarticles">
          No articles in selected category
        </div>
      </div>
    </div>
  </div>

  <ArticleListFooter />
</template>

<script>
import { useRoute } from "vue-router";
import ArticleLevel from "./ArticleLevel.vue";
import ArticleListElement from "./ArticleListElement.vue";
import ArticleTilesElement from "./ArticleTilesElement.vue";
import ArticleListFooter from "./ArticleListFooter.vue";
import ArticleBreadcrumbs from "../header/ArticleBreadcrumbs.vue";
import ArticleSearch from "../header/ArticleSearch.vue";
import { onMounted, onUnmounted, ref } from "vue";
import {
  article_list,
  getArticleList,
  is_loading,
  init_loading,
  setFilter,
  is_favourite,
  clearAllFilter,
  is_received,
  filter,
  offset,
  setOffset,
  clearOffset,
  scroll_wrapper,
  searchIoMode,
  searchIo,
  fetchSearchArticles,
} from "./articleData.js";
import Header from "../header/Header.vue";
import ArticleListLoader from "./ArticleListLoader.vue";

export default {
  name: "articleList",
  components: {
    ArticleLevel,
    Header,
    ArticleSearch,
    ArticleBreadcrumbs,
    ArticleListFooter,
    ArticleListElement,
    ArticleTilesElement,
    ArticleListLoader,
  },
  setup() {
    const screenWidth = window.innerWidth;
    const route = useRoute();
    const emitter = ref(null);
    const advancedSearch = ref(false);
    const can_fetch = ref(true);
    const node_id = +route.params.id;
    const listMode = screenWidth > 960 ? ref(true) : ref(false);
    const searchQuery = ref({});
    const page = ref(2);

    // check which articles should be fetched
    is_favourite.value = route.params.id === "favourite";
    is_received.value = route.params.id === "received";

    const getQuery = (val) => {
      searchQuery.value = val;
      page.value = 2;
    };

    const articleRemove = (id) => {
      const deleteIndex = article_list.value.data.findIndex((object) => {
        return object.id === id;
      });
      article_list.value.data.splice(deleteIndex, 1);
    };

    // fetch articles in scroll
    const handleScroll = async () => {
      if (searchIoMode.value) {
        if (article_list.value.data.length === article_list.value.filtered)
          return;
        if (!can_fetch.value) return;
        const wrapperH = scroll_wrapper.value.offsetHeight + 1500;
        const actual_scroll = scroll_wrapper.value.scrollTop + wrapperH;
        const container_height = scroll_wrapper.value.scrollHeight;

        if (actual_scroll + 250 > container_height) {
          can_fetch.value = false;
          searchQuery.value.page = page.value;
          await searchIo(searchQuery.value).then((res) => {
            if (res.length === 0) return;
            const articlesIds = [];
            res.forEach((art) => {
              articlesIds.push(art.id);
            });
            fetchSearchArticles("article", "getAll", articlesIds);
          });
          can_fetch.value = true;
          page.value++;
          return;
        }
        return;
      }
      if (article_list.value.data.length === article_list.value.filtered)
        return;
      if (!can_fetch.value) return;
      const wrapperH = scroll_wrapper.value.offsetHeight + 1000;
      const actual_scroll = scroll_wrapper.value.scrollTop + wrapperH;
      const container_height = scroll_wrapper.value.scrollHeight;
      if (actual_scroll + 250 > container_height) {
        can_fetch.value = false;
        await getArticleList();
        can_fetch.value = true;
        setOffset();
      }
    };

    const handleNewUserLevel = async () => {
      init_loading.value = true;
      article_list.data = [];
      article_list.filtered = 0;
      clearAllFilter();
      // clearOffset();
      if (!is_favourite.value || !is_received.value) {
        return setFilter("node_id", node_id);
      }
      await getArticleList(offset.value);
    };

    const changeMode = () => {
      listMode.value = !listMode.value;
      localStorage.setItem("listMode", listMode.value.toString());
    };

    onMounted(async () => {
      if (localStorage.getItem("listMode")) {
        const myBool = localStorage.getItem("listMode") === "true";
        listMode.value = myBool || false;
      }
      if (window.location.href.indexOf("advanced") != -1) {
        advancedSearch.value = true;
      } else {
        advancedSearch.value = false;
      }
      init_loading.value = true;
      if (!is_favourite.value || !is_received.value) {
        return setFilter("node_id", node_id); // if is_favourite return false set node_id filter and fetch articles
      }
      await getArticleList(offset.value); // fetch favourite or received articles
    });

    onUnmounted(() => {
      article_list.value.data = [];
      article_list.value.filtered = 0;
      is_favourite.value = false;
      is_received.value = false;
      clearAllFilter();
      clearOffset();
    });

    return {
      article_list,
      is_loading,
      handleScroll,
      emitter,
      scroll_wrapper,
      node_id,
      init_loading,
      is_favourite,
      is_received,
      filter,
      offset,
      setOffset,
      clearOffset,
      getArticleList,
      handleNewUserLevel,
      advancedSearch,
      listMode,
      changeMode,
      getQuery,
      articleRemove,
    };
  },
};
</script>


