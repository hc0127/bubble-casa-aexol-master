<template>
  <div class="social-wrapper">
    <div class="social-menu" v-if="socialMenuVisible" @click="socialMenu()">
      <div class="social-elem">
        <ShareNetwork network="twitter" :url="sendLink" title="">
          <twitter />
        </ShareNetwork>
      </div>
      <div class="social-elem">
        <ShareNetwork network="facebook" :url="sendLink" title="">
          <facebook />
        </ShareNetwork>
      </div>
      <div class="social-elem">
        <ShareNetwork network="LinkedIn" :url="sendLink" title="">
          <linkedin />
        </ShareNetwork>
      </div>
      <div class="social-elem">
        <ShareNetwork network="Email" :url="sendLink" title="">
          <mail />
        </ShareNetwork>
      </div>
    </div>
    <div class="social-btn" @click="socialMenu">
      <IconSendToMobile class="social-icon" />
      <div class="desc">Share</div>
    </div>
  </div>
</template>
<script>
import BaseButton from "../common/BaseButton.vue";
import IconSendToMobile from "../icons/IconSendToMobile.vue";
import facebook from "../icons/facebook.vue";
import twitter from "../icons/twitter.vue";
import linkedin from "../icons/linkedin.vue";
import mail from "../icons/mail.vue";

export default {
  name: "SendButton",
  components: {
    IconSendToMobile,
    BaseButton,
    facebook,
    twitter,
    linkedin,
    mail,
  },
  data() {
    return {
      socialMenuVisible: false,
    };
  },
  methods: {
    socialMenu() {
      this.socialMenuVisible = !this.socialMenuVisible;
    },
  },
  computed: {
    sendLink() {
      const nodeId = window.location.href.split("/").pop();
      return `https://library.one/?node=${nodeId}`;
    },
  },
};
</script>
