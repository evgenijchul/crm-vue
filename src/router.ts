import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
Vue.use(VueRouter)
import store from './store'



const routes: Array<RouteConfig> =   [
    { 
      path: '/newdeal',      
      name: 'newDeal', 
      meta: { layout: 'EmptyLayout', Auth:true }, 
      component: () => import('./views/deal/create.vue')
    },

    {
      path: '/',
      name: 'home',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/home.vue')
    },
    {
      path: '/deals',
      name: 'deals',
      meta: { layout: 'MainLayout', title:'Сделки', Auth:true },
      component: () => import('./views/deals.vue')
    },
    {
      path: '/task',
      name: 'task',
      meta: { layout: 'MainLayout', title:'Задания', Auth:true },
      component: () => import('./views/task.vue')
    },
    {
      path: '/user',
      name: 'user',
      meta: { layout: 'MainLayout', title:'', Auth:true },
      component: () => import('./views/user.vue')
    },
    {
      path: '/deal/:deal_id',
      name: 'deal',
      meta: { layout: 'MainLayout' , Auth:true},
      component: () => import('./views/deals.vue')
    },
    {
      path: '/clients',
      name: 'clients',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/clients.vue')
    },
    { //  /addKPfromEmail/email/ru-bill@nic.ru/site/[site]
      path: '/addKPfromEmail/email/:email/site/:site_sid',
      name: 'addKPfromEmail',
      meta: { layout: 'MainLayout' , Auth:true},
      component: () => import('./views/deal/createFromMail.vue')
    },
    { //  /addDealFromTel/number/[number]/site/[site]
      path: '/addDealFromTel/number/:number/site/:site_sid',
      name: 'addDealFromTel',
      meta: { layout: 'MainLayout' , Auth:true},
      component: () => import('./views/deal/createFromTel.vue')
    },
    { // /deals/create/client/8/site/[site]
      path: '/deals/create/client/:client_id/site/:site_sid',
      name: 'addDealToClient',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/deal/createDealToClient.vue')
    },
    { // /deals/[deal_id]/create_child
      path: '/deals/:deal_id/create_child',
      name: 'createChildDeal',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/deal/createChildDeal.vue')
    },
    {
      path: '/deals/search/email/:email',
      name: 'searchDealsFromEmail',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/deals.vue')
    },
    {
      path: '/deals/client/:client_id',
      name: 'clientdeals',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/deals.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { layout: 'EmptyLayout' },
      component: () => import('./views/Login.vue')
    },
    {
      path: '/calls',
      name: 'calls',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/calls.vue')
    },
    {
      path: '/phonebook',
      name: 'phonebook',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/phoneBook.vue')
    },
    {
      path: '/files',
      name: 'files',
      meta: { layout: 'MainLayout', Auth:true },
      component: () => import('./views/files.vue')
    },
    {
      path: '/files/:reg_id',
      name: 'file',
      meta: { layout: 'MainLayout' , Auth:true},
      component: () => import('./views/file.vue')
    }
  ];





const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.Auth)) {
    console.log();
    if (store.getters["managers/isLoggedIn"]) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router