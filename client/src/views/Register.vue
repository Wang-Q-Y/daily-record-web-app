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

    <div id="signup">
      <b-container fluid>
        <h1>Register</h1>

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
                <label for="password">Password:</label>

                <b-input
                  id="password"
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

        <div class="form-footer">
          <b-button
            class="register-button"
            variant="primary"
            @click.prevent="signup"
          >
            Register
          </b-button>

          <div class="login-link">
            Already have an account?
            <a href="#" @click.prevent="$router.push('/login')">
              Login here
            </a>
          </div>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'Register',

  data() {
    return {
      form: {
        name: '',
        password: '',
        email: ''
      },
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

      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.code === 11000
      ) {
        return 'This username is already taken'
      }

      if (err && err.message) {
        return err.message
      }

      return 'Registration failed. Please try again.'
    },

    signup() {
      if (!this.form.name || !this.form.password || !this.form.email) {
        this.variant = 'danger'
        this.alertShow = true
        this.alertText = 'Please fill in all fields'
        return
      }

      Api.post('/register', this.form)
        .then(() => {
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'Registration successful. Please log in.'

          localStorage.removeItem('token')
          localStorage.removeItem('userInFo')
          localStorage.removeItem('password')

          setTimeout(() => {
            this.$router.replace('/login')
          }, 800)
        })
        .catch((err) => {
          console.log('register error', err)

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
  background: url('../assets/res.jpeg');
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

#signup {
  width: 90%;
  max-width: 760px;
  background: white;
  padding: 20px 60px 50px;
  border-radius: 10px;
  box-sizing: border-box;
}

#signup h1 {
  text-align: center;
  margin-bottom: 30px;
}

.form-footer {
  width: 100%;
  margin-top: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-button {
  width: 130px;
  height: 50px;
  border-radius: 10px;
  font-size: 20px;
  box-shadow: none;
}

.login-link {
  margin-top: 18px;
  text-align: center;
}

@media (max-width: 576px) {
  #signup {
    width: 92%;
    padding: 20px 25px 35px;
  }

  .register-button {
    width: 100%;
  }
}
</style>
