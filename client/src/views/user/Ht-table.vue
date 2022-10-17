<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead class="label">
        <tr>
          <th v-if="!isOperate">name</th>
          <th v-if="!isOperate">email</th>
          <th v-if="isOperate">name</th>
          <th v-if="isOperate">price</th>
          <th v-if="isOperate">category</th>
          <th v-if="isOperate">operate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataList" :key="index">
          <slot :row="item"></slot>
          <td class="operate" v-if="isOperate">
            <slot name="operate" :row="item"></slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="text-align: center; width: 100%" v-if="dataList.length <= 0">
      There is no data
    </div>
  </div>
</template>

<script>
export default {
  name: 'Ht-table',
  props: {
    isOperate: { type: Boolean, default: false },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style scoped>
</style>
