<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead class='label'>
      <tr >
        <th>name </th>
        <th>price</th>
        <th>category</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for='(item,index) in dataList' :key='index'>
        <slot :row='item'></slot>
        <td class='operate'>
         <slot name='operate' :row='item'></slot>
        </td>
      </tr>
      </tbody>
    </table>
    <div style='text-align: center;width: 100%' v-if='dataList.length<=0'>There is no data</div>
  </div>
</template>

<script>
export default {
  name: 'Ht-table',
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

<style scoped>

</style>
