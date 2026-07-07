<template>
  <div id="background">
    <b-row>
      <b-col xs="12" xl="12">
        <HtAlert
          :show="alertShow"
          :variant="variant"
          @close="
            (val) => {
              this.alertShow = val
            }
          "
        >
          {{ alertText }}
        </HtAlert>
      </b-col>
    </b-row>

    <div class="login">
      <b-container fluid>
        <h1>Login</h1>

        <b-row>
          <b-form-row style="width: 100%">
            <b-col xs="12" xl="12">
              Name:
              <b-form-input
                type="text"
                v-model="form.name"
                id="name"
                placeholder="Enter name"
              ></b-form-input>
              <br>
            </b-col>

            <b-col xs="12" xl="12">
              <b-form @submit.stop.prevent>
                <label for="text-password">Password:</label>
                <b-input
                  type="password"
                  id="text-password"
                  v-model="form.password"
                  aria-describedby="password-help-block"
                  placeholder="Enter password"
                ></b-input>
                <br>
              </b-form>
            </b-col>

            <b-col xs="12" xl="12">
              Email:
              <b-form-input
                type="email"
                v-model="form.email"
                id="email"
                placeholder="Enter email"
              ></b-form-input>
              <br>
            </b-col>
          </b-form-row>
        </b-row>

        <b-button
          id="button"
          class="btn_submit"
          variant="primary"
          @click.prevent="login"
        >
          Login
        </b-button>

        <b-button
          id="button"
          class="btn_signup"
          variant="primary"
          @click.prevent="register"
        >
          register
        </b-button>
      </b-container>
    </div>
  </div>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        name: '',
        password: '',
        email: ''
      },
      token: undefined,
      alertShow: false,
      variant: 'success',
      alertText: ''
    }
  },
  methods: {
    getErrorMessage(err) {
      if (err && err.response && err.response.data && err.response.data.message) {
        return err.response.data.message
      }

      if (err && err.message) {
        return err.message
      }

      return 'Login failed. Please try again.'
    },

    register() {
      this.$router.push('/register')
    },

    login() {
      if (!this.form.name || !this.form.password || !this.form.email) {
        this.variant = 'danger'
        this.alertShow = true
        this.alertText = 'Please enter username, password, and email'
        return
      }

      Api.post('/login', this.form)
        .then((res) => {
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'Login successful'

          this.token = res.data.token

          localStorage.setItem('token', this.token)
          localStorage.setItem('userInFo', JSON.stringify(res.data.user))

          window.dispatchEvent(new Event('auth-change'))

          this.$router.replace('/')
        })
        .catch((err) => {
          console.log('login error', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(err)
        })
    }
  }
}
</script>

<style>
#background {
  width: 100%;
  height: 100%;
  background: url('../assets/login.jpeg');
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#button {
  position: relative;
  height: 50px;
  width: 120px;
  border-radius: 10px;
  margin-top: 18px;
  box-shadow: none;
  margin-left: 40px;
  margin-right: 10px;
}

.login {
  background: white;
  padding: 60px;
  padding-top: 20px;
  border-radius: 10px;
}
</style>
