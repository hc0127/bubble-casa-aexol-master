<template>
  <div class="article-search">
    <BaseInput
      v-model="search"
      hide_error
      @input="handleSearchInput"
      @focus="onFocus"
      @clearInput="handleClearInput"
      placeholder="Advanced search"
      :closeIcon="closeIconVisible"
      @click.stop
      @keydown.enter="searchHandler"
    >
      <SearchIcon />
    </BaseInput>
    <div
      class="advanced-filters"
      v-if="searchFiltersVisible && screenWidth > 960"
      v-click-outside="handleClose"
    >
      <div class="close" @click="searchFiltersVisible = false">X</div>
      <div class="filters-wrapper" v-if="minimalizeFiltersBar">
        <form class="form">
          <div>
            <input
              type="radio"
              id="node"
              name="category"
              value="node"
              v-model="searchIn"
              @click="searchInHandler('node')"
              checked
            />
            <label for="node">This Category only</label>
          </div>
          <div>
            <input
              type="radio"
              id="entire"
              name="category"
              value="entire"
              v-model="searchIn"
              @click="searchInHandler('entire')"
            />
            <label for="entire">Entire Site</label>
          </div>
        </form>
        <p class="title">Within:</p>
        <div class="filters-box">
          <p
            v-for="filter in filters"
            :key="filter"
            @click="activeFilter(filter.data)"
            class="filter-elem"
            :class="{ active: active.find((elem) => elem == filter.data) }"
          >
            {{ filter.label }}
          </p>
        </div>
        <p class="title">Sort:</p>
        <div class="filters-box">
          <p
            class="filter-elem"
            @click="sortArticles('relevancy')"
            :class="{ active: sort === 'relevancy' }"
          >
            Relevancy
          </p>
          <p class="filter-elem">or</p>
          <p
            class="filter-elem"
            @click="sortArticles('date')"
            :class="{ active: sort === 'date' }"
          >
            date
          </p>
        </div>
      </div>
      <div class="filters-visible">
        <IconUp class="arrow" :style="arrowStyle" @click="minimalizeFilters" />
      </div>
    </div>
    <BaseCheckBox v-model.number="is_video" @click="handleIsVideo">
      Video
    </BaseCheckBox>
    <div class="articleMode" @click="changeMode">
      <IconModeActive v-if="!listMode" />
      <IconModeNonactive v-if="listMode" />
    </div>
  </div>
</template>

