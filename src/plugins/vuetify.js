import '@mdi/font/css/materialdesignicons.min.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { preset } from 'vue-cli-plugin-vuetify-preset-reply/preset'

Vue.use(Vuetify);

const options = {
  breakpoint: { scrollbarWidth: 12 }, 
  theme: {
    light: {
      primary: '#3f51b5',
      secondary: '#b0bec5',
      accent: '#8c9eff',
      error: '#b71c1c',
    },
  },
}


export default new Vuetify({
  preset,
...options

})
