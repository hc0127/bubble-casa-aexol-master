<template>
  <div
    :class="classCss"
    :id="bubble.id"
    :style="style"
    @pointerdown="pointerDown"
    @pointerup="pointerUp"
    v-on:mouseover="isHover = true"
    v-on:mouseleave="isHover = false"
  >
    <div
      class="bookmark-bubble"
      @pointerdown.stop
      @pointerup.stop="addNodeToFavourites"
      v-if="
        !isClosest &&
        isUserLogin &&
        bubble.name != 'popular' &&
        bubble.name != 'search' &&
        bubble.name != 'root' &&
        bubble.name != 'favourites' &&
        bubble.id != -6 &&
        bubble.id != -4 &&
        bubble.id != -3 &&
        bubble.id != -5 &&
        bubble.id != -10
      "
    >
      <BookmarkButton :titleVisible="false" :is_favourite="isNodeInFavorite" />
    </div>
    <div
      class="click-me-wrapper"
      v-if="
        bubble.image &&
        bubble.id != 1 &&
        !isClosest &&
        !isUserLogin &&
        !bubble.is_half_image
      "
    >
      <h1 class="click-me">SHOW ARTICLES</h1>
    </div>
    <img
      v-if="(bubble.image && !bubble.is_half_image) || bubble.id < 0"
      :src="getImage"
      class="bubble__full"
      alt="Library node image"
    />
    <div
      v-else-if="bubble.id === 0"
      class="discover__text"
      v-click-outside="handleClose"
    >
      <div class="desc">
        <svg viewBox="0 0 200 75" xmlns="http://www.w3.org/2000/svg">
          <text x="30" y="45" font-size="23" fill="white">SEARCH FOR</text>
          <text x="25" y="73" font-size="20" fill="white">YOUR INTEREST</text>
        </svg>
      </div>
      <div class="discover__input">
        <BaseInput
          id="mainSearch"
          hide_error
          placeholder="Search"
          @input="handleSearchInput"
          @pointerdown.stop
          @pointerup.stop
          @redirect="redirectToArticle"
          :disabled="searchVisible"
          @click="handleOpen"
        >
        </BaseInput>
        <svg
          viewBox="0 0 200 40"
          xmlns="http://www.w3.org/2000/svg"
          v-if="screenWidth > 960"
        >
          <text x="85" y="15" font-size="10" fill="white">OR USE</text>
          <text
            x="47"
            y="30"
            font-size="10"
            fill="white"
            text-decoration="underline"
            @pointerdown.stop
            @pointerup.stop="advancedSearch"
          >
            ADVANCED AI SEARCH
          </text>
        </svg>
        <p
          @pointerdown.stop
          @pointerup.stop="advancedSearch"
          class="ai-search"
          v-else
        >
          AI SEARCH
        </p>
        <div
          class="discover__result"
          @pointerdown.stop
          @pointerup.stop
          v-if="listVisible"
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
    </div>
    <div
      v-else-if="bubble.is_half_image"
      :style="{ backgroundColor: bubble.bg_color }"
      class="bubble__half"
    >
      <div class="bubble__half-img">
        <div
          class="click-me-half-wrapper"
          v-if="
            bubble.image &&
            bubble.id != 1 &&
            !isClosest &&
            !isUserLogin &&
            bubble.is_half_image
          "
        >
          <h1 class="click-me-half">SHOW ARTICLES</h1>
        </div>
        <img :src="getImage" />
      </div>
      <div class="bubble__half-content">
        <div class="name-wrapper" :class="{ centered: bubble.name.length < 6 }">
          <span class="name" :style="nameStyle">
            {{ bubble.name }}
          </span>
          <span class="name-second" :style="nameSecoundStyle">
            {{ bubble.name_second }}
          </span>
        </div>
        <div class="key-wrapper">
          <div
            v-for="keyword in bubble.keywords"
            :key="keyword.id"
            class="key-item"
            :style="keywordStyle"
          >
            {{ keyword }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      :style="{ backgroundColor: bubble.bg_color }"
      class="bubble__no-image"
    >
      <div :style="{ color: bubble.accent_color }" class="name-second">
        {{ bubble.name_second }}
      </div>
      <div :style="nameStyleNoImage" class="name">
        {{ bubble.name }}
      </div>
      <div class="key-wrapper">
        <div
          v-for="keyword in bubble.keywords"
          :key="keyword.id"
          class="key-item"
        >
          {{ keyword }}
        </div>
      </div>
    </div>
  </div>
  <Bubble
    v-for="child in children"
    :key="child.child.id"
    :bubble="child.child"
    :position="child.position"
    :panEnded="panEnded"
    :parentId="bubble.id"
    :beforeNode="bubble.parent_id"
    :parentIsClosest="child.parentIsClosest"
    :parentBubbleScale="child.parentBubbleScale"
    :parentDistance="child.parentDistance"
    :parentPosition="child.parentPosition"
    :screenCenter="child.screenCenter"
    :isClosest="child.isClosest"
    :siblingsLength="children.length"
    :multipliers="multipliers"
    :index="child.idx"
    :panTo="panTo"
    :favNodes="favNodes"
  />
  <svg
    v-if="parentPosition && arrowVisible"
    class="discover__line"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      transform: `scale(${scale})`,
    }"
  >
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        :refX="arrowRef"
        refY="3.5"
        orient="auto"
        fill="white"
      >
        <polygon points="0 0, 5 3.5, 0 7" />
      </marker>
    </defs>
    <line
      :x1="parentPosition.x"
      :y1="parentPosition.y"
      :x2="transform.position.x"
      :y2="transform.position.y"
      :stroke="strokeStyle"
      :stroke-linecap="linecapStyle"
      :stroke-dasharray="dashStyle"
      marker-end="url(#arrowhead)"
    />
  </svg>
  <svg
    v-if="parentPosition && !arrowVisible"
    class="discover__line"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      transform: `scale(${scale})`,
    }"
  >
    <line
      :x1="parentPosition.x"
      :y1="parentPosition.y"
      :x2="transform.position.x"
      :y2="transform.position.y"
      :stroke="strokeStyle"
      :stroke-linecap="linecapStyle"
      :stroke-dasharray="dashStyle"
    />
  </svg>