<script>
import BaseInput from "../common/BaseInput.vue";
import SearchIcon from "../icons/IconSearch.vue";
import BaseCheckBox from "../common/BaseCheckBox.vue";
import { ref, computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { onMounted, watch } from "vue";
import {
  setFilter,
  scrollTop,
  searchIo,
  getArticleList,
  fetchSearchArticles,
  article_list,
  searchIoMode,
  sortArticleList,
} from "../article/articleData.js";
import vClickOutside from "click-outside-vue3";
import IconUp from "../icons/IconUp.vue";
import { searchQuery } from "./searchHelper";
import IconModeActive from "../icons/IconModeActive.vue";
import IconModeNonactive from "../icons/IconModeNonactive.vue";
import { callApi } from "../../api/callApi";

export default {
  name: "ArticleSearch",
  components: {
    BaseCheckBox,
    BaseInput,
    SearchIcon,
    IconUp,
    IconModeActive,
    IconModeNonactive,
  },
  props: {
    isAdvanced: {
      type: Boolean,
      default: false,
    },
    listMode: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const search = ref("");
    const node_id = +route.params.id;
    const is_video = ref(0);
    const searchFiltersVisible = ref(false);
    const screenWidth = window.innerWidth;
    const active = ref([]);
    const sort = ref("relevancy");
    const minimalizeFiltersBar = ref(true);
    const searchIn = ref("node");
    const searchPossible = ref(true);
    const nodeChildren = ref([]);

    const filters = ref([
      { label: "Knowledge", data: "knowledge" },
      { label: "News", data: "news_2" },
      { label: "Videos", data: "videos" },
      { label: "Trends", data: "trends" },
      { label: "Curiosity", data: "curiosity" },
      { label: "Tips&Tricks", data: "tips_and_tricks" },
      { label: "Research", data: "research" },
      { label: "Tools", data: "tools" },
      { label: "Community", data: "community" },
      { label: "Shopping", data: "shopping" },
    ]);
    let time = null;

    const searchHandler = () => {
      if (searchPossible.value) {
        searchPossible.value = false;
        if (search.value.length == 0 && active.value.length < 1) {
          handleClearInput();
          searchPossible.value = true;
          return;
        }
        searchIoMode.value = false;
        const query = searchQuery(
          search.value,
          active.value,
          searchIn.value,
          node_id,
          nodeChildren.value,
          1
        );
        emit("query", query);
        searchIo(query).then((res) => {
          if (res.length === 0) {
            searchPossible.value = true;
            article_list.value.data = [];
            return;
          }
          const articlesIds = [];
          res.forEach((art) => {
            articlesIds.push(art.id);
          });
          fetchSearchArticles("article", "getAll", articlesIds);
          scrollTop();
          searchPossible.value = true;
        });
      }
    };

    const searchInHandler = (searchType) => {
      searchIn.value = searchType;
      searchHandler();
    };

    const handleSearchInput = async () => {
      searchPossible.value = false;
      clearTimeout(time);
      if (search.value.length == 0 && active.value.length < 1) {
        handleClearInput();
        return;
      }
      if (search.value.length < 4) {
        searchPossible.value = true;
        return;
      } else {
        searchIoMode.value = false;
        time = setTimeout(() => {
          const query = searchQuery(
            search.value,
            active.value,
            searchIn.value,
            node_id,
            nodeChildren.value,
            1
          );
          emit("query", query);
          searchIo(query).then((res) => {
            if (res.length === 0) {
              searchPossible.value = true;
              article_list.value.data = [];
              return;
            }
            const articlesIds = [];
            res.forEach((art) => {
              articlesIds.push(art.id);
            });
            fetchSearchArticles("article", "getAll", articlesIds);
            scrollTop();
            searchPossible.value = true;
          });
        }, 350);
      }
    };

    const activeFilter = (filter) => {
      if (active.value.find((elem) => elem == filter)) {
        if (search.value.length == 0 && active.value.length < 1) {
          handleClearInput();
          return;
        }
        const deleteItemIndex = active.value.indexOf(filter);
        active.value.splice(deleteItemIndex, 1);
        searchIoMode.value = false;
        const query = searchQuery(
          search.value,
          active.value,
          searchIn.value,
          node_id,
          nodeChildren.value,
          1
        );
        emit("query", query);
        searchIo(query).then((res) => {
          if (res.length === 0) {
            searchPossible.value = true;
            article_list.value.data = [];
            return;
          }
          const articlesIds = [];
          res.forEach((art) => {
            articlesIds.push(art.id);
          });
          fetchSearchArticles("article", "getAll", articlesIds);
          scrollTop();
        });
      } else {
        searchIoMode.value = false;
        active.value = [];
        active.value.push(filter);
        const query = searchQuery(
          search.value,
          active.value,
          searchIn.value,
          node_id,
          nodeChildren.value,
          1
        );
        emit("query", query);
        searchIo(query).then((res) => {
          if (res.length === 0) {
            searchPossible.value = true;
            article_list.value.data = [];
            return;
          }
          const articlesIds = [];
          res.forEach((art) => {
            articlesIds.push(art.id);
          });
          fetchSearchArticles("article", "getAll", articlesIds);
          scrollTop();
        });
      }
    };

    const handleClearInput = () => {
      search.value = "";
      setFilter("title", "");
      scrollTop();
      const elem = document.querySelector(".input__field");
      elem.focus();
      getArticleList();
    };

    const handleIsVideo = () => {
      setFilter("is_video", is_video.value ? 1 : undefined);
      scrollTop();
    };

    const onFocus = () => {
      searchFiltersVisible.value = true;
    };

    const handleClose = () => {
      searchFiltersVisible.value = false;
    };

    const arrowStyle = computed(() => {
      return minimalizeFiltersBar.value
        ? ""
        : "transform: rotate(180deg); top: 5px";
    });

    const closeIconVisible = computed(() => {
      return search.value.length > 0 ? true : false;
    });

    const minimalizeFilters = () => {
      minimalizeFiltersBar.value = !minimalizeFiltersBar.value;
    };

    const changeMode = () => {
      emit("changeMode");
    };

    const sortArticles = (sortBy) => {
      if (sort.value === sortBy) return;
      sort.value = sortBy;
      sortArticleList(sortBy);
    };

    const addToArray = (obj) => {
      if (obj.children) {
        nodeChildren.value.push(obj.id);
        obj.children.forEach((child) => addToArray(child));
      } else {
        nodeChildren.value.push(obj.id);
      }
    };

    const getNodeChildren = async () => {
      const res = await callApi("node", "getTreeFromNode", {
        node_id: node_id,
      });
      addToArray(res);
      // res?.children?.forEach((elem) => {
      //   nodeChildren.value.push(elem.id);
      // });
    };

    onMounted(() => {
      getNodeChildren();
      if (route.query.advanced) {
        const elem = document.querySelector(".input__field");
        elem.focus();
        searchFiltersVisible.value = true;
      }
      if (route.query.search) {
        const elem = document.querySelector(".input__field");
        elem.value = route.query.search;
        setFilter("title", route.query.search);
      }
    });

    return {
      search,
      is_video,
      handleSearchInput,
      handleClearInput,
      handleIsVideo,
      closeIconVisible,
      searchFiltersVisible,
      onFocus,
      handleClose,
      active,
      sort,
      activeFilter,
      minimalizeFilters,
      minimalizeFiltersBar,
      arrowStyle,
      filters,
      searchIn,
      node_id,
      changeMode,
      searchHandler,
      sortArticles,
      screenWidth,
      searchInHandler,
    };
  },
};
</script>
