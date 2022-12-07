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
              :disabled="!isEditing"
            ></b-form-input
            ><br />
            <b-form @submit.stop.prevent>
              <label for="text-password">Password:</label>
              <b-input
                type="password"
                id="text-password"
                v-model="userinfo.password"
                aria-describedby="password-help-block"
                :disabled="!isEditing"
              ></b-input
              ><br />
            </b-form>
            Email:
            <b-form-input
              type="text"
              v-model="userinfo.email"
              :disabled="!isEditing"
            ></b-form-input
            ><br />
          </div>
          <b-button variant="info" @click="editing" v-if="!isEditing"
            >Edit
          </b-button>
          <b-button
            @click="save(userinfo._id)"
            v-else-if="isEditing"
            variant="success"
            >Save</b-button
          >
          <b-button v-if="isEditing" @click="cancel">Cancel</b-button>
          <b-button variant="danger" @click="deleteUser(userinfo._id)"
            >log out
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
      user: {},
      isEditing: false,
      alertShow: false,
      variant: 'success',
      alertText: '',
      userinfo: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  mounted() {
    this.getInFo()
  },
  methods: {
    getInFo() {
      if (!localStorage.getItem('userInFo')) {
        return
      }
      const id = JSON.parse(localStorage.getItem('userInFo'))._id
      Api.get('/user/' + id)
        .then((res) => {
          console.log('get information', res)
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'The request is successful'
          console.log(res.data)
          this.userinfo = res.data
          this.userinfo.password = localStorage.getItem('password')
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = 'No user,cannot get user profile'
        })
    },
    editing() {
      this.isEditing = !this.isEditing
    },
    cancel() {
      this.isEditing = !this.isEditing
      this.getInFo()
    },
    save() {
      const id = JSON.parse(localStorage.getItem('userInFo'))._id
      Api.put('/users/' + id, this.userinfo)
        .then((res) => {
          console.log(res)
          this.isEditing = !this.isEditing
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'The request is successful'
          this.getInFo()
          localStorage.setItem('password', this.userinfo.password)
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.data.message
        })
    },

    deleteUser(id) {
      Api.delete('/user/' + id)
        .then((res) => {
          localStorage.clear()
          console.log(res)
          this.isEditing = !this.isEditing
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'The request is successful'
          this.getInFo()
          this.$router.push('/login')
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.data.message
        })
    }
  }
}
</script>

<style >
/* @media only screen and (min-device-width: 360px) and (max-device-height: 768px) {
  .center-block {
    width: 50%;
  }
} */
.row {
  padding: 20px;
}
</style>
