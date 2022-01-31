import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    input: {
      user: '',
      email: '',
      password: '',
      wallet: 500
    },
    error: {
      errorShow: false,
      errorMessage: ''
    },
    signin: {
      id: '',
      user: '',
      wallet: ''
    },
    receive: {
      ids: [],
      users: [],
      wallets: []
    },
    update: {
      currentId: '',
      afterWallet: '',
      totalWallet: ''
    }
  },
  mutations: {
    setUser(state, user) {
      state.input.user = user
    },
    setEmail(state, email) {
      state.input.email = email
    },
    setPassword(state, password) {
      state.input.password = password
    },
    setErrorShow(state, errorShow) {
      state.error.errorShow = errorShow
    },
    setErrorMessage(state, errorMessage) {
      state.error.errorMessage = errorMessage
    },
    setCurrentId(state, computedCurrentId) {
      state.update.currentId = computedCurrentId
    },
    setAfterWallet(state, computedAfterWallet) {
      state.update.afterWallet = computedAfterWallet
    },
    setTotalWallet(state, computedTotalWallet) {
      state.update.totalWallet = computedTotalWallet
    }
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
      firebase.auth().createUserWithEmailAndPassword(state.input.email, state.input.password)
      .then(userCredential => {
        const uid = userCredential.user.uid
        firebase.firestore().collection('users').doc(uid).set({
          user: state.input.user,
          email: state.input.email,
          password: state.input.password,
          wallet: state.input.wallet
        })
        const errorShow = false
        this.commit('setErrorShow', errorShow)
        router.push('/dashboard')
      })
      .catch(error => {
        const errorCode = error.code
        const errorShow = true
        this.commit('setErrorShow', errorShow)
        let errorMessage = ''
        switch(errorCode) {
          case 'auth/invalid-email': {
            errorMessage = "メールアドレスのフォーマットが正しくありません。"
            this.commit('setErrorMessage', errorMessage)
            break
          }
          case 'auth/email-already-in-use': {
            errorMessage = "このメールアドレスは既に使用されています。"
            this.commit('setErrorMessage', errorMessage)
            break
          }
          case 'auth/weak-password': {
            errorMessage = "パスワードは6文字以上で設定してください。"
            this.commit('setErrorMessage', errorMessage)
            break
          }
          default:
            errorMessage = "エラーが発生しました。"
            this.commit('setErrorMessage', errorMessage)
        }
      })
    },
    login({state}) {
      firebase.auth().signInWithEmailAndPassword(state.input.email, state.input.password)
      .then(() => {
        const errorShow = false
        this.commit('setErrorShow', errorShow)
        router.push('/dashboard')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorShow = true
        this.commit('setErrorShow', errorShow)
        let errorMessage = ''
        switch(errorCode) {
          case 'auth/invalid-email': {
            errorMessage = "メールアドレスのフォーマットが正しくありません。"
            this.commit('setErrorMessage', errorMessage)
            break
          }
          case 'auth/user-not-found': {
            errorMessage = "このメールアドレスは登録されていません。"
            this.commit('setErrorMessage', errorMessage)
            break
          }
          case 'auth/wrong-password': {
            errorMessage = "パスワードに誤りがあります。"
            this.commit('setErrorMessage', errorMessage)
            break
          }
          default:
            errorMessage = "エラーが発生しました。"
            this.commit('setErrorMessage', errorMessage)
        }
      })
    },
    getData({state}) {
      state.receive.ids = []
      state.receive.users = []
      state.receive.wallets = []
      firebase.firestore().collection('users').where('email','==',state.input.email).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          state.signin.id = doc.id
          state.signin.user = doc.data().user
          state.signin.wallet = doc.data().wallet
        })
      })
      .catch(error => {
        console.error(error)
      })
      firebase.firestore().collection('users').where('email','!=',state.input.email).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          state.receive.ids.push(doc.id)
          state.receive.users.push(doc.data().user)
          state.receive.wallets.push(doc.data().wallet)
        })
      })
      .catch(error => {
        console.error(error)
      })
    },
    logout() {
      firebase.auth().signOut()
      .then(() => {
        router.push('/login')
      })
      .catch(error => {
        console.error(error)
      })
    },
    getCurrentId: ({commit}, computedCurrentId) => {
      commit('setCurrentId', computedCurrentId)
    },
    getAfterWallet: ({commit}, computedAfterWallet) => {
      commit('setAfterWallet', computedAfterWallet)
    },
    getTotalWallet: ({commit}, computedTotalWallet) => {
      commit('setTotalWallet', computedTotalWallet)
    },
    submit({state}) {
      firebase.firestore().collection('users').doc(state.signin.id).update({
        wallet: state.update.afterWallet
      }),
      firebase.firestore().collection('users').doc(state.update.currentId).update({
        wallet: state.update.totalWallet
      })
    }
  },
  getters: {
    user: state => {
      return state.input.user
    },
    email: state => {
      return state.input.email
    },
    password: state => {
      return state.input.password
    },
    errorShow: state => {
      return state.error.errorShow
    },
    errorMessage: state => {
      return state.error.errorMessage
    },
    signinId: state => {
      return state.signin.id
    },
    signinUser: state => {
      return state.signin.user
    },
    signinWallet: state => {
      return state.signin.wallet
    },
    receiveIds: state => {
      return state.receive.ids
    },
    receiveUsers: state => {
      return state.receive.users
    },
    receiveWallets: state => {
      return state.receive.wallets
    },
    updateCurrentId: state => {
      return state.update.currentId
    },
    updateAfterWallet: state => {
      return state.update.afterWallet
    },
    updateTotalWallet: state => {
      return state.update.totalWallet
    },
  }
})
