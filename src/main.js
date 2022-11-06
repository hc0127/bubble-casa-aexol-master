import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import scss from './scss/index.scss'
import Notifications from '@kyvg/vue3-notification'
import Vue3TouchEvents from "vue3-touch-events";
import VueSocialSharing from 'vue-social-sharing'


const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
  .use(router)
  .use(Vue3TouchEvents)
  .use(Notifications)
  .use(VueSocialSharing)
  .mount('#app');
