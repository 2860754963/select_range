<template>
  <el-popover
    width="auto"
    trigger="click"
    popper-class="popperClass">
    <template #reference>
      <div
        class="el-date-editor el-date-editor--monthrange el-input__wrapper el-range-editor el-tooltip__trigger el-tooltip__trigger">
        <!--参考 type: monthrange -->
        <i class="el-icon el-input__icon el-range__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"></path>
          </svg>
        </i>
        <input
          autocomplete="off"
          role="combobox"
          aria-expanded="false"
          aria-haspopup="dialog"
          :placeholder="startPlaceholder"
          class="el-range-input"
          :value="startValue" />
        <span class="el-range-separator">-</span>
        <input
          autocomplete="off"
          role="combobox"
          aria-expanded="false"
          aria-haspopup="dialog"
          :placeholder="endPlacholder"
          class="el-range-input"
          :value="endValue" />
      </div>
    </template>
    <div>
      <!-- 参考的是  type="year"  根据elementplus版本不同更换类名    "element-plus": "^2.9.1", -->
      <div class="el-picker-panel el-date-picker">
        <div class="el-picker-panel__body-wrapper">
          <div class="el-picker-panel__body">
            <div
              class="el-date-picker__header el-date-picker__header--bordered">
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
    </div>
  </el-popover>
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
    startPlaceholder: {
      type: String,
      default: '开始年份',
    },
    endPlacholder: {
      type: String,
      default: '结束年份',
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

    let startValue = '';
    let endValue = '';

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
      startValue,
      endValue,
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
