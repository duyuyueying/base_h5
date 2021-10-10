import Vue from 'vue'
import App from './App.vue'
import '@/utils/rem'
import router from '@/router/router';
import store from './store'
import './common/common.scss';
// import { Popup } from 'vant';
// import 'vant/lib/popup/style';
// Vue.use(Popup);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
