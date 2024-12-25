<template>
  <div class="main">
    <h1>季度选择器</h1>
    <div>
      <quarterRangeSelect
        :range="quarterRange"
        :defaultValue="quarterValue"
        @pick="quarterPick" />
    </div>
    <h1>年度选择器</h1>
    <div>
      <yearRangeSelect
        :range="yearRange"
        v-model="yearRangeValue" />
    </div>
    <h1>半年选择器</h1>
    <halfYearRangeSelect
      :range="halfYearRange"
      :defaultValue="halfYearValue"
      @pick="halfYearPick" />
    <div>
      <!-- <el-date-picker
        v-model="value2"
        type="monthrange"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD HH:mm:ss"
        date-format="YYYY/MM/DD ddd"
        time-format="A hh:mm:ss"
        :disabled-date="diableDate" /> -->
    </div>

    <div></div>
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
import dayjs from 'dayjs';
import quarterRangeSelect from './quarterRangeSelect';
import yearRangeSelect from './yearRangeSelect';
import halfYearRangeSelect from './halfYearRangeSelect';

let getCurrentQuarterInfo = () => {
  const now = dayjs();
  const currentQuarter = Math.floor((now.month() + 3) / 3);
  const startOfQuarter = now.startOf('quarter');
  const endOfQuarter = now.endOf('quarter');
  const quarterInfo = {
    currentTime: now.format('YYYY-MM-DD HH:mm:ss'),
    currentQuarter: currentQuarter,
    startOfQuarter: startOfQuarter.format('YYYY-MM-DD HH:mm:ss'),
    endOfQuarter: endOfQuarter.format('YYYY-MM-DD HH:mm:ss'),
  };

  return quarterInfo;
};

// 半年选择器
let halfYearRange = ['2020', '2024'];
let halfYearValue = ref([dayjs('2021-01-01'), dayjs('2021-12-31')]);
const halfYearPick = (e) => {
  let [start, end] = e;
  halfYearValue.value = [start, end];
};

// 季度选择器
let quarterRange = ['2020', '2024']; //可以传年份，也可以传具体的日期
let quarterValue = ref(['2021', '2022-10-01']);
const quarterPick = (e) => {
  let [start, end] = e;
  quarterValue.value = [start, end];
};

// 年份选择器
let yearRange = ['2021', '2028'];
let yearRangeValue = ref(['2024', '2025']);
</script>

<style scoped>
.main {
  height: 100vh;
}
</style>
