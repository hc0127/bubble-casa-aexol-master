<template>
  <BasePopup class="about" :close-button="false">
    <div class="buttons">
      <BaseButton color="transparent" variant="about" @click="changeView('about')"><span>About</span></BaseButton>
      <BaseButton color="transparent" variant="about" @click="changeView('terms')"><span>Terms & Conditions</span></BaseButton>
      <BaseButton color="transparent" variant="about" @click="changeView('policy')">Privacy Policy</BaseButton>
      <IconClose class="popup--close" @click="closePopup"/>
    </div>
    <div class="about__content" v-if="current_view === 'about'">
      <div
          class="description-wrapper"
          :key="index"
          v-for="(item, index) in interface_subsections"
      >
        <Block
            :icon="item.icon"
            :text="item.text"
            :title="item.title"
        />
        <div
            class="description-wrapper__child"
            :key="index"
            v-if="item.child"
            v-for="(item, index) in item.child"
        >
          <Block
              vertical="0"
              diagonal="-63px"
              :class="{ 'last': index === 2 }"
              :icon="item.icon"
              :text="item.text"
              :title="item.title"
          />
          <div
              class="description-wrapper__grandchild"
              :key="index"
              v-if="item.grandchild"
              v-for="(item, index) in item.grandchild"
          >
            <Block
                vertical="0"
                diagonal="-48px"
                title_size="20px"
                :class="{ 'last-grandchild': index === 5 }"
                :icon="item.icon"
                :text="item.text"
                :title="item.title"
            />
          </div>
        </div>
      </div>
      <span class="separator">
      <span class="line"/>
      <span class="title">For Authors</span>
      <span class="line"/>
    </span>
      <div class="author-wrapper" v-for="(item, index) in author_subsections" :key="index">
        <Block
            :icon="item.icon"
            :text="item.text"
            :title="item.title"
        />
        <div
            class="author-wrapper__child "
            :key="index"
            v-if="item.child"
            v-for="(item, index) in item.child"
        >
          <Block vertical="0" diagonal="-83px" :text="item.text" :class="{ 'last-subsection': index === 6 }"/>
        </div>
      </div>
    </div>
    <div class="about__content" v-else-if="current_view === 'terms'">
      <Terms />
    </div>
    <div class="about__content" v-else>
      <Policy />
    </div>
  </BasePopup>
</template>

<script>
import BasePopup from '../common/BasePopup.vue';
import IconI from '../icons/IconI.vue';
import IconMonitor from '../icons/IconMonitor.vue';
import {interface_subsections, author_subsections} from '../../config/about.js';
import BaseButton from '../common/BaseButton.vue';
import IconClose from '../icons/IconClose.vue';
import Block from "./Block.vue";
import store from '../../store';
import Terms from './Terms.vue';
import Policy from './Policy.vue';

export default {
  name: 'About',
  components: {
    Policy,
    Terms,
    Block,
    BaseButton,
    IconMonitor,
    IconI,
    BasePopup,
    IconClose
  },

  data() {
    return {
      interface_subsections,
      author_subsections,
      current_view: 'about'
    }
  },

  methods: {
    closePopup() {
      store.triggerPopup(null);
    },
    changeView(view) {
      this.current_view = view
    }
  }
};
</script>
