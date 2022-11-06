<template>
  <swiper
    :spaceBetween="30"
    :centeredSlides="true"
    :navigation="true"
    :loop="true"
    v-if="screenWidth > 960"
  >
    <swiper-slide>
      <div class="tile-element" @click="redirectArticle">
        <div class="video-iframe" v-if="iframeVisible">
          <iframe
            width="415"
            height="250"
            :src="videoEmbed"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="img" @click.stop="showIframe" v-else>
          <img :src="path" alt="" />
          <div class="play-video" v-if="isYoutubeLink && !iframeVisible">
            <IconPlay />
          </div>
        </div>
        <p class="article-date">{{ article.updated_at.slice(0, 10) }}</p>
        <div class="content">
          <h4 class="title">{{ article.title }}</h4>
          <p class="text">{{ article.description }}</p>
          <p class="tldr-text text">{{ article.tldr }}</p>
          <p class="iframe">{{ article.iframe }}</p>
        </div>
        <div @click.stop class="more-cta" v-if="article.pages.length > 0">
          More 1/{{ article.pages.length + 1 }}
        </div>
        <div class="buttons">
          <button
            class="find-simillar-tile"
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
                  <ShareNetwork
                    network="twitter"
                    :url="article.iframe"
                    title=""
                  >
                    <twitter />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="facebook"
                    :url="article.iframe"
                    title=""
                  >
                    <facebook />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="LinkedIn"
                    :url="article.iframe"
                    title=""
                  >
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
          <div class="rating-icon">
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
          </div>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide
      v-if="article.pages.length > 0"
      v-for="page in article.pages"
      :key="page"
    >
      <div class="tile-element" @click="redirectArticle">
        <div class="page-img" v-if="page.files.length > 0">
          <img
            :src="'https://static-test.library.one/' + page.files[0]"
            alt=""
          />
        </div>
        <div class="page-img" v-if="page.files.length > 1">
          <img
            :src="'https://static-test.library.one/' + page.files[1]"
            alt=""
          />
        </div>
        <p class="article-date">{{ article.updated_at.slice(0, 10) }}</p>
        <div
          class="content page-content"
          :style="
            page.files.length > 1
              ? 'width: 700px'
              : 'max-width: 100% !important'
          "
        >
          <div class="text">{{ page.description }}</div>
        </div>
        <div @click.stop class="more-cta" v-if="article.pages.length > 0">
          More
          <div class="">
            {{ page.page_number }}/{{ article.pages.length + 1 }}
          </div>
        </div>
        <div class="buttons">
          <button
            class="find-simillar-tile"
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
                  <ShareNetwork
                    network="twitter"
                    :url="article.iframe"
                    title=""
                  >
                    <twitter />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="facebook"
                    :url="article.iframe"
                    title=""
                  >
                    <facebook />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="LinkedIn"
                    :url="article.iframe"
                    title=""
                  >
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
          <div class="rating-icon">
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
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>

  <!-- mobile tiles  -->
  <swiper
    :spaceBetween="30"
    :centeredSlides="true"
    :navigation="true"
    :loop="true"
    v-else
  >
    <swiper-slide>
      <div class="tile-mobile" @click="redirectArticle">
        <div class="tile-header" :style="headerStyle">
          <div class="video-iframe" v-if="iframeVisible">
            <iframe
              style="margin-bottom: 15px"
              width="100%"
              height="215"
              :src="videoEmbed"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div
            class="img"
            v-if="!iframeVisible"
            @click.stop="showIframe"
            :style="imgStyle"
          >
            <img :src="path" alt="" :style="image" />
            <div class="play-video" v-if="isYoutubeLink && !iframeVisible">
              <IconPlay />
            </div>
          </div>
          <h4 class="title" :style="titleStyle">{{ article.title }}</h4>
        </div>
        <div class="content" :style="contentStyle">
          <p class="text" :style="descriptionStyle">
            {{ article.description }}
          </p>
          <p class="tldr-text text" v-if="!isYoutubeLink">{{ article.tldr }}</p>
          <p class="iframe">{{ article.iframe }}</p>
        </div>
        <div class="buttons">
          <button
            class="find-simillar-tile"
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
                  <ShareNetwork
                    network="twitter"
                    :url="article.iframe"
                    title=""
                  >
                    <twitter />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="facebook"
                    :url="article.iframe"
                    title=""
                  >
                    <facebook />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="LinkedIn"
                    :url="article.iframe"
                    title=""
                  >
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
          <div class="rating-icon">
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
          </div>
          <!-- mobile more cta -->
          <div @click.stop class="more-cta" v-if="article.pages.length > 0">
            More
            <div class="more-number">1/{{ article.pages.length + 1 }}</div>
          </div>
        </div>
      </div>
    </swiper-slide>

    <!-- mobile pages tiles -->
    <swiper-slide
      v-if="article.pages.length > 0"
      v-for="page in article.pages"
      :key="page"
    >
      <div class="tile-mobile" @click="redirectArticle">
        <div class="img-wrapper">
          <div class="page-img" v-if="page.files.length > 0">
            <img
              :src="'https://static-test.library.one/' + page.files[0]"
              alt=""
            />
          </div>
          <div class="page-img" v-if="page.files.length > 1">
            <img
              :src="'https://static-test.library.one/' + page.files[1]"
              alt=""
            />
          </div>
        </div>
        <div
          class="content page-content"
          :style="page.files.length > 0 ? 'height: 50%' : 'height: 80%'"
        >
          <div
            class="text"
            :style="
              page.files.length > 0
                ? '-webkit-line-clamp: 13;'
                : '-webkit-line-clamp: 21;'
            "
          >
            {{ page.description }}
          </div>
        </div>
        <div class="buttons page-buttons">
          <button
            class="find-simillar-tile"
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
                  <ShareNetwork
                    network="twitter"
                    :url="article.iframe"
                    title=""
                  >
                    <twitter />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="facebook"
                    :url="article.iframe"
                    title=""
                  >
                    <facebook />
                  </ShareNetwork>
                </div>
                <div class="social-article-elem">
                  <ShareNetwork
                    network="LinkedIn"
                    :url="article.iframe"
                    title=""
                  >
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
          <div class="rating-icon">
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
          </div>
          <!-- mobile more cta pages -->
          <div @click.stop class="more-cta" v-if="article.pages.length > 0">
            More
            <div class="more-number">
              {{ page.page_number }}/{{ article.pages.length + 1 }}
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
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

