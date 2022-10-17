<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead class="label">
        <tr>
          <th>Item-name</th>
           <th>operate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataList" :key="index">
          <slot :row="item"></slot>
          <td class="operate">
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
  name: 'Home-table',
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style>
</style>
