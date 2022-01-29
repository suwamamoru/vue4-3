import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
import firebase from 'firebase'

Vue.config.productionTip = false

const config = {
  apiKey: "AIzaSyA0l50w4OrB8IlEVHm61EUPtBjeIvGDaVA",
  authDomain: "vue4-ab70f.firebaseapp.com",
  projectId: "vue4-ab70f",
  storageBucket: "vue4-ab70f.appspot.com",
  messagingSenderId: "1046512813875",
  appId: "1:1046512813875:web:23060e17ada190bb132046",
  measurementId: "G-MM55RCPPJS"
};

firebase.initializeApp(config);

sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
