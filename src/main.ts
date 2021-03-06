import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import Vuetify from './plugins/vuetify'




import router from './router'
import store from './store/index'

import dateFilter from '@/filter/date.filter'

import Vuelidate from 'vuelidate'

import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {

  maxHeight: "300px",
  // set to 'true' this will insert plain text without styling when you paste something into the editor.
  forcePlainTextOnPaste: true
}); // config is optional. more below

import axios from 'axios'

// store.state.urlApi = process.env.NODE_ENV === 'production' ? 'http://192.168.1.104' : 'http://192.168.1.16';
// store.state.dev = process.env.NODE_ENV === 'production' ? false : true;
// axios.defaults.baseURL = store.state.urlApi + '/api/v1';


import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

Vue.config.performance = process.env.NODE_ENV !== 'production';

// работа с токеном
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}


Vue.use(Vuelidate)

// import calling from "@/components/app/calling";
// Vue.component('calling', calling)

Vue.filter('date', dateFilter)

Vue.filter('toCurrency', function (value) {
  if (typeof value !== "number") {
    return value;
  }
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2
  });
  return formatter.format(value);
});

import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: '#39A1F3',
  failedColor: 'red',
  height: '2px'
})


new Vue({
  vuetify: Vuetify,
  router,
  store,
  
  render: h => h(App)
}).$mount('#app')
