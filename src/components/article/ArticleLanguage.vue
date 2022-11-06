<template>
  <div class="article-lang" @click="open = true">
    <div class="article-lang__list" v-if="open" v-click-outside="handleClose">
      <div
        v-for="opt in options"
        :key="opt.id"
        class="article-lang__list-element"
        @click="(e) => handleClick(opt, e)"
      >
        {{ opt.label }}
      </div>
    </div>
    <div>
      {{ modelValue }}
    </div>
  </div>
</template>

<script>
import vClickOutside from "click-outside-vue3";
import { ref } from "@vue/reactivity";
import { onMounted } from "vue";
import { callApi } from "../../api/callApi.js";
import { scrollTop, setFilter } from "./articleData.js";
import { changeSearchLang } from "../header/searchHelper.js";

export default {
  name: "ArticleLanguage",
  props: {
    modelValue: {
      type: [String],
      default: "en",
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup(props, { emit }) {
    const options = ref(null);

    onMounted(async () => {
      const res = await callApi("settings", "getLanguages");
      if (res.success) {
        options.value = res.lang_list.sort((a, b) =>
          a.label > b.label ? 1 : -1
        );
      }
    });

    const open = ref(false);

    const handleClick = (opt, e) => {
      e.stopPropagation();
      open.value = false;
      emit("update:modelValue", opt.id);
      setFilter("language", opt.id);
      scrollTop();
      //tutaj
      changeSearchLang(opt.id);
      localStorage.setItem("setLang", opt.id);
    };

    const handleClose = () => {
      open.value = false;
    };

    return {
      handleClick,
      options,
      open,
      handleClose,
    };
  },
};
</script>
