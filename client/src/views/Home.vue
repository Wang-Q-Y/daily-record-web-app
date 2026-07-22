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

    <b-container class="dashboard">
      <div class="dashboard-header">
        <div>
          <h2>Daily Record</h2>
          <p>Track your planned purchases, item prices, and spending records in one place.</p>
        </div>

        <button type="button" class="btn-add" @click="add">
          <span class="btn-add-icon">+</span>
          Add item
        </button>
      </div>

      <div class="summary-grid">
        <div class="summary-card card-teal">
          <div class="summary-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2Z" />
              <circle cx="16.5" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div>
            <p class="summary-label">Total spending</p>
            <h3>{{ totalSpending }} kr</h3>
          </div>
        </div>

        <div class="summary-card card-blue">
          <div class="summary-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <div>
            <p class="summary-label">Total items</p>
            <h3>{{ dataList.length }}</h3>
          </div>
        </div>

        <div class="summary-card card-purple">
          <div class="summary-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7l4-4 4 4M7 3v14M21 17l-4 4-4-4M17 21V7" />
            </svg>
          </div>
          <div>
            <p class="summary-label">Categories</p>
            <h3>{{ categoryCount }}</h3>
          </div>
        </div>
      </div>

      <div v-if="dataList.length > 0" class="chart-toggle-row">
        <button type="button" class="btn-toggle-chart" @click="showChartBreakdown = !showChartBreakdown">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :style="{ transform: showChartBreakdown ? 'rotate(90deg)' : 'rotate(0deg)' }"
            class="toggle-chevron"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          {{ showChartBreakdown ? 'Hide spending breakdown' : 'View spending breakdown' }}
        </button>
      </div>

      <div v-if="showChartBreakdown && dataList.length > 0" class="chart-section">
        <p class="chart-title">Spending by category</p>
        <div class="chart-body">
          <div class="donut-wrap">
            <svg width="150" height="150" viewBox="0 0 120 120" class="donut-chart">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#eceef1" stroke-width="14" />
              <circle
                v-for="segment in chartSegments"
                :key="segment.category"
                cx="60"
                cy="60"
                r="50"
                fill="none"
                :stroke="segment.color"
                stroke-width="14"
                stroke-linecap="round"
                :stroke-dasharray="segment.dashArray"
                :stroke-dashoffset="segment.dashOffset"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div class="donut-center">
              <span class="donut-total">{{ totalSpending }}</span>
              <span class="donut-total-label">kr total</span>
            </div>
          </div>

          <div class="chart-legend">
            <div
              v-for="segment in chartSegments"
              :key="'legend-' + segment.category"
              class="legend-cell"
            >
              <span class="legend-dot" :style="{ background: segment.color }"></span>
              <div class="legend-info">
                <p class="legend-label">{{ segment.category }}</p>
                <p class="legend-sub">{{ formatAmount(segment.amount) }} kr · {{ Math.round(segment.percentage) }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-wrap">
          <span class="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            class="search-input"
            v-model="searchText"
            placeholder="Search items by name..."
          />
        </div>

        <select class="category-select" v-model="selectedCategory">
          <option value="">All categories</option>
          <option
            v-for="category in categoryOptions"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>

        <select class="category-select" v-model="sortBy">
          <option value="">Sort by</option>
          <option value="date">Date</option>
          <option value="price">Price</option>
        </select>

        <button
          type="button"
          class="btn-delete-all"
          @click="delAll"
          :disabled="dataList.length === 0"
        >
          Delete all
        </button>
      </div>

      <div class="card-list-section">
        <HomeTable
          :dataList="filteredList"
          @delete-item="deleteItem"
          @edit-item="editItem"
        />
      </div>

      <b-modal
        v-model="show"
        ref="labelModalShow"
        :title="formTitle"
        ok-title="Save"
        cancel-title="Close"
        :no-close-on-backdrop="false"
        :hide-footer="true"
      >
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label for="name">Item name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="form.name"
                placeholder="For example: Apple"
              />
            </div>

            <div class="form-group">
              <label for="price">Price</label>
              <input
                type="number"
                class="form-control"
                id="price"
                v-model="form.price"
                placeholder="For example: 12"
              />
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select class="form-control" id="category" v-model="form.category">
                <option value="" disabled>Select a category</option>
                <option v-for="option in categoryPresets" :key="option" :value="option">
                  {{ option }}
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group" v-if="form.category === 'Other'">
              <label for="category-note">Note</label>
              <input
                type="text"
                class="form-control"
                id="category-note"
                v-model="form.categoryNote"
                placeholder="Describe the category"
              />
            </div>

            <div class="form-group">
              <label for="date">Date</label>
              <input
                type="date"
                class="form-control"
                id="date"
                v-model="form.date"
              />
            </div>

            <div class="form-footer">
              <button type="button" class="btn-save" @click="submitOk">
                Save item
              </button>

              <button type="button" class="btn-cancel" @click="cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </b-modal>

      <b-modal
        v-model="confirmModal.show"
        title="Confirm delete"
        :hide-footer="true"
        :no-close-on-backdrop="false"
      >
        <div class="modal-body">
          <p class="confirm-message">{{ confirmModal.message }}</p>

          <div class="form-footer">
            <button type="button" class="btn-danger-solid" @click="confirmAction">
              Delete
            </button>

            <button type="button" class="btn-cancel" @click="cancelConfirm">
              Cancel
            </button>
          </div>
        </div>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import { Api } from '@/Api'
import HomeTable from './Home-table'
import HtAlert from '@/components/Ht-alert'

const CHART_COLORS = [
  '#0f766e',
  '#378ADD',
  '#7F77DD',
  '#D85A30',
  '#D4537E',
  '#BA7517',
  '#639922',
  '#888780',
  '#E24B4A',
  '#9C8B3F',
  '#2A6F97'
]

const CATEGORY_PRESETS = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Education',
  'Travel',
  'Subscriptions'
]

