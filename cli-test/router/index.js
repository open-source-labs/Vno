import VueRouter from 'https://unpkg.com/vue-router@4.0.5/dist/vue-router.global.js'
  import TestOne from '../components/TestOne.vue';
import TestTwo from '../components/TestTwo.vue';
import TestThree from '../components/TestThree.vue';

    const routes = [{
      path: '/testone',
      name: 'TestOne',
      component: TestOne
      // uncomment below to use lazy loading - also, remove import statement for this component at top of file.
      // component: () => import('../components/TestOne.vue')
    },{
      path: '/testtwo',
      name: 'TestTwo',
      component: TestTwo
      // uncomment below to use lazy loading - also, remove import statement for this component at top of file.
      // component: () => import('../components/TestTwo.vue')
    },{
      path: '/testthree',
      name: 'TestThree',
      component: TestThree
      // uncomment below to use lazy loading - also, remove import statement for this component at top of file.
      // component: () => import('../components/TestThree.vue')
    },];

    const router = VueRouter.createRouter({
      // ask if user wants to "Use history mode for router? (Requires proper server setup for index fallback in production)"
      // https://next.router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations

      // history: createWebHistory(),
      routes
    });

    export default router;
    