<script lang="ts">
import { computed, onMounted, ref } from "vue";
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
import IconPlay from "../icons/IconPlay.vue";
import facebook from "../icons/facebook.vue";
import twitter from "../icons/twitter.vue";
import linkedin from "../icons/linkedin.vue";
import mail from "../icons/mail.vue";
import user from "../icons/user.vue";
import { defineComponent } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper.scss";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper/core";

SwiperCore.use([Autoplay, Pagination, Navigation]);

export default defineComponent({
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
    IconPlay,
    PopupSendToUser,
    facebook,
    twitter,
    linkedin,
    mail,
    user,
    Swiper,
    SwiperSlide,
  },
  props: {
    article: {
      type: Object,
    },
    is_favourite: {
      type: Boolean,
    },
  },
  setup({ article }) {
    const popupRatingIsOpen = ref(false);
    const popupSendToUserIsOpen = ref(false);
    const isActive = ref(false);
    const router = useRouter();
    const route = useRoute();
    const node_id = +route.params.id;
    const { loading, fetchData } = useFetch();
    const isUserFavouriteArticle = ref(article?.is_my_favourite);
    const socialMenuVisible = ref(false);
    const iframeVisible = ref(false);
    const screenWidth = window.innerWidth;

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

    const pagePath_1 = computed(() => {
      return `https://static-test.library.one/article_pages/${article.pages[0].id}/big_1.jpg`;
    });

    const pagePath_2 = computed(() => {
      return `https://static-test.library.one/article_pages/39/big_2.jpg`;
    });

    const videoEmbed = computed(() => {
      const link = article.iframe;
      const embed = link.replace("watch?v=", "embed/");
      return embed;
    });

    const isYoutubeLink = computed(() => {
      return article.iframe.includes("youtube");
    });

    const headerStyle = computed(() => {
      if (!isYoutubeLink.value) return;
      return {
        display: "block",
        margin: "0",
      };
    });

    const descriptionStyle = computed(() => {
      if (!isYoutubeLink.value && article.tldr === null)
        return {
          "-webkit-line-clamp": "15",
        };
      if (!isYoutubeLink.value) return;
      return {
        "-webkit-line-clamp": "5",
      };
    });

    const titleStyle = computed(() => {
      if (!isYoutubeLink.value) return;
      return {
        height: "34px",
        "margin-bottom": "10px",
      };
    });

    const contentStyle = computed(() => {
      if (!isYoutubeLink.value) return;
      return {
        height: "28%",
      };
    });

    const imgStyle = computed(() => {
      if (isYoutubeLink.value) {
        return {
          height: "215px",
          position: "relative",
          display: "flex",
          "justify-content": "center",
          overflow: "hidden",
          "border-radius": "10px",
          "margin-bottom": "15px",
        };
      }
    });

    const image = computed(() => {
      if (isYoutubeLink.value) {
        return {
          height: "215px",
          "margin-right": "0",
        };
      }
    });

    const articleRating = computed(() => {
      const articleRate = article.rating / 10;
      return parseFloat(articleRate.toFixed(1));
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

    const showIframe = () => {
      if (!isYoutubeLink.value) return;
      iframeVisible.value = true;
    };

    const handleRatingClick = () => {
      if (!checkUserSessionExist()) return;
      togglePopupRating(true);
    };

    const handleSendClick = () => {
      if (!checkUserSessionExist()) return;
      togglePopupSendToUser(true);
    };

    const socialMenu = () => {
      socialMenuVisible.value = !socialMenuVisible.value;
      const swiperBtn = document.querySelectorAll(".swiper-button-next");
      if (socialMenuVisible.value) {
        swiperBtn.forEach((elem) => (elem.style.display = "none"));
        return;
      }
      swiperBtn.forEach((elem) => (elem.style.display = "block"));
    };

    onMounted(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    });

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
      pagePath_1,
      pagePath_2,
      videoEmbed,
      isYoutubeLink,
      iframeVisible,
      showIframe,
      headerStyle,
      contentStyle,
      imgStyle,
      image,
      titleStyle,
      descriptionStyle,
      screenWidth,
      articleRating,
    };
  },
});
</script>