export default {
  name: 'Home',
  components: { HomeTable, HtAlert },
  data() {
    return {
      formTitle: 'Add item',
      form: {
        name: '',
        price: '',
        category: '',
        categoryNote: '',
        date: ''
      },
      editingId: null,
      categoryPresets: CATEGORY_PRESETS,
      dataList: [],
      searchText: '',
      selectedCategory: '',
      sortBy: '',
      showChartBreakdown: false,
      show: false,
      alertShow: false,
      variant: 'success',
      alertText: '',
      confirmModal: {
        show: false,
        message: '',
        action: null
      }
    }
  },
  computed: {
    totalSpending() {
      const total = this.dataList.reduce(function (sum, item) {
        const price = Number(item.price) || 0
        return sum + price
      }, 0)

      return total.toLocaleString('sv-SE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    categoryOptions() {
      const categories = this.dataList
        .map(function (item) {
          return item.category
        })
        .filter(function (category) {
          return category
        })

      return Array.from(new Set(categories))
    },

    categoryCount() {
      return this.categoryOptions.length
    },

    filteredList() {
      const searchText = this.searchText.toLowerCase()
      const selectedCategory = this.selectedCategory

      const filtered = this.dataList.filter(function (item) {
        const itemName = item.name ? item.name.toLowerCase() : ''
        const itemCategory = item.category || ''

        const matchesSearch = itemName.indexOf(searchText) !== -1
        const matchesCategory =
          selectedCategory === '' || itemCategory === selectedCategory

        return matchesSearch && matchesCategory
      })

      const sortBy = this.sortBy

      if (sortBy === 'date') {
        return filtered.slice().sort(function (a, b) {
          return new Date(a.date || 0) - new Date(b.date || 0)
        })
      }

      if (sortBy === 'price') {
        return filtered.slice().sort(function (a, b) {
          return (Number(a.price) || 0) - (Number(b.price) || 0)
        })
      }

      return filtered
    },

    categoryBreakdown() {
      const totals = {}
      const order = []

      this.dataList.forEach(function (item) {
        const key = item.category || 'Uncategorized'
        const price = Number(item.price) || 0

        if (!(key in totals)) {
          totals[key] = 0
          order.push(key)
        }

        totals[key] += price
      })

      const grandTotal = order.reduce(function (sum, key) {
        return sum + totals[key]
      }, 0)

      return order
        .map(function (key, index) {
          const amount = totals[key]
          const percentage = grandTotal > 0 ? (amount / grandTotal) * 100 : 0

          return {
            category: key,
            amount: amount,
            percentage: percentage,
            color: CHART_COLORS[index % CHART_COLORS.length]
          }
        })
        .sort(function (a, b) {
          return b.percentage - a.percentage
        })
    },

    chartSegments() {
      const circumference = 2 * Math.PI * 50
      let cumulative = 0

      return this.categoryBreakdown.map(function (entry) {
        const dash = (entry.percentage / 100) * circumference
        const gap = circumference - dash
        const offset = -((cumulative / 100) * circumference)

        cumulative += entry.percentage

        return Object.assign({}, entry, {
          dashArray: dash + ' ' + gap,
          dashOffset: offset
        })
      })
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatAmount(value) {
      return (Number(value) || 0).toLocaleString('sv-SE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    getErrorMessage(err, defaultMessage) {
      if (err && err.response && err.response.data && err.response.data.message) {
        return err.response.data.message
      }

      if (err && err.message) {
        return err.message
      }

      return defaultMessage
    },

    openConfirm(message, action) {
      this.confirmModal = {
        show: true,
        message: message,
        action: action
      }
    },

    confirmAction() {
      const action = this.confirmModal.action
      this.confirmModal.show = false

      if (action) {
        action()
      }
    },

    cancelConfirm() {
      this.confirmModal.show = false
    },

    add() {
      if (!localStorage.getItem('token')) {
        this.variant = 'danger'
        this.alertShow = true
        this.alertText = 'Please log in first'
        this.$router.push('/login')
        return
      }

      this.formTitle = 'Add item'
      this.editingId = null
      this.form = {
        name: '',
        price: '',
        category: '',
        categoryNote: '',
        date: ''
      }
      this.show = true
    },

    editItem(item) {
      if (!localStorage.getItem('token')) {
        this.variant = 'danger'
        this.alertShow = true
        this.alertText = 'Please log in first'
        this.$router.push('/login')
        return
      }

      const isPreset = this.categoryPresets.indexOf(item.category) !== -1

      this.formTitle = 'Edit item'
      this.editingId = item._id
      this.form = {
        name: item.name || '',
        price: item.price,
        category: isPreset ? item.category : 'Other',
        categoryNote: isPreset ? '' : item.category || '',
        date: this.toDateInputValue(item.date)
      }
      this.show = true
    },

    toDateInputValue(dateValue) {
      if (!dateValue) {
        return ''
      }

      const parsed = new Date(dateValue)

      if (isNaN(parsed.getTime())) {
        return ''
      }

      const year = parsed.getFullYear()
      const month = String(parsed.getMonth() + 1).padStart(2, '0')
      const day = String(parsed.getDate()).padStart(2, '0')

      return year + '-' + month + '-' + day
    },

    getList() {
      if (!localStorage.getItem('token')) {
        return
      }

      Api.get('/items')
        .then((res) => {
          this.dataList = res.data.item || []
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(err, 'Unable to load items')
        })
    },

    submitOk() {
      if (!this.form.name || !this.form.price || !this.form.category) {
        this.variant = 'danger'
        this.alertShow = true
        this.alertText = 'Please fill in item name, price, and category'
        return
      }

      if (this.form.category === 'Other' && !this.form.categoryNote) {
        this.variant = 'danger'
        this.alertShow = true
        this.alertText = 'Please add a note describing the category'
        return
      }

      if (!localStorage.getItem('token')) {
        this.variant = 'danger'
        this.alertShow = true
        this.alertText = 'Please log in first'
        this.$router.push('/login')
        return
      }

      const effectiveCategory =
        this.form.category === 'Other' ? this.form.categoryNote.trim() : this.form.category

      const payload = {
        name: this.form.name,
        price: Number(this.form.price),
        category: effectiveCategory
      }

      if (this.form.date) {
        payload.date = this.form.date
      }

      const isEditing = !!this.editingId

      const request = isEditing
        ? Api.put('/items/' + this.editingId, payload)
        : Api.post('/items', payload)

      request
        .then(() => {
          this.variant = 'success'
          this.alertShow = true
          this.alertText = isEditing ? 'Item updated successfully' : 'Item added successfully'
          this.cancel()
          this.getList()
        })
        .catch((err) => {
          console.log('err', err)
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(
            err,
            isEditing ? 'Cannot update item' : 'Cannot add item'
          )
        })
    },

    cancel() {
      this.show = false
      this.editingId = null
      this.form = {
        name: '',
        price: '',
        category: '',
        categoryNote: '',
        date: ''
      }
    },

    delAll() {
      if (this.dataList.length === 0) {
        return
      }

      this.openConfirm('Are you sure you want to delete all items?', this.performDeleteAll)
    },

    performDeleteAll() {
      if (!localStorage.getItem('token')) {
        return
      }

      Api.delete('/items')
        .then(() => {
          this.getList()
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'All items have been deleted'
        })
        .catch((err) => {
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(err, 'Unable to delete items')
        })
    },

    deleteItem(item) {
      const itemName = item.name ? '"' + item.name + '"' : 'this item'
      this.openConfirm('Are you sure you want to delete ' + itemName + '?', function () {
        this.performDeleteItem(item)
      }.bind(this))
    },

    performDeleteItem(item) {
      Api.delete('/items/' + item._id)
        .then(() => {
          this.getList()
          this.variant = 'success'
          this.alertShow = true
          this.alertText = 'Item deleted successfully'
        })
        .catch((err) => {
          this.variant = 'danger'
          this.alertShow = true
          this.alertText = this.getErrorMessage(err, 'Unable to delete item')
        })
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 48px 16px 64px;
  max-width: 960px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2328;
  background: #fafbfc;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 36px;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid #eceef1;
}

.dashboard-header h2 {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 6px;
  color: #14181c;
}

.dashboard-header p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  max-width: 420px;
  line-height: 1.5;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f766e;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(15, 118, 110, 0.15), 0 4px 10px rgba(15, 118, 110, 0.18);
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-add:hover {
  background: #0c5c56;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(15, 118, 110, 0.2), 0 6px 14px rgba(15, 118, 110, 0.22);
}

.btn-add-icon {
  font-size: 16px;
  line-height: 1;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 14px;
  padding: 18px 20px;
  transition: transform 0.15s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.card-teal {
  background: #e7f4f2;
}

.card-blue {
  background: #e8f0fb;
}

.card-purple {
  background: #efeefc;
}

.card-teal .summary-icon {
  background: #ffffff;
  color: #0f766e;
}

.card-blue .summary-icon {
  background: #ffffff;
  color: #2563a8;
}

.card-purple .summary-icon {
  background: #ffffff;
  color: #6c5fc7;
}

.card-teal .summary-label {
  color: #0f766e;
}

.card-blue .summary-label {
  color: #2563a8;
}

.card-purple .summary-label {
  color: #6c5fc7;
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  flex-shrink: 0;
}

.summary-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 4px;
}

.summary-card h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #14181c;
}

.chart-toggle-row {
  margin-bottom: 12px;
}

.btn-toggle-chart {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #0f766e;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 0;
  cursor: pointer;
}

.btn-toggle-chart:hover {
  text-decoration: underline;
}

.toggle-chevron {
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.chart-section {
  background: #ffffff;
  border: 1px solid #e8eaed;
  border-radius: 14px;
  padding: 28px 32px;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 24px;
}

.chart-body {
  display: flex;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
}

.donut-wrap {
  position: relative;
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.donut-chart {
  display: block;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.donut-total {
  font-size: 18px;
  font-weight: 600;
  color: #14181c;
  line-height: 1.2;
}

.donut-total-label {
  font-size: 11px;
  color: #8a919c;
  margin-top: 2px;
}

.chart-legend {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 20px;
  flex: 1;
  min-width: 260px;
  max-height: 190px;
  overflow-y: auto;
  padding-right: 4px;
}

.legend-cell {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.legend-info {
  min-width: 0;
}

.legend-label {
  color: #1f2328;
  font-weight: 500;
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-sub {
  color: #8a919c;
  font-size: 12px;
  margin: 2px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9aa1ab;
  display: flex;
}

.search-input {
  width: 100%;
  height: 42px;
  border: 1px solid #e0e3e7;
  border-radius: 999px;
  padding: 0 16px 0 40px;
  font-size: 14px;
  color: #1f2328;
  background: #ffffff;
  transition: border-color 0.15s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0f766e;
}

.category-select {
  height: 42px;
  min-width: 160px;
  border: 1px solid #e0e3e7;
  border-radius: 999px;
  padding: 0 16px;
  font-size: 14px;
  color: #1f2328;
  background: #ffffff;
}

.category-select:focus {
  outline: none;
  border-color: #0f766e;
}

.btn-delete-all {
  height: 42px;
  padding: 0 16px;
  border: none;
  background: transparent;
  color: #b3261e;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.btn-delete-all:hover:not(:disabled) {
  background: #fdf2f1;
}

.btn-delete-all:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.card-list-section {
  width: 100%;
}

.form-group {
  display: block;
  text-align: left;
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 6px;
}

.form-group .form-control {
  width: 100%;
  height: 40px;
  border: 1px solid #e0e3e7;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
}

.form-group .form-control:focus {
  outline: none;
  border-color: #0f766e;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.confirm-message {
  font-size: 15px;
  color: #1f2328;
  line-height: 1.5;
  margin: 0;
}

.btn-danger-solid {
  background: #b3261e;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-danger-solid:hover {
  background: #921f18;
}

.btn-save {
  background: #0f766e;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-save:hover {
  background: #0c5c56;
}

.btn-cancel {
  background: #ffffff;
  color: #4b5563;
  border: 1px solid #e0e3e7;
  border-radius: 999px;
  padding: 9px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #f5f6f7;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .category-select {
    min-width: 0;
  }
}
</style>
