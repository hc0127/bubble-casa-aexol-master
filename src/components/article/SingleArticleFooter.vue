<template>
  <div class="single-article__footer footer">
    <div class="col">
      <InfoButton/>
      <HomeButton/>
      <BackButton/>
    </div>
    <div class="col">
      <AddButton/>
      <HeartButton @click="handleClick"/>
      <NetworkButton/>
    </div>
    <div class="col">
      <SendButton/>
      <MailButton/>
      <TButton/>
    </div>
  </div>
  <PopupRating v-if="ratingModal" @close="() => setOpenRatingModal(false)"
               :article_id="article_id"/>
</template>

<script>
import InfoButton from '../footer/InfoButton.vue';
import BackButton from '../footer/BackButton.vue';
import HomeButton from '../footer/HomeButton.vue';
import AddButton from '../footer/AddButton.vue';
import HeartButton from '../footer/HeartButton.vue';
import NetworkButton from '../footer/NetworkButton.vue';
import SendButton from '../footer/SendButton.vue';
import MailButton from '../footer/MailButton.vue';
import TButton from '../footer/TButton.vue';
import { user_session } from '../../session';
import { ref } from '@vue/reactivity';
import PopupRating from './PopupRating.vue';
import store from '../../store.js';

export default {
  name: 'SingleArticleFooter',
  components: {
    PopupRating,
    TButton,
    MailButton,
    SendButton,
    NetworkButton,
    HeartButton,
    AddButton,
    HomeButton,
    BackButton,
    InfoButton,
  },
  props: {
    article_id: {
      type: Number,
      default: 0,
      required: true,

    }
  },
  setup(props) {

    const ratingModal = ref(false);

    const handleClick = () => {
      if (user_session.value) {
        setOpenRatingModal(true);
      } else {
        store.triggerPopup('SignIn');
      }
    };

    const setOpenRatingModal = (open) => {
      ratingModal.value = open;
    };

    return {
      user_session,
      ratingModal,
      handleClick,
      setOpenRatingModal
    };
  }
};
</script>

