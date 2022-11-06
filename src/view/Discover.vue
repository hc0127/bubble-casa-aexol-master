<template>
  <Header transparent />
  <SearchBar
    v-if="searchbarVisible"
    @closeSearch="closeSearch"
    @changeTag="changeTag"
  />
  <!-- v-if="firstSession && !user_session" -->
  <div
     class="first-session-box">
    Click on the Nodes to navigate, then click the center Node to see the articles.
  </div>
  <div class="discover-wrapper">
    <div class="discover-breadcrumbs">
      <div
        v-for="breadcrumb in breadcrumbs"
        :key="breadcrumb.id"
        :style="breadcrumb.id === 1 ? 'color: black' : ' color: #940E49'"
      >
        <div @click="bubbleFromTag(breadcrumb.id)" class="discover-broadcrumb">
          {{ breadcrumb.name === "root" ? "/ Discover" : breadcrumb.name }}
        </div>
      </div>
    </div>
    <div class="fav-nodes-desktop" v-if="isUserLogin">
      <div class="fav-nodes-elem-wrapper">
        <div v-for="favNode in favoriteNodesArr" :key="favNode.id">
          <div
            class="fav-node"
            @click="bubbleFromTag(favNode.id)"
            v-if="
              favNode.id != -6 &&
              favNode.id != -4 &&
              favNode.id != -3 &&
              favNode.id != -5 &&
              favNode.id != 0
            "
          >
            {{ favNode.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="fav-nodes-mobile">
      <div class="fav-nodes-elem-wrapper" v-if="favNodeList"
      >
        <div v-for="favNode in favoriteNodesArr" :key="favNode.id">
          <div
            class="fav-node"
            @click="
              bubbleFromTag(favNode.id);
              openFavList();
            "
            v-if="
              favNode.id != -6 &&
              favNode.id != -4 &&
              favNode.id != -3 &&
              favNode.id != -5 &&
              favNode.id != 0
            "
          >
            {{ favNode.name }}
          </div>
        </div>
      </div>
      <div class="fav-nodes-title" @click="openFavList">Favourite Nodes</div>
    </div>
    <div class="mobile-search" @click="openSearchbar">Search</div>
    <div class="spacebar-search">
      <IconInfoSmall />
      Press
      <button id="spaceButton" @keyup.space="openSearchbar">SPACEBAR</button> to
      search
    </div>
    <div class="feedback" @click="feedbackRedirect">
      <IconChain v-if="screenWidth > 960" />
      <div class="request">Node request</div>
      <div class="community">/ Community</div>
    </div>
    <div
      class="highlight"
      @click="hightlightNodes"
      @mouseover="highlightTipVisible = true"
      @mouseleave="highlightTipVisible = false"
      v-if="user_session?.session.role_id === 2"
    >
      <div class="hightlight-tip" v-if="highlightTipVisible">
        Highlights nodes where you can post
      </div>
      <div class="highlight-button">
        <IconViewfinder />
        Highlight source nodes
      </div>
    </div>
    <div id="main_pan_screen" class="discover">
      <div class="center-circle" v-if="firstSession && !user_session"></div>
      <div>
        <BubbleComponent
          :bubble="mainBubble"
          :panEnded="panEnded"
          :screenCenter="screenCenter"
          :position="pos"
          :multipliers="multipliers"
          :panTo="panTo"
          :index="1"
          :panPassedProps="panPassedProps"
          :siblingsLength="1"
          @changeTag="changeTag"
          @addToFav="addToFav"
          :favNodes="favoriteNodesArr"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import {
  fetchSingleNodeTree,
  tags_list,
} from "../components/discover/discoverApi";
import { useRouter, useRoute } from "vue-router";
import Header from "../components/header/Header.vue";
import IconHome from "../components/icons/IconHome.vue";
import IconInfoSmall from "../components/icons/IconInfoSmall.vue";
import IconChain from "../components/icons/IconChain.vue";
import IconViewfinder from "../components/icons/IconViewfinder.vue";
import bubble_enum from "../enum/bubbleEnum";
import BubbleComponent from "../components/discover/BubbleComponent.vue";
import ArticleBreadcrumbs from "../components/header/ArticleBreadcrumbs.vue";
import {
  BubbleNode,
  PanToFunction,
  PanToFunctionProps,
  Position,
} from "../types/index";
import { BASE_RADIUS_MULTIPLIER } from "../components/discover/const";
import Panzoom from "@panzoom/panzoom";
import { Vector } from "../components/discover/math";
import anime from "animejs";
import { callApi } from "../api/callApi";
import { user_session } from "../session";
import { isFirstVisit } from "../session/firstVisit";
import SearchBar from "../components/discover/SearchBar.vue";
import store from "../store";
import { allowStatus } from "../components/discover/highlightHelper";
const { vectorFrom, length } = Vector();
let panAnimationLocked = false;
export default {
  name: "Discover",
  components: {
    IconHome,
    IconInfoSmall,
    IconChain,
    IconViewfinder,
    BubbleComponent,
    Header,
    ArticleBreadcrumbs,
    SearchBar,
  },
  setup() {
    const screenWidth = window.innerWidth;
    const highlightTipVisible = ref(false);
    const searchbarVisible = ref(false);
    const router = useRouter();
    const route = useRoute();
    const breadcrumbs = ref([]);
    const mainBubble = ref<BubbleNode>({
      id: 0,
      name: "search",
    });
    const firstSession = isFirstVisit();
    const about_is_visible = ref(false);
    const windowWidth = ref(window.innerWidth);
    const windowHeight = ref(window.innerHeight);
    const pos = ref<Position>({
      x: windowWidth.value / 2,
      y: windowHeight.value / 2,
    });
    const panPassedProps = ref<PanToFunctionProps | undefined>({
      position: { x: 0, y: 0 },
      id: 0,
    });
    const panTo = ref<PanToFunction>(() => {});
    const panEnded = ref({
      x: 0,
      y: 0,
    });
    const screenCenter = {
      x: -windowWidth.value / 2,
      y: -windowHeight.value / 2,
    };
    const favoriteNodesArr = ref([]);
    const favNodeList = ref(false);
    const baseRadius =
      BASE_RADIUS_MULTIPLIER *
      (windowWidth.value > windowHeight.value
        ? windowHeight.value
        : windowWidth.value);
    const isUserLogin = computed(() => {
      return user_session.value;
    });

    const breadCrumbsStyle = computed(() => {});

    const changeTag = async (value: number) => {
      try {
        router.replace({ query: { node: value } });
        const res = await fetchSingleNodeTree(value);
        const combinedRes = {
          ...res.main,
          child: {
            child: res.child,
          },
        };
        mainBubble.value = combinedRes;
      } catch (e) {
        router.push("/404");
      }
      searchbarVisible.value = false;
      const spaceButton = document.getElementById("spaceButton");
      spaceButton?.focus();
    };
    watch(user_session, () => {
      favoriteNodes();
    });

    const addToFav = () => {
      favoriteNodes();
    };
    const updateBreadcrumbs = async () => {
      const res = await callApi("node", "getPathForNode", {
        node_id: mainBubble.value.id,
      });
      breadcrumbs.value = res.result.map((node: any) => {
        return { name: node.name, id: node.id };
      });
    };
    const bubbleFromTag = async (id: number) => {
      const res = await fetchSingleNodeTree(id);
      const combinedRes = {
        ...res.main,
        child: {
          child: res.child,
        },
      };
      mainBubble.value = combinedRes;
      if (panPassedProps.value) panPassedProps.value.id = id;
      router.replace({ query: { node: id } });
      updateBreadcrumbs();
    };
    const favoriteNodes = async () => {
      try {
        const res = await fetchSingleNodeTree(-2);
        const arr = Object.values(res.child);
        favoriteNodesArr.value = arr;
      } catch (e) {
        router.push("/404");
      }
    };
    const openFavList = () => {
      if (user_session.value) {
        favNodeList.value = !favNodeList.value;
      } else {
        store.triggerPopup("SignIn");
      }
    };

    const feedbackRedirect = () => {
      window.open("https://feedback.library.one/", "_blank");
    };

    const openSearchbar = () => {
      searchbarVisible.value = !searchbarVisible.value;

      setTimeout(() => {
        const searchbar = document.querySelector("#searchbar");
        searchbar.focus();
      }, 100);
    };

    const hightlightNodes = () => {
      allowStatus.value = !allowStatus.value;
    };

    const closeSearch = () => {
      searchbarVisible.value = false;
      const spaceButton = document.getElementById("spaceButton");
      spaceButton?.focus();
    };

    onMounted(async () => {
      const id = +route.query.node || 0;
      try {
        const res = await fetchSingleNodeTree(id);
        const combinedRes = {
          ...res.main,
          child: {
            child: res.child,
          },
        };
        mainBubble.value = combinedRes;
        updateBreadcrumbs();
        favoriteNodes();
        const elem = document.getElementById("main_pan_screen");
        if (!elem) {
          throw new Error("No element for pan");
        }
        const panzoom = Panzoom(elem, {
          maxScale: 5,
          setTransform: () => {},
        });
        elem.addEventListener("panzoomchange", (event) => {
          const typedE = event as unknown as {
            detail: {
              x: number;
              y: number;
            };
          };
          pos.value.x = typedE.detail.x + -screenCenter.x;
          pos.value.y = typedE.detail.y + -screenCenter.y;
        });
        elem.addEventListener("panzoomend", (event) => {
          const typedE = event as unknown as {
            detail: {
              x: number;
              y: number;
            };
          };
          pos.value.x = typedE.detail.x + -screenCenter.x;
          pos.value.y = typedE.detail.y + -screenCenter.y;
          panEnded.value.x = typedE.detail.x + -screenCenter.x;
          panEnded.value.y = typedE.detail.y + -screenCenter.y;
        });
        panTo.value = ({ position, id }) => {
          const moveValue = {
            x: position.x + screenCenter.x,
            y: position.y + screenCenter.y,
          };
          const startPan = panzoom.getPan();
          const moveVector = vectorFrom(startPan)(moveValue);
          const distance = Math.floor(length(moveValue));
          const isChild = mainBubble.value.child?.child.find((child) => {
            return child.id == id;
          });
          // checking if child is into child array of current parent.
          if (!panAnimationLocked && isChild) {
            panAnimationLocked = true;
            anime({
              targets: startPan,
              x: moveVector.x,
              y: -moveVector.y,
              duration: distance * 2,
              easing: "easeInOutQuad",
              update: () => {
                panzoom.pan(startPan.x, startPan.y);
                const arrowHead = document.querySelectorAll("#arrowhead");
                for (var i = 0; i < arrowHead.length; ++i) {
                  arrowHead[i].classList.add("disabled");
                }
              },
              complete: () => {
                panAnimationLocked = false;
                if (
                  panPassedProps.value?.id === id &&
                  panPassedProps.value?.id !== 0
                ) {
                  return;
                }
                fetchSingleNodeTree(id).then((res) => {
                  const combinedRes = {
                    ...res.main,
                    child: {
                      child: res.child,
                    },
                  };
                  mainBubble.value = combinedRes;
                  const arrowHead = document.querySelectorAll("#arrowhead");
                  for (var i = 0; i < arrowHead.length; ++i) {
                    arrowHead[i].classList.add("enabled");
                  }
                  panPassedProps.value = {
                    id,
                    position,
                  };
                  updateBreadcrumbs();
                  router.replace({ query: { node: id } });
                  panzoom.pan(0, 0);
                });
              },
            });
          }
          if (!isChild) {
            panzoom.pan(0, 0);
            const arrowHead = document.querySelectorAll("#arrowhead");
            for (let i = 0; i < arrowHead.length; ++i) {
              arrowHead[i].classList.add("enabled");
            }
          }
        };
        window.addEventListener("resize", () => {
          windowWidth.value = window.innerWidth;
          windowHeight.value = window.innerHeight;
        });
      } catch (e) {
        router.push("/404");
      }
      if (firstSession) {
        store.triggerPopup("hiw");
      }
    });
    return {
      pos,
      mainBubble,
      screenCenter,
      panEnded,
      tags_list,
      bubble_enum,
      panTo,
      panPassedProps,
      about_is_visible,
      multipliers: {
        baseRadius,
      },
      changeTag,
      updateBreadcrumbs,
      breadcrumbs,
      bubbleFromTag,
      favoriteNodes,
      favoriteNodesArr,
      favNodeList,
      openFavList,
      addToFav,
      isUserLogin,
      feedbackRedirect,
      firstSession,
      user_session,
      openSearchbar,
      searchbarVisible,
      closeSearch,
      hightlightNodes,
      highlightTipVisible,
      screenWidth,
      breadCrumbsStyle,
    };
  },
};
</script>
