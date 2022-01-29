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
      user: '',
      wallet: ''
    },
    signout: {
      user: [],
      wallet: []
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
      firebase.auth().onAuthStateChanged(signinUser => {
        const uid = signinUser.uid
        firebase.firestore().collection('users').doc(uid).onSnapshot(doc => {
          state.signin.user = doc.data().user
          state.signin.wallet = doc.data().wallet
        })
      })
      firebase.firestore().collection('users').onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          state.signout.user.push(doc.data().user)
          state.signout.wallet.push(doc.data().wallet)
        })
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
    signinUser: state => {
      return state.signin.user
    },
    signinWallet: state => {
      return state.signin.wallet
    },
    signoutUser: state => {
      return state.signout.user
    },
    signoutWallet: state => {
      return state.signout.wallet
    }
  }
})
