<template>
  <div id="background">
    <b-row class="alert-row">
      <b-col cols="12">
        <HtAlert
          :show="alertShow"
          :variant="variant"
          @close="alertShow = $event"
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
            <b-col cols="12">
              <label for="name">Name:</label>

              <b-form-input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter name"
              ></b-form-input>

              <br />
            </b-col>

            <b-col cols="12">
              <b-form @submit.stop.prevent>
                <label for="text-password">Password:</label>

                <b-input
                  id="text-password"
                  v-model="form.password"
                  type="password"
                  aria-describedby="password-help-block"
                  placeholder="Enter password"
                ></b-input>

                <br />
              </b-form>
            </b-col>

            <b-col cols="12">
              <label for="email">Email:</label>

              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
              ></b-form-input>

              <br />
            </b-col>
          </b-form-row>
        </b-row>

        <div class="button-container">
          <b-button
            class="action-button"
            variant="primary"
            @click.prevent="login"
          >
            Login
          </b-button>

          <b-button
            class="action-button"
            variant="primary"
            @click.prevent="register"
          >
            Register
          </b-button>
        </div>
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
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
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
          localStorage.setItem(
            'userInFo',
            JSON.stringify(res.data.user)
          )

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

<style scoped>
#background {
  width: 100%;
  min-height: 100vh;
  background: url('../assets/login.jpeg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.alert-row {
  width: 90%;
  max-width: 760px;
  margin: 0 auto;
}

.login {
  width: 90%;
  max-width: 760px;
  background: white;
  padding: 20px 60px 50px;
  border-radius: 10px;
  box-sizing: border-box;
}

.login h1 {
  text-align: center;
  margin-bottom: 30px;
}

.button-container {
  width: 100%;
  margin-top: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.action-button {
  width: 120px;
  height: 50px;
  border-radius: 10px;
  box-shadow: none;
}

@media (max-width: 576px) {
  .login {
    width: 92%;
    padding: 20px 25px 35px;
  }

  .button-container {
    flex-direction: column;
    gap: 12px;
  }

  .action-button {
    width: 100%;
  }
}
</style>
