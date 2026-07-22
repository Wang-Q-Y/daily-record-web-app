<template>
  <b-container fluid="md">
    <b-row>
      <div class="col-12 col-md-12">
        <div class="row" style="padding: 20px">
          <div style="width: 100%">
            <h4><b>Items</b></h4>
            <br />
          </div>
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
            <HtTable :dataList="dataList">
              <template slot-scope="scope">
                <td>{{ scope.row.name }}</td>
                <td>{{ scope.row.price }}</td>
                <td>{{ scope.row.category }}</td>
              </template>
            </HtTable>
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
  name: 'Item',
  components: { HtTable, HtAlert },
  data() {
    return {
      show: false,
      alertShow: false,
      alertText: '',
      variant: 'primary',
      formTitle: 'add',
      form: {
        name: undefined,
        price: undefined,
        category: undefined
      },
      dataList: []
    }
  },
  mounted() {
    // Load the selected item when the page is ready.
    this.getList()
  },
  methods: {
    getList() {
      const itemId = this.$route.query.id
      const token = localStorage.getItem('token')

      if (!token || !itemId) {
        return
      }

      Api.get('/items/' + itemId)
        .then((res) => {
          this.dataList = [res.data]
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText =
            err && err.response && err.response.data && err.response.data.message
              ? err.response.data.message
              : 'Unable to load item'
        })
    }
  }
}
</script>

<style scoped>
/* .form-group {
  display: flex;
  align-items: center;
}
.form-footer {
  display: flex;
  justify-content: center;
} */
h4 a {
  color: black;
}
</style>
