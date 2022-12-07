<template>
  <div>
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
    <b-container class="group"
      ><br />
      <h4>Items</h4>
      <div class="button-group">
        <button type="button" class="btn btn-outline-primary" @click="add()">
          add-items
        </button>
        <button type="button" class="btn btn-outline-danger" @click="delAll">
          deleteAll
        </button>
      </div>
      <div class="col-xs-12 col-md-12">
        <b-modal
          v-model="show"
          ref="labelModalShow"
          :title="formTitle"
          ok-title="save"
          cancel-title="close"
          :no-close-on-backdrop="false"
          :hide-footer="true"
        >
          <div class="modal-body">
            <form role="form">
              <div class="form-group">
                <label for="name">name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  placeholder="Name"
                />
              </div>
              <div class="form-group">
                <label for="name">price</label>
                <input
                  type="text"
                  class="form-control"
                  id="price"
                  v-model="form.price"
                  placeholder="Price"
                />
              </div>
              <div class="form-group">
                <label for="name">category</label>
                <input
                  type="text"
                  class="form-control"
                  id="category"
                  v-model="form.category"
                  placeholder="category"
                />
              </div>
              <div class="form-footer">
                <button type="button" class="btn btn-primary" @click="submitOk">
                  submit
                </button>
                <button type="button" class="btn btn-warning" @click="cancel">
                  cancel
                </button>
              </div>
            </form>
          </div>
        </b-modal>
        <HomeTable :dataList="dataList">
          <!-- <template slot-scope="scope">
            <td>{{ scope.row.name }}</td>
          </template>
          <template slot-scope="scope">
            <td>{{ scope.row.price }}</td>
          </template> -->
          <template slot="operate" slot-scope="scope">
            <div style="display: flex; justify-content: center">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="deleteItem(scope.row)"
              >
                delete
              </button>
            </div>
          </template> </HomeTable
        ><br />
      </div>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import HomeTable from './Home-table'

export default {
  name: 'Home',
  components: { HomeTable },
  data() {
    return {
      formTitle: 'add',
      form: {
        name: undefined,
        price: undefined,
        category: undefined
      },
      options: [
        { value: '', text: 'Select category' },
        { value: 'Burger', text: 'Burger' },
        { value: 'Pasta', text: 'Pasta' },
        { value: 'Drink', text: 'Drink' }
      ],
      dataList: [],
      show: false,
      alertShow: false,
      variant: 'success',
      alertText: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    add() {
      if (!localStorage.getItem('userInFo')) {
        this.variant = 'danger'
        this.alertShow = true
        return this.$router.push('/login')
      }
      this.formTitle = 'add'
      this.show = true
    },
    getList() {
      if (!this.$route.query.id && !localStorage.getItem('userInFo')) {
        return
      }
      const id =
        this.$route.query.id || JSON.parse(localStorage.getItem('userInFo'))._id
      Api.get('/user/' + id + '/items')
        .then((res) => {
          console.log(res)
          this.dataList = res.data.item
          const totalList = this.dataList.map((e) => e.price)
          if (totalList.length === 0) return
          const total = totalList.reduce((total, price) => total + price)
          this.dataList.push({
            name: '',
            price: '',
            category: '',
            total: total
          })
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.message
        })
    },
    submitOk() {
      // this.show = false
      const id = JSON.parse(localStorage.getItem('userInFo'))._id
      Api.post('/user/' + id + '/items', this.form)
        .then((res) => {
          console.log(res)
          this.variant = 'success'
          this.alertShow = true
          this.cancel()
          this.alertText = 'The request is successful'
          this.getList()
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = 'Cannot add items'
        })
    },
    cancel() {
      this.show = false
      this.form = {}
    },
    showItem(e) {
      this.$router.push({ path: '/item', query: { id: e._id } })
    },
    delAll() {
      const id = JSON.parse(localStorage.getItem('userInFo'))._id
      if (!id) return
      Api.delete('/user/' + id + '/items')
        .then((res) => {
          this.getList()
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'all items are deleted'
          //  localStorage.removeItem('userInFo')
        })
        .catch((err) => {
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.data.message
        })
    },
    deleteItem(e) {
      Api.delete('/items/' + e._id, {})
        .then((res) => {
          this.getList()
        })
        .catch((err) => {
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = err.message
        })
    }
  }
}
</script>

<style>
.group {
  font-size: 20px;
}
.form-group {
  display: flex;
  align-items: center;
}
.form-footer {
  display: flex;
  justify-content: center;
}
.button-group {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
