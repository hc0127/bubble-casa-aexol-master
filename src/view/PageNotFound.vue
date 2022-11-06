<template>
  <div class="page-not-found">
    <div class="page-not-found__wrapper">
      <h1 class="page-not-found__header popup-title">Page not found</h1>
      <div class="page-not-found__text">
        <p>We're sorry, the page you requested could not be found.</p>
        <br/>
        <p>Please go to the homepage.</p>
      </div>
      <BaseButton @click="handleHome">
        Go to homepage
      </BaseButton>
    </div>

</div>

</template>

<script>
import BaseButton from '../components/common/BaseButton.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PageNotFound',
  components: {
    BaseButton
  },
  setup() {
    const router = useRouter();

    const handleHome = () => {
      router.push({ path: '/' });
    };
    return {
      handleHome
    }
  }
};
</script>
