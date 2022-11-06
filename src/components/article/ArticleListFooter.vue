<template>
  <div class="article-list__footer footer" :style="footerStyle">
    <InfoButton />
    <HomeButton />
    <BackButton />
    <AddButton
      :disabled="node_id < 2"
      :loading="loading"
      :is_favourite="is_favourite"
      :titleVisible="true"
      @click="addNodeToFavourites"
      v-if="screenWidth > 960"
    />
    <MobileAddButton
      :disabled="node_id < 2"
      :loading="loading"
      :is_favourite="is_favourite"
      :titleVisible="true"
      @click="addNodeToFavourites"
      v-else
    />
    <div class="cloud-button">
      <CloudButton :id="node_id" />
    </div>
    <div class="cloud-button-mobile">
      <CloudButtonMobile :id="node_id" />
    </div>
    <div class="ranges">
      <div :class="{ disabled: !timeline }" class="range">
        <label>New</label>
        <BaseTooltip
          :message="timeline_range_enum[filter.created_at || 0].label"
        >
          <input
            :disabled="!timeline"
            :value="filter.created_at"
            autocomplete="off"
            max="10"
            min="0"
            step="1"
            type="range"
            @input="handleTimelineRange"
          />
        </BaseTooltip>
        <BaseCheckBox v-model="timeline" @click="handleOrderBy" />
        <label style="margin-right: 36px; margin-left: -25px">Old</label>
      </div>
      <div :class="{ disabled: !is_rating }" class="range">
        <label>Rating</label>
        <BaseTooltip :message="filter.rating">
          <input
            :disabled="!is_rating"
            :value="filter.rating"
            autocomplete="off"
            class="range__rating"
            max="100"
            min="0"
            type="range"
            @input="handleRatingRange"
          />
        </BaseTooltip>
        <BaseCheckBox v-model="is_rating" @click="handleOrderBy" />
        <label style="margin-left: -25px">Best Only</label>
      </div>
    </div>

    <!-- mobile range menu -->
    <div class="mobile-ranges">
      <div :class="{ disabled: !timeline }" class="range">
        <BaseTooltip
          :message="timeline_range_enum[filter.created_at || 0].label"
        >
        </BaseTooltip>
        <BaseCheckBox v-model="timeline" @click="handleOrderBy" />
        <label class="mobile-range-label">New</label>
      </div>
      <div :class="{ disabled: !is_rating }" class="range">
        <BaseTooltip :message="filter.rating"> </BaseTooltip>
        <BaseCheckBox v-model="is_rating" @click="handleOrderBy" />
        <label class="mobile-range-label">Rating</label>
      </div>
    </div>
    <MobileBackButton v-if="screenWidth < 960" />
    <SendButton v-if="screenWidth > 960" />
    <SendButtonMobile v-else />
    <MailButton :disabled="!is_author" />
    <TButton />
    <BaseButton color="transparent" variant="flat" id="languageBtn">
      <ArticleLanguage v-model="lang" />
      <div class="desc">Language</div>
    </BaseButton>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from "vue";
import BaseCheckBox from "../common/BaseCheckBox.vue";
import BaseButton from "../common/BaseButton.vue";
import ArticleLanguage from "./ArticleLanguage.vue";
import InfoButton from "../footer/InfoButton.vue";
import AddButton from "../footer/AddButton.vue";
import MobileAddButton from "../footer/mobileAddButton.vue";
import BackButton from "../footer/BackButton.vue";
import MobileBackButton from "../footer/MobileBackButton.vue";
import HomeButton from "../footer/HomeButton.vue";
import CloudButton from "../footer/CloudButton.vue";
import CloudButtonMobile from "../footer/CloudButtonMobile.vue";
import SendButton from "../footer/SendButton.vue";
import SendButtonMobile from "../footer/SendButtonMobile.vue";
import MailButton from "../footer/MailButton.vue";
import TButton from "../footer/TButton.vue";
import { useFetch } from "../../hooks/useFetch";
import {
  clearOneFilter,
  filter,
  scrollTop,
  setFilter,
  setOrderBy,
  timeline_range_enum,
} from "./articleData.js";
import BaseTooltip from "../common/BaseTooltip.vue";
import { callApi } from "../../api/callApi";
import { is_logged, user_session, is_author } from "../../session";
import store from "../../store";
import { role_enum } from "../../enum/roleEnum";
import { notify } from "@kyvg/vue3-notification";
import { useRoute } from "vue-router";
import bubble_enum from "../../enum/bubbleEnum";