</template>
<script lang="ts">
import {
  BubbleNode,
  PanToFunction,
  Position,
  PanToFunctionProps,
} from "../../types";
import {
  calculateDistance,
  calculateScale,
  determineChildPosition,
  Vector,
} from "./math";
import { DISTANCE, CLOSE_ENOUGH } from "./const";
import BaseInput from "../../components/common/BaseInput.vue";
import { getCenterOfElement } from "./getCenter";
import bubble_enum from "../../enum/bubbleEnum";
import { clearTagList, getNodeByTag, tags_list } from "./discoverApi";
import { createDebounce } from "../../helper/utils";
import PopularImage from "../../asset/images/popular.jpg";
import PopularImageHover from "../../asset/images/popular_hover.jpg";
import FavouritesImage from "../../asset/images/favourites.jpg";
import FavouritesImageHover from "../../asset/images/favourites_hover.jpg";
import Category1 from "../../asset/bubbles/category1.jpg";
import Category2 from "../../asset/bubbles/category2.jpg";
import Category3 from "../../asset/bubbles/category3.jpg";
import Category4 from "../../asset/bubbles/category4.jpg";
import Category5 from "../../asset/bubbles/category5.jpg";
import Articles from "../../asset/bubbles/articles.jpg";
import Authors from "../../asset/bubbles/authors.jpg";
import Bookmarks from "../../asset/bubbles/bookmarks.jpg";
import Recieved from "../../asset/bubbles/recieved.jpg";
import Discover from "../../asset/bubbles/root_discover.jpg";
import DisciverHover from "../../asset/bubbles/discover_hover.jpg";
import { bubbleScale } from "./discoverHelpers";
import { nextTick, Ref, watch } from "@vue/runtime-core";
import BookmarkButton from "../footer/BookmarkButton.vue";
import { callApi } from "../../api/callApi";
import { useFetch } from "../../hooks/useFetch";
import { user_session } from "../../session";
import { getNodeIndexFromCache } from "./cache";
import { allowStatus } from "./highlightHelper";
import vClickOutside from "click-outside-vue3";
const { angle, vectorFrom, length } = Vector();
const { fetchData } = useFetch();
export default {
  emits: ["changeTag", "addToFav"],
  name: "Bubble",
  components: { BaseInput, BookmarkButton },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    bubble: {},
    screenCenter: {},
    panEnded: {},
    position: {},
    isClosest: {},
    parentIsClosest: Boolean,
    parentDistance: {},
    parentPosition: {},
    panPassedProps: {},
    parentBubbleScale: Number,
    parentId: Number,
    beforeNode: Number,
    multipliers: {},
    panTo: {},
    siblingsLength: Number,
    index: Number,
    scale: Number,
    favNodes: {},
  },
  data() {
    return {
      screenWidth: window.innerWidth,
      mouseDownTime: new Date().valueOf(),
      mouseDownPosition: { x: 0, y: 0 },
      is_favourite: false,
      redirectPosible: false,
      isHover: false,
      isListOpen: true,
      hoverResizer: 0.05,
    };
  },
  setup(props) {
    const panEnded = props.panEnded as Ref<Position>;
    watch(panEnded, () => {
      const bubble = props.bubble as BubbleNode;
      const position = props.position as Position;
      const sce = props.screenCenter as Position;
      const distance = calculateDistance(
        {
          x: -sce.x,
          y: -sce.y,
        },
        position
      );
      if (distance < DISTANCE / 1.9) {
        const panTo = props.panTo as PanToFunction;
        panTo({
          position,
          id: bubble.id,
        });
      }
    });
  },
  computed: {
    zIndex() {
      const { name, id } = this.bubble as BubbleNode;
      const childNames = this.children.map((ch) => {
        return ch.child.name;
      });
      let zIndex = 0;
      if (name === "root") {
        zIndex = 100;
      }
      if (name === "favourites") {
        zIndex = 100;
      }
      if (name === "popular") {
        zIndex = 100;
      }
      if (name === "search") {
        zIndex = 104;
      } else {
        for (let i = 0; i < childNames.length; i++) {
          zIndex = 99 - i;
        }
      }
      return zIndex.toString();
    },
    style() {
      const { size, position, scale } = this.transform;
      return {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        top: position.y + "px",
        left: position.x + "px",
        transform:
          this.isHover && this.bubble.id != 0
            ? `translate(-50%, -50%) scale(${scale + this.hoverResizer})`
            : `translate(-50%, -50%) scale(${scale})`,
        zIndex: this.zIndex,
      } as Partial<CSSStyleDeclaration>;
    },
    strokeStyle() {
      const { include_article, parent_id } = this.bubble as BubbleNode;
      if (include_article === 0) {
        return `grey`;
      }
      return "white";
    },
    linecapStyle() {
      const { include_article } = this.bubble as BubbleNode;
      if (include_article === 0) {
        return `round`;
      }
    },
    dashStyle() {
      if (this.bubble.include_article === 0) {
        if (this.screenWidth > 960) return `0.1,20`;
        return `0.1,10`;
      }
    },
    nameStyle() {
      const { size } = this.transform;
      if (this.screenWidth > 960) {
        return {
          color: this.bubble.text_color,
          "font-size":
            this.bubble.name.length > 9 ? size / 16 + "px" : size / 10 + "px",
        };
      } else {
        return {
          color: this.bubble.text_color,
          "font-size":
            this.bubble.name.length > 14 ? size / 11 + "px" : size / 8 + "px",
        };
      }
    },
    nameStyleNoImage() {
      const { size } = this.transform;
      if (this.screenWidth > 960) {
        return {
          color: this.bubble.text_color,
          "font-size":
            this.bubble.name.length > 9 ? size / 10 + "px" : size / 10 + "px",
        };
      } else {
        return {
          color: this.bubble.text_color,
          "font-size":
            this.bubble.name.length > 14 ? size / 12 + "px" : size / 7 + "px",
        };
      }
    },
    nameSecoundStyle() {
      const { size } = this.transform;
      if (this.screenWidth > 960) {
        return {
          color: this.bubble.accent_color,
          "font-size":
            this.bubble.name_second?.length > 20 ? 10 + "px" : size / 20 + "px",
        };
      } else {
        return {
          color: this.bubble.accent_color,
          "font-size":
            this.bubble.name_second?.length > 20 ? 9 + "px" : size / 12 + "px",
        };
      }
    },
    keywordStyle() {
      const { size } = this.transform;
      if (this.screenWidth > 960) {
        return {
          "font-size": size / 20 + "px",
        };
      } else {
        return {
          "font-size": size / 20 + "px",
        };
      }
    },
    arrowRef() {
      return this.screenWidth > 960 ? "40" : "19";
    },

    arrowVisible() {
      const { parent_id } = this.bubble as BubbleNode;
      if (this.beforeNode === parent_id && parent_id != undefined) {
        return true;
      } else {
        return false;
      }
    },

    tagListSortedByLength() {
      return tags_list.data.sort((a, b) => a.tag.length - b.tag.length);
    },
    transform() {
      const isClosest = this.isClosest as "close" | "far" | undefined;
      const parentDistance = (this.parentDistance as number) || 0;
      const position = this.position as Position;
      const m = this.multipliers as Multipliers;
      const parentPosition = (this.parentPosition as Position) || undefined;
      // this.listOpened = false; // close tag list
      const siblingsLength =
        parentPosition && typeof this.siblingsLength === "number"
          ? this.siblingsLength + (this.parentIsClosest ? 1 : 0)
          : 0;
      const calcScale = calculateScale(DISTANCE);
      let scaleVector = 1.0;
      if (isClosest === "far") {
        scaleVector = calcScale(parentDistance * 1.5);
      }
      const siblingsMultiplier = bubbleScale(this.index, siblingsLength);
      const recalcPosition = parentPosition
        ? {
            x: parentPosition.x + (position.x - parentPosition.x) * scaleVector,
            y: parentPosition.y + (position.y - parentPosition.y) * scaleVector,
          }
        : position;
      const screenCenter = this.screenCenter as Position;
      const distance = calculateDistance(
        {
          x: -screenCenter.x,
          y: -screenCenter.y,
        },
        position
      );
      const HALF_DISTANCE = DISTANCE / 2.0;
      const otherScaleSize = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth > 2400) return 0.91;
        else return 1.01;
      };
      const mult = (() => {
        const otherSiblingsMultiplier =
          isClosest === "close" && distance < HALF_DISTANCE;
        const parentSiblingsMultiplier =
          !isClosest && distance >= HALF_DISTANCE;
        if (otherSiblingsMultiplier || parentSiblingsMultiplier) {
          const otherScale = otherScaleSize();
          if (otherSiblingsMultiplier) {
            const baseScale = this.parentBubbleScale || 1;
            const i = 1.0 - distance / HALF_DISTANCE;

            const arrowHead = document.querySelectorAll("#arrowhead");
            for (let i = 0; i < arrowHead.length; ++i) {
              arrowHead[i].classList.add("disabled");
            }

            return baseScale + (otherScale - baseScale) * i;
          }
          if (parentSiblingsMultiplier) {
            const baseScale = bubbleScale(
              this.closestChild?.child?.child.length || 1,
              (this.closestChild?.child?.child.length || 1) + 1
            );
            const i = 1.0 - (distance - HALF_DISTANCE) / HALF_DISTANCE;
            return baseScale + (otherScale - baseScale) * i;
          }
        }
        return siblingsMultiplier;
      })();
      return {
        scale: scaleVector,
        size: m.baseRadius * mult,
        position: recalcPosition,
      };
    },
    getImage() {
      const bubble = this.bubble as BubbleNode;
      if (bubble.id === bubble_enum.popular)
        return this.isHover ? PopularImageHover : PopularImage;
      if (bubble.id === bubble_enum.discover)
        return this.isHover ? DisciverHover : Discover;
      if (bubble.id === bubble_enum.favourites)
        return this.isHover ? FavouritesImageHover : FavouritesImage;
      if (bubble.id === bubble_enum.favourite) return Articles;
      if (bubble.id === bubble_enum.catalog_1) return Category1;
      if (bubble.id === bubble_enum.catalog_2) return Category2;
      if (bubble.id === bubble_enum.catalog_3) return Category3;
      if (bubble.id === bubble_enum.catalog_4) return Category4;
      if (bubble.id === bubble_enum.catalog_5) return Category5;
      if (bubble.id === bubble_enum.received) return Recieved;
      if (bubble.id === bubble_enum.authors) return Authors;
      if (bubble.id === bubble_enum.bookmark) return Bookmarks;
      return `https://static-test.library.one/node/${bubble.id}/big_${bubble.image}`;
    },
    classCss() {
      const bubble = this.bubble as BubbleNode;
      if (bubble.id === 0) {
        return "berry_background bubble";
      }
      if (bubble.name === "popular" || bubble.name === "favourites") {
        return "black_background bubble";
      }
      if (bubble.allow_to_post && allowStatus.value) {
        return "bubble bubble__half allow-active";
      }
      return "bubble bubble__half";
    },
    pan() {
      const { child, id } = this.bubble as BubbleNode;
      const position = this.position as Position;
      const parentPosition = (this.parentPosition as Position) || undefined;
      const isClosest = this.isClosest as "close" | "far" | undefined;
      const fromVector = parentPosition && vectorFrom(parentPosition)(position);
      const childIds = child?.child.map((c) => c.id) || [];
      const startingAngleValue = -0.25;
      if (typeof this.parentId !== "undefined") {
        childIds?.push(this.parentId);
      }
      childIds.sort((a, b) => a - b);
      const { getIndex, getStartingAngle } = getNodeIndexFromCache(
        id,
        childIds.join(",") || "noindex"
      );
      if (typeof this.parentId !== "undefined") {
        getIndex(this.parentId, child?.child.length || 1);
      }
      let startingAngle =
        isClosest === "close" && fromVector
          ? angle({ x: DISTANCE, y: 0 })(fromVector)
          : startingAngleValue;
      startingAngle = (fromVector?.y || 0) > 0 ? -startingAngle : startingAngle;
      startingAngle = getStartingAngle(startingAngle);
      const children =
        child?.child.map((c, index) => {
          return {
            ...c,
            idx: getIndex(c.id, index),
          };
        }) || [];
      return {
        startingAngle,
        children,
      };
    },
    closestChild() {
      const screenCenter = this.screenCenter as Position;
      const { startingAngle, children } = this.pan;
      const position = this.position as Position;
      const { id } = this.bubble as BubbleNode;
      const isClosest = this.isClosest as "close" | "far" | undefined;
      const childDistances =
        children.map((ch) =>
          calculateDistance(
            { x: -screenCenter.x, y: -screenCenter.y },
            determineChildPosition({
              distance: DISTANCE,
              maxNodes: (isClosest ? 1 : 0) + children.length,
              parentPosition: position,
            })({ index: ch.idx, startingAngle })
          )
        ) || [];
      const minChildDistance = Math.min(...childDistances);
      const minChildIndex = childDistances.indexOf(minChildDistance);
      if (minChildIndex === -1) {
        return;
      }
      const minChild = children[minChildIndex];
      return minChild;
    },
    children() {
      const { child, id } = this.bubble as BubbleNode;
      const isClosest = this.isClosest as "close" | "far" | undefined;
      const parentDistance = (this.parentDistance as number) || 0;
      const parentDistanceOverHalf =
        isClosest === "close" && parentDistance > DISTANCE / 3.0;
      if (!child?.child || !(!isClosest || parentDistanceOverHalf)) {
        return [];
      }
      const { startingAngle, children } = this.pan;
      const screenCenter = this.screenCenter as Position;
      const position = this.position as Position;
      const parentPosition = (this.parentPosition as Position) || undefined;
      const distance = calculateDistance(
        {
          x: -screenCenter.x,
          y: -screenCenter.y,
        },
        position
      );
      const calcScale = calculateScale(DISTANCE);
      let scaleVector = 1.0;
      if (isClosest === "far") {
        scaleVector = calcScale(parentDistance * 2);
      }
      const recalcPosition = parentPosition
        ? {
            x: parentPosition.x + (position.x - parentPosition.x) * scaleVector,
            y: parentPosition.y + (position.y - parentPosition.y) * scaleVector,
          }
        : position;
      return children.map((c) => {
        return {
          child: c,
          idx: c.idx,
          position: determineChildPosition({
            distance: DISTANCE,
            maxNodes: (isClosest ? 1 : 0) + child.child.length,
            parentPosition: position,
          })({
            index: c.idx,
            startingAngle,
          }),
          screenCenter,
          parentPosition: recalcPosition,
          parentDistance: distance,
          parentBubbleScale: bubbleScale(c.idx, children.length + 1),
          startingAngle,
          parentIsClosest: isClosest === "close",
          isClosest:
            !isClosest && c.id === this.closestChild?.id ? "close" : "far",
        };
      });
    },
    searchVisible() {
      if (this.$props.parentId == 0 || !this.$props.parentId) return false;
      return true;
    },
    listVisible() {
      return !this.searchVisible && this.isListOpen;
    },
    isUserLogin() {
      return user_session.value;
    },
    isNodeInFavorite() {
      const favNodes = this.favNodes;
      const bubbleId = this.bubble.node_id;
      const isFound = favNodes.some((element) => {
        if (element.id === bubbleId) {
          return true;
        }
        return false;
      });
      return isFound;
    },
  },
  methods: {
    handleClose() {
      this.isListOpen = false;
      const mainSearch = document.getElementById("mainSearch");
      mainSearch?.blur();
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
    handleSearchInput: async function (e: any) {
      clearTagList();
      const value = e.target.value;
      const debounce = createDebounce();
      debounce(() => {
        if (value.length > 1) {
          this.isListOpen = true;
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
    changeTagHandler(tag: number) {
      this.$emit("changeTag", tag);
    },
    pointerUp(e: MouseEvent) {
      const now = new Date().valueOf();
      const delta = now - this.mouseDownTime;
      const distance = length(
        vectorFrom(this.mouseDownPosition)({ x: e.clientX, y: e.clientY })
      );
      if (distance < 10) {
        this.clickBubble(this.bubble);
      }
    },
    pointerDown(e: MouseEvent) {
      if (e.button === 0) {
        this.mouseDownTime = new Date().valueOf();
        this.mouseDownPosition = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    },
    clickBubble(bubble: any) {
      this.mouseClicked = false;
      const screenCenter = this.screenCenter as Position;
      const bubbleElem = document.getElementById(bubble.id);
      const bubbleElemCenter = getCenterOfElement(bubbleElem);
      const distance = calculateDistance(
        {
          x: -screenCenter.x,
          y: -screenCenter.y,
        },
        bubbleElemCenter
      );
      if (distance < CLOSE_ENOUGH) {
        if (bubble.id === -3) {
          this.$router.push(`/articleList/favourite`);
        }
        if (bubble.id === -4) {
          this.$router.push(`/articleList/received`);
        }
        if (bubble.id === -5) {
          this.$router.push(`/articleList/authors`);
        } else if (bubble.id != -3 && bubble.id != -4 && bubble.id != -5) {
          if (bubble.id != 0) {
            this.$router.push(`/articleList/${bubble.id}`);
          }
          return;
        }
      } else {
        //po kliknieciu w bubbla
        const position = this.$props.position as Position;
        const panTo = this.$props.panTo as PanToFunction;
        panTo({
          position,
          id: bubble.id,
        });
        this.$router.replace({ query: { node: bubble.id } });
      }
    },
    async addNodeToFavourites() {
      const panPassedProps = this.panPassedProps as
        | PanToFunctionProps
        | undefined;
      const node_id = panPassedProps?.id;
      !this.is_favourite
        ? await fetchData(() =>
            callApi("favourite-node", "create", { node_id })
          ).then(() => this.$emit("addToFav"))
        : await fetchData(() =>
            callApi("favourite-node", "delete", { node_id })
          ).then(() => this.$emit("addToFav"));
      this.is_favourite = !this.is_favourite;
    },
    advancedSearch() {
      this.$router.push({
        path: "/articleList/1/",
        query: { advanced: "advanced" },
      });
    },
    handleOpen() {
      this.isListOpen = true;
    },
  },
  mounted() {
    if (this.parentId == 0) {
      const mainSearch = document.getElementById("mainSearch");
      mainSearch?.focus();
    } else {
      const spaceButton = document.getElementById("spaceButton");
      spaceButton?.focus();
    }
  },
};
interface Multipliers {
  baseRadius: number;
}
</script>
