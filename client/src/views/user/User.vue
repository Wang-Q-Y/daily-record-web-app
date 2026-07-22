<template>
  <b-container fluid="md">
    <b-row>
      <div class="col-12 col-md-12">
        <div class="row" style="padding: 20px">
          <div style="width: 100%">
            <br />
            <h4><b>User</b></h4>

            <div style="width: 100%">
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
            </div>
          </div>

          <div class="col-xs-12 col-md-12">
            <HtTable :dataList="dataList">
              <template slot-scope="scope">
                <td>{{ scope.row.name }}</td>
                <td>{{ scope.row.email }}</td>
              </template>
            </HtTable>

            <br />

            <h4>items</h4>

            <br />

            <HtTable :dataList="itemList" :isOperate="true">
              <template slot-scope="scope">
                <td>{{ scope.row.name }}</td>
                <td>{{ scope.row.price }}</td>
                <td>{{ scope.row.category }}</td>
              </template>
            </HtTable>

            <br />
          </div>
        </div>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import HtTable from './Ht-table'
import { Api } from '../../Api'
import HtAlert from '@/components/Ht-alert'

export default {
  name: 'User',
  components: { HtTable, HtAlert },
  data() {
    return {
      alertShow: false,
      alertText: '',
      variant: 'primary',
      dataList: [],
      itemList: []
    }
  },
  mounted() {
    this.getCurrentUser()
    this.getItemList()
  },
  methods: {
    getErrorMessage(err, defaultMessage) {
      if (err && err.response && err.response.data && err.response.data.message) {
        return err.response.data.message
      }
      return defaultMessage
    },

    isAuthError(err) {
      return !!(err && err.response && (err.response.status === 401 || err.response.status === 403))
    },

    redirectToLogin() {
      localStorage.removeItem('token')
      localStorage.removeItem('userInFo')
      localStorage.removeItem('password')

      window.dispatchEvent(new Event('auth-change'))

      this.$router.replace('/login')
    },

    getCurrentUser() {
      Api.get('/users/me')
        .then((res) => {
          this.dataList = [res.data]
        })
        .catch((err) => {
          console.log('err', err)

          if (this.isAuthError(err)) {
            this.redirectToLogin()
            return
          }

          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(
            err,
            'Unable to load user information'
          )
        })
    },

    getItemList() {
      const userInfo = JSON.parse(localStorage.getItem('userInFo'))

      if (!userInfo || !userInfo._id) {
        return
      }

      Api.get('/items')
        .then((res) => {
          this.itemList = res.data.item
        })
        .catch((err) => {
          console.log('err', err)

          if (this.isAuthError(err)) {
            this.redirectToLogin()
            return
          }

          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(
            err,
            'Unable to load items'
          )
        })
    }
  }
}
</script>

<style scoped>
h4 {
  color: gray;
}
</style>
