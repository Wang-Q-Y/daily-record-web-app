<template>
  <b-container fluid="md">
    <div class="col-12 col-md-12">
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

      <div class="row">
        <div class="col-sm-4">
          <b-avatar
            src="https://s2.loli.net/2022/10/05/tmrLkIqPJOEiDg9.jpg"
            class="center-block"
            size="230px"
          ></b-avatar>
        </div>

        <div class="col-sm-8">
          <h4><b>Profile</b></h4>

          <div class="input">
            Name:
            <b-form-input
              type="text"
              v-model="userinfo.name"
              disabled
            ></b-form-input>

            <br />

            <b-form @submit.stop.prevent>
              <label for="text-password">New Password:</label>
              <b-input
                type="password"
                id="text-password"
                v-model="newPassword"
                aria-describedby="password-help-block"
                :disabled="!isEditing"
                placeholder="Leave blank if you do not want to change it"
              ></b-input>

              <br />
            </b-form>

            Email:
            <b-form-input
              type="text"
              v-model="userinfo.email"
              :disabled="!isEditing"
            ></b-form-input>

            <br />
          </div>

          <b-button variant="info" @click="editing" v-if="!isEditing">
            Edit
          </b-button>

          <b-button
            @click="save"
            v-else-if="isEditing"
            variant="success"
          >
            Save
          </b-button>

          <b-button v-if="isEditing" @click="cancel">
            Cancel
          </b-button>

          <b-button variant="danger" @click="logout">
            log out
          </b-button>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import { Api } from '../Api'

export default {
  name: 'Userinfo',
  data() {
    return {
      isEditing: false,
      alertShow: false,
      variant: 'success',
      alertText: '',
      newPassword: '',
      userinfo: {
        name: '',
        email: ''
      }
    }
  },
  mounted() {
    this.getInFo()
  },
  methods: {
    getErrorMessage(err, defaultMessage) {
      if (err && err.response && err.response.data && err.response.data.message) {
        return err.response.data.message
      }
      return defaultMessage
    },

    getInFo() {
      Api.get('/users/me')
        .then((res) => {
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'User profile loaded successfully'
          this.userinfo = res.data
          this.newPassword = ''
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(
            err,
            'Cannot get user profile'
          )
        })
    },

    editing() {
      this.isEditing = true
    },

    cancel() {
      this.isEditing = false
      this.newPassword = ''
      this.getInFo()
    },

    save() {
      const payload = {
        email: this.userinfo.email
      }

      if (this.newPassword) {
        payload.password = this.newPassword
      }

      Api.put('/users/me', payload)
        .then((res) => {
          console.log(res)

          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'Profile updated successfully. Please log in again.'

          localStorage.removeItem('token')
          localStorage.removeItem('userInFo')
          localStorage.removeItem('password')

          window.dispatchEvent(new Event('auth-change'))

          setTimeout(() => {
            this.$router.replace('/login')
          }, 1000)
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(
            err,
            'Unable to update profile'
          )
        })
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userInFo')
      localStorage.removeItem('password')

      window.dispatchEvent(new Event('auth-change'))

      this.$router.replace('/login')
    }
  }
}
</script>

<style>
.row {
  padding: 20px;
}
</style>
