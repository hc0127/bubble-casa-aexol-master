<template>
  <div class="article-level">
    <BaseTooltip
        variant="no-user"
        :class="{'tooltip__disabled' : user_session }"
        message="You need to be logged in to change this option"
    >
      <div class="article-level__label" :class="currentLevelClass" @click="handleClick">
        {{ currentLevelLabel }}
      </div>
    </BaseTooltip>
    <div class="article-level__list" v-if="open && user_session" v-click-outside="handleClose">
      <div
          v-for="opt in possibleUserLevels"
          :key="opt.level"
          class="article-level__list-element"
          @click="(e) => setArticleLevelFilter(opt, e)"
      >
        {{ opt.label }}
      </div>
    </div>
    <div class="tooltip" :class="{'tooltip__disabled' : open }">
      <div class="tooltip__message">
        <span>Basic</span>
        <p>Collects basic information, opinions and news.</p>
        <span>Standard</span>
        <p>Additionally garthers articles from specialized sites.</p>
        <span>Advanced</span>
        <p>Shows information for professionals.</p>
        <span>Expert</span>
        <p>Shows everything, including announcements, updates and research papers.</p>
      </div>
      <IconQuestionMarkLarge class="article-level__icon"/>
    </div>
  </div>
</template>

<script>

import IconQuestionMarkLarge from '../icons/IconQuestionMarkLarge.vue';
import BaseTooltip from '../common/BaseTooltip.vue';
import { user_session } from '../../session';
import { possibleUserLevels } from '../../config/possibleUserLevels.js';
import { notify } from '@kyvg/vue3-notification';
import vClickOutside from 'click-outside-vue3';
import { ref } from '@vue/reactivity';
import { computed } from 'vue';
import { useFetch } from '../../hooks/useFetch';
import { callApi } from '../../api/callApi';

export default {
  name: 'ArticleLevel',
  components: { BaseTooltip, IconQuestionMarkLarge },
  directives: {
    clickOutside: vClickOutside.directive,
  },

  setup(props, { emit }) {
    const open = ref(false);
    const { fetchData } = useFetch();

    const currentUserLevel = computed(() => {
      return user_session.value ? user_session.value.session.article_level_filter : 4;
    });
    const currentLevelLabel = computed(() => possibleUserLevels.find(element => element.level === currentUserLevel.value).label);
    const currentLevelClass = computed(() => currentLevelLabel.value.split(' ')[0].toLowerCase());

    const setArticleLevelFilter = async (opt, e) => {
      e.stopPropagation();
      open.value = false;
      const res = opt.level !== currentUserLevel.value
          ?
          await fetchData(() => callApi('user', 'setArticleLevelFilter', { article_level_filter: opt.level }))
          :
          notify({
            title: `This level is already selected`,
            type: 'error',
          });
      if (res.success) {
        user_session.value.session.article_level_filter = opt.level;
        emit('updateUserLevel');
        notify({
          title: `You changed the current level`,
          type: 'success',
        });
      }
    };

    const handleClick = () => {
      if (user_session.value) {
        open.value = !open.value;
      }
    };

    const handleClose = () => {
      open.value = false;
    };

    return {
      possibleUserLevels,
      user_session,
      open,
      currentLevelLabel,
      currentLevelClass,
      handleClose,
      handleClick,
      setArticleLevelFilter,
    };
  },
};
</script>
