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
              </template> </HtTable
            ><br />
            <h4>items</h4>
            <br />
            <HtTable :dataList="itemList" :isOperate="true">
              <template slot-scope="scope">
                <td>{{ scope.row.name }}</td>
                <td>{{ scope.row.price }}</td>
                <td>{{ scope.row.category }}</td>
              </template>
              <!-- <template slot="operate" slot-scope="scope">
                <div style="display: flex; justify-content: center">
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="deleteItem(scope.row)"
                  >
                    delete-item
                  </button>
                </div>
              </template>  -->
              </HtTable
            ><br />
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
      form: {
        name: undefined,
        price: undefined,
        category: undefined
      },
      dataList: [],
      itemList: []
    }
  },
  mounted() {
    this.getList()
    this.getItemList()
  },
  methods: {
    getList() {
      Api.get('/users', {})
        .then((res) => {
          console.log(res)
          this.dataList = res.data.users
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.message
        })
    },

    deleteItem(e) {
      Api.delete('/items/' + e._id, {})
        .then((res) => {
          this.getItemList()
        })
        .catch((err) => {
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.message
        })
    },
    getItemList() {
      const id = JSON.parse(localStorage.getItem('userInFo'))._id
      if (!id) return
      Api.get('/user/' + id + '/items')
        .then((res) => {
          console.log(res)
          this.itemList = res.data.item
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.message
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
