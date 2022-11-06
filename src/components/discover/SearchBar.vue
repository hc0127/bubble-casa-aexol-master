<template>
  <div class="searchbar-wrapper" v-click-outside="closeInput">
    <div class="input-wrapper">
      <input
        type="text"
        placeholder="SEARCH"
        @input="handleSearchInput"
        @keypress.enter="redirectToArticle"
        @blur="onBlur"
        id="searchbar"
      />
      <div @click="closeInput" class="close-icon">X</div>
    </div>
    <div
      class="discover__result"
      v-if="listOpened"
      @pointerdown.stop
      @pointerup.stop
    >
      <div class="scroll">
        <div
          class="discover__result--item"
          v-for="tag in tagListSortedByLength"
          v-bind:key="tag"
          @click="changeTagHandler(tag.id)"
        >
          {{ tag.tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clearTagList, getNodeByTag, tags_list } from "./discoverApi";
import { createDebounce } from "../../helper/utils";
import vClickOutside from "click-outside-vue3";
export default {
  name: "SearchBar",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      listOpened: true,
      redirectPosible: false,
    };
  },
  computed: {
    tagListSortedByLength() {
      return tags_list.data.sort((a, b) => a.tag.length - b.tag.length);
    },
  },
  methods: {
    closeInput() {
      this.$emit("closeSearch");
    },
    redirectToArticle(e) {
      if (this.redirectPosible) {
        const searchWord = e.target.value;
        this.$router.push({
          path: "/articleList/1/",
          query: { search: searchWord },
        });
      } else {
        return;
      }
    },
    handleSearchInput: async function (e) {
      clearTagList();
      const value = e.target.value;
      const debounce = createDebounce();
      debounce(() => {
        if (value.length > 1) {
          getNodeByTag(value).then(() => {
            if (tags_list.data.length === 0) {
              this.redirectPosible = true;
            } else {
              this.redirectPosible = false;
            }
          });
          return;
        }
      });
    },
    changeTagHandler(tag) {
      this.$emit("changeTag", tag);
    },
    onBlur() {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    },
  },
};
</script>
