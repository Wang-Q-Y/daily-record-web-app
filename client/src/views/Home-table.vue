<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead class="label">
        <tr>
          <th>Item-name</th>
          <th>Item-price</th>
          <th>Item-category</th>
           <th>operate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataList" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.price}}</td>
          <td>{{item.category}}</td>
          <td class="operate">
            <span v-if="item.total">total:{{item.total}}</span>
            <slot v-else name="operate" :row="item"></slot>
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
