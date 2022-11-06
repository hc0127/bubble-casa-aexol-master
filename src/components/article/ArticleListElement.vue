<template>
  <div class="article-list__element" @click="redirectArticle">
    <div class="article-element-desktop">
      <div class="img">
        <img :src="path" alt="" />
      </div>
      <div class="content">
        <h4 class="title">{{ article.title }}</h4>
        <p class="text">{{ article.description }}</p>
        <p class="iframe">{{ article.iframe }}</p>
      </div>
    </div>
    <div class="article-element-mobile">
      <div class="article-element-header">
        <div class="img">
          <img :src="path" alt="" />
        </div>
        <h4 class="title">{{ article.title }}</h4>
      </div>
      <div class="content">
        <p class="text">{{ article.description }}</p>
        <p class="iframe">{{ article.iframe }}</p>
      </div>
    </div>
    <div class="buttons">
      <button
        class="find-simillar-cta"
        @click.stop="redirectNode"
        v-if="article.node_id && node_id !== article.node_id"
      >
        Find similar
      </button>
      <BaseButton
        @click.stop="handleAddToFavourites"
        variant="flat"
        color="transparent"
      >
        <SecoundIconAdd
          class="favouritesButton"
          v-if="!isUserFavouriteArticle"
        />
        <IconMinus class="favouritesButton" v-else />
      </BaseButton>

      <div class="social-article-wrapper">
        <div class="social-article-icon" @click.stop="socialMenu">
          <IconSendTo />
        </div>
        <div class="menu-wrapper">
          <div
            class="social-article-menu"
            v-if="socialMenuVisible"
            @click.stop="socialMenu()"
          >
            <div class="social-article-elem">
              <ShareNetwork network="twitter" :url="article.iframe" title="">
                <twitter />
              </ShareNetwork>
            </div>
            <div class="social-article-elem">
              <ShareNetwork network="facebook" :url="article.iframe" title="">
                <facebook />
              </ShareNetwork>
            </div>
            <div class="social-article-elem">
              <ShareNetwork network="LinkedIn" :url="article.iframe" title="">
                <linkedin />
              </ShareNetwork>
            </div>
            <div class="social-article-elem">
              <ShareNetwork network="Email" :url="article.iframe" title="">
                <mail />
              </ShareNetwork>
            </div>
            <div
              class="social-article-elem"
              @click.stop="togglePopupSendToUser"
            >
              <user />
            </div>
          </div>
        </div>
      </div>
      <BaseButton
        @click.stop="handleRatingClick"
        color="transparent"
        variant="flat"
      >
        <div class="rating-menu">
          <IconHeart />
          <p class="rating-number">{{ articleRating }}</p>
        </div>
      </BaseButton>
      <BaseButton
        @click.stop="removeArticle"
        variant="flat"
        color="red"
        v-if="isAdmin"
        class="remove-btn"
      >
        Remove
      </BaseButton>
    </div>
  </div>
  <PopupRating
    v-if="popupRatingIsOpen"
    :article_id="article.id"
    @close="() => togglePopupRating(false)"
  />
  <PopupSendToUser
    v-if="popupSendToUserIsOpen"
    :title="article.title"
    :article_id="article.id"
    @close="togglePopupSendToUser(false)"
  />
</template>

<script>
import { computed, ref } from "vue";
import MissingThumbnail from "../../asset/images/missing.jpg";
import IconShare from "../icons/IconShare.vue";
import IconStar from "../icons/IconStar.vue";
import SecoundIconAdd from "../icons/SecoundIconAdd.vue";
import IconSendTo from "../icons/IconSendTo.vue";
import IconHeart from "../icons/IconHeart.vue";
import PopupRating from "./PopupRating.vue";
import PopupSendToUser from "./PopupSendToUser.vue";
import { useRoute, useRouter } from "vue-router";
import BaseButton from "../common/BaseButton.vue";
import { callApi } from "../../api/callApi";
import { notify } from "@kyvg/vue3-notification";
import store from "../../store.js";
import { user_session } from "../../session";
import { useFetch } from "../../hooks/useFetch";
import IconMinus from "../icons/IconMinus.vue";
import IconGoTo from "../icons/IconGoTo.vue";
import facebook from "../icons/facebook.vue";
import twitter from "../icons/twitter.vue";
import linkedin from "../icons/linkedin.vue";
import mail from "../icons/mail.vue";
import user from "../icons/user.vue";

