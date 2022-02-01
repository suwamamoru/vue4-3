<template>
  <div class="signup">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>新規登録画面</h1>
    <form @submit.prevent>
      <table>
        <tr>
          <td>ユーザー名</td>
          <td><input type="text" v-model="user" placeholder="userName"></td>
        </tr>
        <tr>
          <td>メールアドレス</td>
          <td><input type="text" v-model="email" placeholder="E-mail"></td>
        </tr>
        <tr>
          <td>パスワード</td>
          <td><input type="text" v-model="password" placeholder="Password"></td>
        </tr>
      </table>
      <p class="error" v-show="errorShow">{{$store.getters.errorMessage}}</p>
      <div class="buttons">
        <button class="signup-btn" @click="signupInput()">新規登録</button>
        <br><router-link to="/login" class="login-guide">ログインはこちらから</router-link>
      </div>
      <div class="copyright">
        <p>Copyright ©️2021 oo Inc. All rights reserved.</p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  computed: {
    user: {
      get() {
        return this.$store.getters.user
      },
      set(value) {
        this.$store.dispatch("getUser", value)
      }
    },
    email: {
      get() {
        return this.$store.getters.email
      },
      set(value) {
        this.$store.dispatch("getEmail", value)
      }
    },
    password: {
      get() {
        return this.$store.getters.password
      },
      set(value) {
        this.$store.dispatch("getPassword", value)
      }
    },
    errorShow: {
      get() {
        return this.$store.getters.errorShow
      }
    }
  },
  methods: {
    signupInput() {
      this.$store.dispatch('signupInput')
    }
  }
}
</script>

<style>
table {
  margin: auto;
}

.error {
  font-size: 12px;
  color: red;
}

.buttons {
  padding-top: 30px
}

.signup-btn {
  width: 100px;
  font-size: 18px;
  background-color: #fff;
  border-radius: 1vh;
  border: 1px solid #6495ed;
  color: #6495ed;
}

.login-guide {
  color: #6495ed;
}

.copyright {
  padding-top: 10px;
}
</style>