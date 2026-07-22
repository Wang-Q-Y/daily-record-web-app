<template>
  <div>
    <div v-if="dataList.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </div>
      <h5>No spending records yet</h5>
      <p>Start by adding your first planned purchase.</p>
    </div>
    <div v-else class="table-responsive">
      <table class="record-table">
        <thead>
          <tr>
            <th>Item name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataList" :key="item._id">
            <td class="cell-name">{{ item.name }}</td>
            <td>{{ formatPrice(item.price) }} kr</td>
            <td class="cell-category">{{ item.category }}</td>
            <td class="cell-date">{{ formatDate(item.date) }}</td>
            <td class="col-actions">
              <button
                type="button"
                class="btn-edit"
                @click="$emit('edit-item', item)"
                aria-label="Edit item"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
                </svg>
              </button>
              <button
                type="button"
                class="btn-remove"
                @click="$emit('delete-item', item)"
                aria-label="Delete item"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home-table',
  props: {
    dataList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    formatPrice(price) {
      const value = Number(price) || 0
      return value.toLocaleString('sv-SE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    formatDate(dateValue) {
      if (!dateValue) {
        return '—'
      }

      const parsed = new Date(dateValue)

      if (isNaN(parsed.getTime())) {
        return '—'
      }

      return parsed.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  }
}
</script>
<style scoped>
.record-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 14px;
}

.record-table th:nth-child(1),
.record-table td:nth-child(1) {
  width: 26%;
}

.record-table th:nth-child(2),
.record-table td:nth-child(2) {
  width: 16%;
}

.record-table th:nth-child(3),
.record-table td:nth-child(3) {
  width: 22%;
}

.record-table th:nth-child(4),
.record-table td:nth-child(4) {
  width: 16%;
}

.record-table th:nth-child(5),
.record-table td:nth-child(5) {
  width: 20%;
}

.record-table thead th {
  text-align: left;
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a919c;
  border-bottom: 1px solid #e8eaed;
}

.record-table tbody tr {
  border-bottom: 1px solid #f0f1f3;
}

.record-table tbody tr:last-child {
  border-bottom: none;
}

.record-table tbody tr:hover {
  background: #fafbfc;
}

.record-table td {
  padding: 14px;
  vertical-align: middle;
  color: #1f2328;
}

.cell-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-category {
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-date {
  color: #8a919c;
  white-space: nowrap;
}

.col-actions {
  text-align: right;
  white-space: nowrap;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #8a919c;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  margin-right: 2px;
  transition: background 0.15s ease, color 0.15s ease;
}

.btn-edit:hover {
  background: #f0f1f3;
  color: #0f766e;
}

.btn-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #8a919c;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.15s ease, color 0.15s ease;
}

.btn-remove:hover {
  background: #f0f1f3;
  color: #b3261e;
}

.empty-state {
  padding: 64px 20px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  color: #c3c9d1;
}

.empty-state h5 {
  color: #14181c;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}
</style>
