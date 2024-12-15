<template>
  <div>
    <h1>季度选择器</h1>
    <div>
      <quarterRangeSelect
        :range="quarterRange"
        :defaultValue="quarterValue"
        @pick="quarterPick"></quarterRangeSelect>
    </div>

    <div>
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD HH:mm:ss"
        date-format="YYYY/MM/DD ddd"
        time-format="A hh:mm:ss" />
    </div>
    <h1>年度选择器</h1>
    <div>
      <!-- <yearRangeSelect></yearRangeSelect> -->
    </div>
  </div>
</template>

<script setup>
/*
 * @Author: Nigulasi
 * @Date: 2024-12-15 11:54:13
 * @Last Modified by: Nigulasi
 * @Describe: useRange
 */

// import { ref, reactive, watch, computed, onMounted, onUnmounted } from 'vue';
import { ref } from 'vue';
import quarterRangeSelect from './quarterRangeSelect';
// import yearRangeSelect from './yearRangeSelect';

let quarterRange = ref(['2021', '2022']);
let quarterValue = ref(['2022']);
const quarterPick = (e) => {
  console.log(e, 'e');
};

let value2 = ref('');
</script>

<style scoped></style>
