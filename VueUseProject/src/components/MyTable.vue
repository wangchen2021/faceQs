<template>
    <el-table row-key="id" v-bind="props.tableConfig">
        <template v-for="(_, name) in slots" #[name]="scopedData">
            <slot v-bind="scopedData" :name="name"></slot>
        </template>
    </el-table>
</template>
<script setup lang="ts">
import type { TableProps } from 'element-plus';
import { defineProps, defineExpose, useSlots } from 'vue';

type Props = {
    getUrl: string
    tableConfig: TableProps<any>
}

const emits = defineEmits(['update'])

const props = defineProps<Props>()

const slots = useSlots()

console.log(slots);


const getTableData = () => {
    console.log(`获取表格数据从${props.getUrl}`);
    emits("update")
}

defineExpose({
    getTableData
})


getTableData()


</script>

<style scoped></style>