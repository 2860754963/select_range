<template>
  <table
    role="grid"
    class="el-month-table">
    <tbody>
      <tr>
        <td
          v-for="(item, key) in rows"
          :key="key"
          :class="getCellStyle(item)"
          @click="handleMonthTableClick"
          @mousemove="handleMouseMove">
          <!-- 参考的是 type="monthrange" 根据elementplus版本不同更换类名    "element-plus": "^2.9.1", -->
          <div class="el-date-table-cell">
            <!-- 参考的是 type="monthrange"  根据elementplus版本不同更换类名    "element-plus": "^2.9.1", -->
            <span class="el-date-table-cell__text">
              第{{ item.text }}季度
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { computed, defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear);
export default defineComponent({
  name: 'BasicQuarterTable',
  props: {
    minDate: {
      type: Object,
      default() {
        return null;
      },
    },
    maxDate: {
      type: Object,
      default() {
        return null;
      },
    },
    date: {
      type: Object,
      default() {
        return null;
      },
    },
    disabledDate: {
      type: Function,
      default() {
        return null;
      },
    },
    rangeState: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  emits: ['pick', 'select', 'changerange'],
  setup(props, { emit }) {
    const rows = computed(() => {
      const rows = [];
      const now = dayjs().startOf('quarter');
      for (let i = 1; i < 5; i++) {
        // 初始化单元格对象 设置默认属性
        const cell = {
          type: 'normal',
          inRange: false,
          start: false,
          end: false,
          text: null,
          disabled: false,
        };

        // 将props.date转换为Day.js对象，并将日期设置为所在年份的开始日期，然后获取第i个季度的开始日期
        const calTime = props.date.startOf('year').quarter(i);

        // 计算日期范围的结束日期
        const calEndDate =
          props.rangeState.endDate ||
          props.maxDate ||
          (props.rangeState.selecting && props.minDate) ||
          null;

        // 判断当前季度是否在给定的日期范围内
        cell.inRange =
          !!(
            props.minDate &&
            calTime.isSameOrAfter(props.minDate, 'quarter') &&
            calEndDate &&
            calTime.isSameOrBefore(calEndDate, 'quarter')
          ) ||
          !!(
            props.minDate &&
            calTime.isSameOrBefore(props.minDate, 'quarter') &&
            calEndDate &&
            calTime.isSameOrAfter(calEndDate, 'quarter')
          );

        // 根据给定的日期范围设置单元格的开始和结束状态
        if (props.minDate.isSameOrAfter(calEndDate)) {
          cell.start = !!(calEndDate && calTime.isSame(calEndDate, 'quarter'));
          cell.end = props.minDate && calTime.isSame(props.minDate, 'quarter');
        } else {
          // 当前单元格日期与props.minDate相同，则设置为开始季度
          cell.start = !!(
            props.minDate && calTime.isSame(props.minDate, 'quarter')
          );
          // 当前单元格日期与props.minDate相同，则设置为开始季度
          cell.end = !!(calEndDate && calTime.isSame(calEndDate, 'quarter'));
        }
        // 判断当前季度是否是今天所在的季度，如果是，则将单元格类型设置为'today'
        const isToday = now.isSame(calTime);
        if (isToday) {
          cell.type = 'today';
        }
        cell.text = calTime.quarter();
        cell.disabled = props.disabledDate?.(calTime.toDate()) || false;
        rows.push(cell);
      }
      return rows;
    });

    // 动态计算单元格的样式
    const getCellStyle = (cell) => {
      const style = {};
      const year = props.date.year();
      const quarter = cell.text;
      style.disabled = props.disabledDate
        ? props.disabledDate(
            dayjs().startOf('quarter').quarter(quarter).year(year)
          )
        : false;

      style.today = cell.type === 'today';

      if (cell.inRange) {
        style['in-range'] = true;

        if (cell.start) {
          style['start-date'] = true;
        }

        if (cell.end) {
          style['end-date'] = true;
        }
      }
      return style;
    };

    const hasClass = (el, cls) => {
      if (!el || !cls) return false;
      if (cls.includes(' '))
        throw new Error('className should not contain space.');
      return el.classList.contains(cls);
    };

    const handleMonthTableClick = (event) => {
      const target = event.target.closest('td');

      if (target?.tagName !== 'TD') return;
      if (hasClass(target, 'disabled')) return;

      const quarter = target.cellIndex + 1;
      const newDate = props.date.startOf('year').quarter(quarter);

      // 点击单元格 触发pick事件 将结束时间设置为null 此时因为maxDate改变rows重新计算
      if (!props.rangeState.selecting) {
        emit('pick', { minDate: newDate, maxDate: null });
        emit('select', true);
      } else {
        if (props.minDate && newDate >= props.minDate) {
          emit('pick', { minDate: props.minDate, maxDate: newDate });
        } else {
          emit('pick', { minDate: newDate, maxDate: props.minDate });
        }
        emit('select', false);
      }
    };

    // 存储最后一次选择的列索引  避免重复触发事件引起rows重新计算
    const lastColumn = ref();

    // 鼠标移入时频繁的触发changrange事件 改变maxData 引起rows重新计算 更改样式
    const handleMouseMove = (event) => {
      if (!props.rangeState.selecting) return;
      let target = event.target;

      if (target.tagName === 'A') {
        target = target.parentNode?.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (target.tagName !== 'TD') return;
      const column = target.cellIndex;
      if (rows.value[column].disabled) return;
      if (column !== lastColumn.value) {
        lastColumn.value = column;
        emit('changerange', {
          selecting: true,
          endDate: props.date.startOf('year').quarter(target.cellIndex + 1),
        });
      }
    };
    return {
      rows,
      getCellStyle,
      handleMonthTableClick,
      handleMouseMove,
    };
  },
});
</script>