export default {
  name: "ArticleListFooter",
  components: {
    BaseTooltip,
    TButton,
    MailButton,
    SendButton,
    SendButtonMobile,
    CloudButton,
    HomeButton,
    BackButton,
    MobileBackButton,
    AddButton,
    InfoButton,
    ArticleLanguage,
    BaseButton,
    BaseCheckBox,
    MobileAddButton,
    CloudButtonMobile,
  },
  setup() {
    const timeline = ref(true);
    const is_rating = ref(false);
    const is_favourite = ref();
    const route = useRoute();
    const node_id = +route.params.id;
    const lang = ref("en");
    const { loading, fetchData } = useFetch();
    const screenWidth = window.innerWidth;

    const checkUserSessionExist = () => {
      if (!user_session.value) {
        store.triggerPopup("SignIn");
        return false;
      }
      return true;
    };

    const handleRatingRange = (e) => {
      setFilter("rating", +e.target.value);
      scrollTop();
    };

    const handleTimelineRange = (e) => {
      setFilter("created_at", +e.target.value);
      scrollTop();
    };

    const handleOrderBy = () => {
      setOrderBy(timeline, is_rating);
    };

    const checkIsFavouriteNode = async () => {
      const res = await callApi("favourite-node", "checkIfNodeIsFavourite", {
        node_id,
      });
      if (res.success) {
        is_favourite.value = res.is_favourite;
      }
    };

    const addNodeToFavourites = async () => {
      if (!checkUserSessionExist()) return;
      const res = !is_favourite.value
        ? await fetchData(() =>
            callApi("favourite-node", "create", { node_id })
          )
        : await fetchData(() =>
            callApi("favourite-node", "delete", { node_id })
          );
      if (res.success) {
        notify({
          title: `Node was successfully ${
            !is_favourite.value ? "added to" : "removed from"
          } favourites`,
          type: "success",
        });
        is_favourite.value = !is_favourite.value;
      }
    };

    const isStandalone = computed(() => {
      return window.matchMedia("(display-mode: standalone)").matches;
    });

    const footerStyle = computed(() => {
      return isStandalone.value ? "bottom: 7px" : "bottom: 0";
    });

    watch(
      () => is_rating.value,
      (val) => {
        if (val) {
          setFilter("rating", 0);
        } else {
          clearOneFilter("rating");
        }
        scrollTop();
      }
    );

    watch(
      () => timeline.value,
      (val) => {
        if (val) {
          setFilter("timeline", 0);
        } else {
          clearOneFilter("created_at");
        }
        scrollTop();
      }
    );

    onMounted(async () => {
      if (
        is_logged.value &&
        node_id &&
        ![bubble_enum.favourites, bubble_enum.popular].includes(node_id)
      ) {
        await checkIsFavouriteNode();
      }
      const setLang = localStorage.getItem("setLang");
      if (setLang) {
        lang.value = setLang;
      } else lang.value = "en";
    });

    return {
      timeline,
      is_rating,
      lang,
      is_favourite,
      loading,
      node_id,
      is_author,
      timeline_range_enum,
      filter,
      user_session,
      role_enum,
      addNodeToFavourites,
      handleRatingRange,
      handleTimelineRange,
      handleOrderBy,
      screenWidth,
      footerStyle,
    };
  },
};
</script>

<style scoped>
.cloud-button-mobile {
  height: 60px;
}

@media (min-width: 960px) {
  .cloud-button-mobile {
    display: none;
  }
}

@media (max-width: 960px) {
  .cloud-button {
    display: none;
  }
}
</style>
