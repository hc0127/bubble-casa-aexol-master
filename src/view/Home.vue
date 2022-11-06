<template>
  <div class="home">
    <IconUserCircle v-if="!user_session" class="home--user" @click="() => triggerPopup('SignIn')"/>

    <div v-else class="home--user" @click="logout">
      <p>log out</p>
      <p>{{ user_session.session.email }}</p>
    </div>
    <div class="home--wrapper">
      <MainBubble name="about" @click="() => triggerPopup('About')"/>
      <MainBubble name="favorites"/>
      <MainBubble name="discover" @click="handleClick"/>
      <MainBubble name="choose">
        <div class="text">
          <p class="choose">Choose</p>
          <p class="interest">Your interest</p>
          <p class="interest or">or</p>
        </div>
        <div class="input-wrapper">
          <BaseButton color="white" variant="secondary">Search</BaseButton>
          <BaseInput variant="secondary">
            <IconSearch/>
          </BaseInput>
        </div>
      </MainBubble>
    </div>
  </div>
</template>

<script>
import store from '../store';
import MainBubble from '../components/MainBubble.vue';
import BaseButton from '../components/common/BaseButton.vue';
import IconEnvelope from '../components/icons/IconEnvelope.vue';
import BaseIcon from '../components/common/BaseIcon.vue';
import IconGoogle from '../components/icons/IconGoogle.vue';
import BaseCheckBox from '../components/common/BaseCheckBox.vue';
import IconUserCircle from '../components/icons/IconUserCircle.vue';
import BaseInput from '../components/common/BaseInput.vue';
import IconSearch from '../components/icons/IconSearch.vue';
import { useRouter } from 'vue-router';
import { logout, user_session } from '../session';
import IconClose from '../components/icons/IconClose.vue';


export default {
  name: 'Home',
  components: {
    IconClose,
    IconSearch,
    BaseInput,
    IconUserCircle,
    BaseCheckBox,
    IconGoogle,
    BaseIcon,
    IconEnvelope,
    BaseButton,
    MainBubble
  },

  setup() {
    const router = useRouter();

    const handleClick = () => {
      router.push({ path: '/discover' });
    };

    const triggerPopup = (name) => {
      store.triggerPopup(name);
    };

    return {
      triggerPopup,
      handleClick,
      logout,
      user_session
    };
  }
};
</script>
