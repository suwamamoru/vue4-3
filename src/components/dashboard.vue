<template>
  <div class="dashboard">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="login-info">
      <span class="login-user">{{$store.getters.signinUser}}さんようこそ!!</span>
      <span class="wallet">残高:{{$store.getters.signinWallet}}</span>
      <span><button class="logout-button" @click="logout()">ログアウト</button></span>
    </div>
    <div class="users">
      <h1>ユーザ一覧</h1>
      <table class="users">
        <tr>
          <td class="user-name">ユーザー名</td>
          <td><br></td>
          <td><br></td>
        </tr>
        <tr v-for="(userData,index) in $store.getters.receiveUsers" :key="index">
          <td class="user-name">{{userData}}</td>
          <td><button class="wallet-buttons" @click="openWallet(index)">walletを見る</button></td>
          <td><button class="wallet-buttons" @click="openSubmit(index)">送る</button></td>
        </tr>
      </table>
    </div>
    <modal @close="closeWallet()" v-if="walletModal">
      <p>{{watchUser}}さんの残高</p>
      <p>{{watchWallet}}</p>
      <template slot="footer">
        <button class="close-buttons" @click="closeWallet()">close</button>
      </template>
    </modal>
    <modal @close="closeSubmit()" v-if="submitModal">
      <p>あなたの残高:{{$store.getters.signinWallet}}</p>
      <p>送る金額</p>
      <input type="number" min="0" v-model.number="giveWallet">
      <p class="error" v-show="errorShow">{{errorMessage}}</p>
      <template slot="footer">
        <button class="close-buttons" @click="closeSubmit()">送信</button>
      </template>
    </modal>
    <div class="copyright">
      <p>Copyright ©️2021 oo Inc. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
import modal from './modal.vue'

export default {
  components: {
    modal
  },
  data() {
    return {
      unsubscribe: null,
      walletModal: false,
      submitModal: false,
      watchUser: '',
      watchWallet: '',
      giveWallet: '',
      currentId: '',
      currentWallet: '',
      afterWallet: '',
      totalWallet: '',
      errorShow: false,
      errorMessage: '残高を超える投げ銭はできません。'
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    computedCurrentId: {
      get() {
        return this.$store.getters.updateCurrentId
      },
      set(value) {
        this.$store.dispatch("getCurrentId", value)
      }
    },
    computedAfterWallet: {
      get() {
        return this.$store.getters.updateAfterWallet
      },
      set(value) {
        this.$store.dispatch("getAfterWallet", value)
      }
    },
    computedTotalWallet: {
      get() {
        return this.$store.getters.updateTotalWallet
      },
      set(value) {
        this.$store.dispatch("getTotalWallet", value)
      }
    },
  },
  methods: {
    getData() {
      this.$store.dispatch('getData')
    },
    logout() {
      this.$store.dispatch('logout')
    },
    openWallet(index) {
      this.watchUser = this.$store.getters.receiveUsers[index]
      this.watchWallet = this.$store.getters.receiveWallets[index]
      this.walletModal = true
    },
    closeWallet() {
      this.walletModal = false
    },
    openSubmit(index) {
      this.giveWallet = ''
      this.currentId = this.$store.getters.receiveIds[index]
      this.currentWallet = this.$store.getters.receiveWallets[index]
      this.totalWallet = ''
      this.errorShow = false
      this.submitModal = true
    },
    closeSubmit() {
      if(this.giveWallet === '') {
        this.giveWallet = 0
      }
      this.afterWallet = this.currentWallet - this.giveWallet
      console.log('currentWallet', this.currentWallet)
      console.log('giveWallet', this.giveWallet)
      console.log('afterWallet', this.afterWallet)
      if(this.afterWallet < 0) {
        this.errorShow = true
        return
      }
      this.totalWallet = this.currentWallet + this.giveWallet
      this.computedCurrentId = this.currentId
      this.computedAfterWallet = this.afterWallet
      this.computedTotalWallet = this.totalWallet
      this.$store.dispatch('submit')
      this.$store.dispatch('getData')
      this.submitModal = false
    }
  }
}
</script>

<style>
.login-user {
  margin-right: 30px;
  text-align: left;
}

.wallet {
  margin-right: 30px;
  text-align: right;
}

.logout-button {
  background-color: #fff;
  border-radius: 0.5vh;
  border: 1px solid #6495ed;
  color: #6495ed;
}

.users {
  margin: auto;
}

.user-name {
  width: 200px;
}

.wallet-buttons {
  background-color: #20b2aa;
  border-radius: 0.5vh;
  border: 1px solid #20b2aa;
  color: #fff;
}

.error {
  font-size: 6px;
  color: red;
}

.close-buttons {
  background-color: #ff0000;
  border-radius: 0.5vh;
  border: 1px solid #cc0000;
  color: #fff;
}
</style>