import Discover from './view/Discover.vue';
import ArticleListWrapper from './view/article/ArticleListWrapper.vue';
import ArticleIframe from './components/article/ArticleIframe.vue';
import RecoverPassword from './components/auth/RecoverPassword.vue';
import PageNotFound from './view/PageNotFound.vue';
import EmailConfirmation from './view/EmailConfirmation.vue';


export const routes = [
  {
    path: '/',
    component: Discover
  },
  {
    path: '/discover',
    component: Discover
  },
  {
    path: '/articleList/:id',
    component: ArticleListWrapper
  },
  {
    path: '/article/:id',
    component: ArticleIframe
  },
  {
    path: '/recover/:token',
    component: RecoverPassword
  },
  {
    path: '/confirmation',
    component: EmailConfirmation
  },
  {
    path: '/:catchAll(.*)',
    component: PageNotFound
  },
];
