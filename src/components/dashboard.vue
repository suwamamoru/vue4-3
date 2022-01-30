<template>
  <div class="dashboard">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="login-info">
      <span class="login-user">{{$store.getters.signinUser}}さんようこそ!!</span>
      <span class="wallet">残高:{{$store.getters.signinWallet}}</span>
    </div>
    <div class="users">
      <h1>ユーザー一覧</h1>
      <table class="users">
        <tr>
          <td class="user-name">ユーザー名</td>
          <td><br></td>
          <td><br></td>
        </tr>
        <tr v-for="(userData,index) in $store.getters.receiveUsers" :key="index">
          <td class="user-name">{{userData}}</td>
          <td><button class="wallet-buttons">walletを見る</button></td>
          <td><button class="wallet-buttons">送る</button></td>
        </tr>
      </table>
    </div>
    <div class="copyright">
      <p>Copyright ©️2021 oo Inc. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.dispatch('getData')
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
  text-align: right;
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
</style>