<script setup lang="ts">
import { reactive, ref } from 'vue';
import MyTable from './components/MyTable.vue';
const state = reactive({
  tableData: [
    { id: 1, name: "小长", age: 12 },
    { id: 2, name: "小段", age: 24 },
    { id: 3, name: "小去", age: 20 },
    { id: 4, name: "小和", age: 15 },
  ]
})



const MyTableRef = ref<InstanceType<typeof MyTable>>()

const getTableData = () => {
  MyTableRef.value?.getTableData()
}

const tableUpdate = () => {
  console.log("table update");
}

</script>

<template>
  <el-button @click="getTableData" type="primary">获取数据</el-button>
  <my-table @update="tableUpdate" ref="MyTableRef" :table-config="{ data: state.tableData }" :get-url="'getUrl'">
    <el-table-column label="姓名" prop="name"></el-table-column>
    <el-table-column label="年龄" prop="age"></el-table-column>
  </my-table>
</template>

<style scoped lang="less">
.div {
  font-size: 40px;
  color: @primary;
}
</style>
