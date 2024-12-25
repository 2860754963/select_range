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

let halfYearRange = ['2020', '2024'];
let halfYearValue = [dayjs('2021-01-01'), dayjs('2021-12-31')];
const halfYearPick = (e) => {
  let [start, end] = e;
  console.log(
    '🚀🚀🚀 ~ halfYearPick ~ start🚀🚀🚀',
    dayjs(start).format('YYYY-MM-DD')
  );
  console.log(
    '🚀🚀🚀 ~ halfYearPick ~ end🚀🚀🚀',
    dayjs(end).format('YYYY-MM-DD')
  );
};

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
// console.log(getCurrentQuarterInfo(), 'getCurrentQuarterInfo()'); getCurrentQuarterInfo().startOfQuarter

let quarterRange = ['2020', '2024']; //可以传年份，也可以传具体的日期
let quarterValue = ['2021', '2022-10-01'];
const quarterPick = (e) => {
  console.log(e, 'e');
};

let yearRange = ['2022', '2025'];
let yearRangeValue = ref(['2025', '2025']);

let value2 = ref('');
const diableDate = (date) => {
  // 禁用今天及以前
  return date < new Date();
};
</script>

<style scoped>
.main {
  height: 100vh;
}
</style>
