<template>
  <!-- 参考的是  type="year"  根据elementplus版本不同更换类名    "element-plus": "^2.9.1", -->
  <div class="el-picker-panel el-date-picker">
    <div class="el-picker-panel__body-wrapper">
      <div class="el-picker-panel__body">
        <div class="el-date-picker__header el-date-picker__header--bordered">
          <span class="el-date-picker__prev-btn">
            <button
              type="button"
              class="d-arrow-left el-picker-panel__icon-btn"
              @click="moveByYear(false)">
              <el-icon><d-arrow-left /></el-icon>
            </button>
          </span>
          <span
            role="button"
            class="el-date-picker__header-label"
            aria-live="polite"
            tabindex="0"
            >{{ yearLabel }}</span
          >
          <span class="el-date-picker__next-btn">
            <button
              type="button"
              class="el-picker-panel__icon-btn d-arrow-right"
              @click="moveByYear(true)">
              <el-icon><d-arrow-right /></el-icon>
            </button>
          </span>
        </div>
        <div class="el-picker-panel__content">
          <BasicYearTable
            :min-date="minDate"
            :max-date="maxDate"
            :date="innerDate"
            :range-state="rangeState"
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
import { useDatePicker } from './hooks/useDatePicker';
import { useDatePanel } from './hooks/useDatePanel';
import BasicYearTable from './src/BasicYearTable.vue';
export default defineComponent({
  name: 'yearRangeSelect',
  components: {
    BasicYearTable,
  },
  props: {
    range: {
      type: Array,
      default() {
        return null;
      },
    },
    modelValue: {
      type: Array,
      require: true,
      default() {
        return null;
      },
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(props) {
    const {
      minDate,
      maxDate,
      disabledDate,
      rangeState,
      onSelect,
      handleRangePick,
      handleChangeRange,
    } = useDatePicker(props);

    const { innerDate, moveByYear, yearLabel } = useDatePanel({
      minDate,
    });

    return {
      minDate,
      maxDate,
      innerDate,
      rangeState,
      yearLabel,
      moveByYear,
      disabledDate,
      handleRangePick,
      onSelect,
      handleChangeRange,
    };
  },
});
</script>
<style>
.year-panel {
  width: 100%;
}
.year-panel .el-picker-panel__content {
  width: 100%;
  margin: 0px;
}
</style>
