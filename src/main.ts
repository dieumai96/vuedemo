import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import * as $ from 'jquery';
export const eventBus = new Vue();
Vue.config.productionTip = false;

Vue.directive('bgColor', {
  bind(el, binding, vnode) {
    el.style.backgroundColor = binding.value
  }
})

import router from './router';

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
