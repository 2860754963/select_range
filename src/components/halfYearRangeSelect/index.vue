<template>
  <div class="el-picker-panel el-date-range-picker date-range-picker">
    <div class="el-picker-panel__body-wrapper">
      <div class="el-picker-panel__body">
        <!-- 左侧 -->
        <div
          class="el-picker-panel__content el-date-range-picker__content is-left">
          <div class="el-date-range-picker__header">
            <button
              type="button"
              class="el-picker-panel__icon-btn d-arrow-left"
              @click="leftPrevYear">
              <el-icon><d-arrow-left /></el-icon>
            </button>
            <div>{{ leftLabel }}</div>
          </div>
          <BasicHalfYearTable
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :date="leftDate"
            :disabled-date="disabledDate"
            @pick="handleRangePick"
            @select="onSelect"
            @changerange="handleChangeRange" />
        </div>

        <div
          class="el-picker-panel__content el-date-range-picker__content is-right">
          <div class="el-date-range-picker__header">
            <button
              type="button"
              class="el-picker-panel__icon-btn d-arrow-right"
              @click="rightNextYear">
              <el-icon><d-arrow-right /></el-icon>
            </button>
            <div>{{ rightLabel }}</div>
          </div>
          <BasicHalfYearTable
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :date="rightDate"
            :disabled-date="disabledDate"
            @pick="handleRangePick"
            @select="onSelect"
            @changerange="handleChangeRange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useDatePicker, useDatePanel } from './hooks';
import BasicHalfYearTable from './src/BasicHalfYearTable.vue';

export default defineComponent({
  name: 'halfYearRangeSelect',
  components: {
    BasicHalfYearTable,
  },
  props: {
    range: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultValue: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  emits: ['pick'],
  setup(props) {
    const {
      leftDate,
      rightDate,
      minDate,
      maxDate,
      disabledDate,
      rangeState,
      onSelect,
      handleRangePick,
      handleChangeRange,
    } = useDatePicker(props);

    const { leftPrevYear, rightNextYear, leftLabel, rightLabel } = useDatePanel(
      {
        leftDate,
        rightDate,
      }
    );

    return {
      minDate,
      maxDate,
      disabledDate,
      rangeState,
      leftPrevYear,
      rightNextYear,
      leftLabel,
      rightLabel,
      leftDate,
      rightDate,
      onSelect,
      handleRangePick,
      handleChangeRange,
    };
  },
});
</script>

<style></style>
