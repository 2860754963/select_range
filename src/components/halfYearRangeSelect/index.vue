<template>
  <div>
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
    </el-popover>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
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
    startPlaceholder: {
      type: String,
      default: '开始季度',
    },
    endPlacholder: {
      type: String,
      default: '结束季度',
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

    const getHalf = (yearDate) => {
      const month = yearDate.month(); // 获取月份，0表示1月，11表示12月
      const year = yearDate.year(); // 获取年份
      if (month < 6) {
        return `${year}年上半年`;
      } else {
        return `${year}年下半年`;
      }
    };
    let startValue = computed(() => {
      if (props.defaultValue[0]) {
        return getHalf(props.defaultValue[0]);
      } else {
        return '';
      }
    });
    let endValue = computed(() => {
      if (props.defaultValue[1]) {
        return getHalf(props.defaultValue[1]);
      } else {
        return '';
      }
    });
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
      startValue,
      endValue,
    };
  },
});
</script>

<style></style>
