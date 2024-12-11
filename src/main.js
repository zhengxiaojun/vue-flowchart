import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import './assets/styles/styles.css';

Vue.config.productionTip = false

Vue.use(Element)

new Vue({
  render: h => h(App),
}).$mount('#app')
