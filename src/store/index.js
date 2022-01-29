import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    email: '',
    password: ''
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setEmail(state, email) {
      state.email = email
    },
    setPassword(state, password) {
      state.password = password
    },
  },
  actions: {
    getUser: ({commit}, user) => {
      commit('setUser', user)
    },
    getEmail: ({commit}, email) => {
      commit('setEmail', email)
    },
    getPassword: ({commit}, password) => {
      commit('setPassword', password)
    },
    signupInput({state}) {
    const db = firebase.firestore()
      db.collection('users').add({
        user: state.user,
        email: state.email,
        password: state.password
      })
      .then(() => console.log("Document writing was successful"))
      .catch((error) => console.error("Error adding document: ", error))
    }
  },
  getters: {
    user: state => {
      return state.user
    },
    email: state => {
      return state.email
    },
    password: state => {
      return state.password
    }
  }
})
