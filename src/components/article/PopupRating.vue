<template>
  <BasePopup class="rating-popup" @close="handleClose">
    <h1 class="forget-password__title popup-title">Rating</h1>
    <div class="forget-password__text">
      <p>It’s important for the author</p>
    </div>
    <div class="rating-popup__button-wrapper">
      <BaseButton
          v-for="button in rating_buttons"
          :key="button.name"
          @click="()=>handleClick(button.rate)"
          :variant="my_rating===button.rate && 'active'"
      >
        {{ button.name }}
      </BaseButton>
    </div>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';
import BaseButton from '../common/BaseButton.vue';
import { useRoute } from 'vue-router';
import { ref } from '@vue/reactivity';
import { onMounted } from 'vue';
import { callApi } from '../../api/callApi.js';
import store from '../../store.js';

export default {
  name: 'PopupRating',
  components: {
    BaseButton,
    BasePopup
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    article_id: {
      type: Number,
      default: 0.
    }
  },
  setup({ article_id }, { emit }) {

    const my_rating = ref(null);

    onMounted(async () => {

      const res = await callApi('article-rating','getYourRating',{ article_id });

      my_rating.value = res.result.rating;

    });

    const handleClick = async rate => {
      const res = await callApi('article-rating',
          'setRating',
          {  article_id, rating: +rate });
      if (res.success) {

        emit('close')
      }
    };

    const handleClose = () => {
      emit('close')
    }

    const rating_buttons = [
      {
        name: 'Excellent',
        rate: 5
      }, {
        name: 'Very good',
        rate: 4
      }, {
        name: ' So-so',
        rate: 3
      }, {
        name: 'Boring',
        rate: 2
      }, {
        name: 'Disappointing',
        rate: 1
      }, {
        name: 'I didn\'t finish',
        rate: 0
      },];


    return {
      handleClick,
      rating_buttons,
      my_rating,
      handleClose,
    };
  }
};
</script>
