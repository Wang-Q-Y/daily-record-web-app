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

    <div id="signup">
      <b-container fluid>
        <h1>Register</h1>

        <b-row>
          <b-form-row style="width: 100%">
            <b-col cols="12" sm="12" md="12">
              Name:
              <b-form-input
                type="text"
                v-model="form.name"
                id="name"
                placeholder="Enter name"
              ></b-form-input>
              <br />
            </b-col>

            <b-col cols="12" sm="12" md="12">
              <b-form @submit.stop.prevent>
                <label for="password">Password:</label>
                <b-input
                  type="password"
                  id="password"
                  v-model="form.password"
                  aria-describedby="password-help-block"
                  placeholder="Enter password"
                ></b-input>
                <br />
              </b-form>
            </b-col>

            <b-col cols="12" sm="12" md="12">
              Email:
              <b-form-input
                type="email"
                v-model="form.email"
                id="email"
                placeholder="Enter email"
              ></b-form-input>
              <br />
            </b-col>
          </b-form-row>
        </b-row>

        <b-button
          id="button"
          class="btn_submit"
          variant="primary"
          @click.prevent="signup"
        >
          register
        </b-button>

        <div style="margin-top: 15px">
          Already have an account?
          <a href="#" @click.prevent="$router.push('/login')">Login here</a>
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
      if (err && err.response && err.response.data && err.response.data.message) {
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

<style>
#background {
  width: 100%;
  height: 100%;
  background: url('../assets/res.jpeg');
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
  margin-top: 30px;
  text-align: center;
  margin-left: 1.5%;
  font-size: 25px;
}

#signup {
  background: white;
  padding: 60px;
  padding-top: 20px;
  border-radius: 10px;
}
</style>
