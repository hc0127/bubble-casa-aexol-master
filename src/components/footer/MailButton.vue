<template>
  <BaseButton variant="flat" color="transparent" @click="sendMail" id="mailBtn">
    <IconMailBig />
    <div class="desc">Contact</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconMailBig from "../icons/IconMailBig.vue";

export default {
  name: "MailButton",
  components: {
    IconMailBig,
    BaseButton,
  },
  setup() {
    const sendMail = () => {
      window.open("https://feedback.library.one/", "_blank");
    };
    return { sendMail };
  },
};
</script>
