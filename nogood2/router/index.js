import VueRouter from 'https://unpkg.com/vue-router@3.5.2/dist/vue-router.js';
  import Store from '../components/Store.vue';
import Links from '../components/Links.vue';
import Tor from '../components/Tor.vue';


    const routes = [{
      path: '/store',
      name: 'Store',
      component: Store
      // uncomment below to use lazy loading - also, remove import statement for this component at top of file.
      // component: () => import('../components/Store.vue')
    },{
      path: '/links',
      name: 'Links',
      component: Links
      // uncomment below to use lazy loading - also, remove import statement for this component at top of file.
      // component: () => import('../components/Links.vue')
    },{
      path: '/tor',
      name: 'Tor',
      component: Tor
      // uncomment below to use lazy loading - also, remove import statement for this component at top of file.
      // component: () => import('../components/Tor.vue')
    },];

    const router = VueRouter.createRouter({
      // ask if user wants to "Use history mode for router? (Requires proper server setup for index fallback in production)"
      // https://next.router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations

      // history: createWebHistory(),
      routes
    });

    module.exports = router;
    