export default {
  name: "ArticleListElement",
  components: {
    IconGoTo,
    IconMinus,
    BaseButton,
    PopupRating,
    IconHeart,
    IconSendTo,
    SecoundIconAdd,
    IconStar,
    IconShare,
    PopupSendToUser,
    facebook,
    twitter,
    linkedin,
    mail,
    user,
  },
  props: {
    article: {
      type: Object,
    },
    is_favourite: {
      type: Boolean,
    },
  },
  setup({ article }, { emit }) {
    const popupRatingIsOpen = ref(false);
    const popupSendToUserIsOpen = ref(false);
    const isActive = ref(false);
    const router = useRouter();
    const route = useRoute();
    const node_id = +route.params.id;
    const { loading, fetchData } = useFetch();
    const isUserFavouriteArticle = ref(article?.is_my_favourite);
    const socialMenuVisible = ref(false);

    const path = computed(() => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 960) {
        return article?.image
          ? `https://static-test.library.one/article/${article.id}/big_${article.image}`
          : MissingThumbnail;
      } else
        return article?.image
          ? `https://static-test.library.one/article/${article.id}/big_${article.image}`
          : MissingThumbnail;
    });

    const isAdmin = computed(() => {
      return user_session.value?.session.role_id === 1;
    });

    const togglePopupRating = (open) => {
      popupRatingIsOpen.value = open;
    };

    const togglePopupSendToUser = (open) => {
      popupSendToUserIsOpen.value = open;
      socialMenuVisible.value = false;
    };

    const redirectArticle = async () => {
      window.open(article.iframe, "_blank");
    };

    const redirectNode = () => {
      router.push({ path: `/articleList/${article?.node_id}` });
    };

    const checkUserSessionExist = () => {
      if (!user_session.value) {
        store.triggerPopup("SignIn");
        return false;
      }
      return true;
    };

    const articleRating = computed(() => {
      const articleRate = article.rating / 10;
      return parseFloat(articleRate.toFixed(1));
    });

    const handleAddToFavourites = async () => {
      if (!checkUserSessionExist() || loading.value) return;
      const res = !isUserFavouriteArticle.value
        ? await fetchData(() =>
            callApi("favourite-article", "create", { article_id: article?.id })
          )
        : await fetchData(() =>
            callApi("favourite-article", "delete", { article_id: article?.id })
          );
      if (res.success) {
        notify({
          title: `Article was successfully ${
            !isUserFavouriteArticle.value ? "added to" : "removed from"
          } favourites`,
          type: "success",
        });
      }
      isUserFavouriteArticle.value = !isUserFavouriteArticle.value;
    };

    const handleRatingClick = () => {
      if (!checkUserSessionExist()) return;
      togglePopupRating(true);
    };

    const handleSendClick = () => {
      if (!checkUserSessionExist()) return;
      togglePopupSendToUser(true);
    };

    const removeArticle = async () => {
      const id = article?.id;
      callApi("article", "delete", { id }).then((res) => {
        if (res.success) emit("articleRemove", id);
        return;
      });
    };

    const socialMenu = () => {
      socialMenuVisible.value = !socialMenuVisible.value;
    };

    return {
      isActive,
      path,
      popupRatingIsOpen,
      togglePopupRating,
      popupSendToUserIsOpen,
      togglePopupSendToUser,
      isUserFavouriteArticle,
      redirectArticle,
      redirectNode,
      handleAddToFavourites,
      handleRatingClick,
      handleSendClick,
      loading,
      node_id,
      socialMenu,
      socialMenuVisible,
      removeArticle,
      isAdmin,
      articleRating,
    };
  },
};
</script>
