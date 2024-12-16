<template>
  <table
    role="grid"
    class="el-month-table">
    <!-- 参考的是 type="monthrange" 根据elementplus版本不同更换类名    "element-plus": "^2.9.1", -->
    <tbody>
      <tr>
        <td
          v-for="(item, index) in rows"
          :key="index"
          :class="getCellStyle(item)"
          @click="handleHalfYearTableClick">
          <div class="el-date-table-cell">
            <!-- 参考的是 type="monthrange" 根据elementplus版本不同更换类名    "element-plus": "^2.9.1", -->
            <span class="el-date-table-cell__text">{{ item.text }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'BasicHalfYearTable',
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
    console.log('🚀🚀🚀 ~ setup ~ props🚀🚀🚀', props);
    const rows = computed(() => {
      const rows = [];
      const startOfYear = props.date.startOf('year'); //传入日期的开始年份
      const endOfYear = startOfYear.clone().add(6, 'month').endOf('year');
      for (let i = 1; i <= 2; i++) {
        const halfYearStart = startOfYear.add((i - 1) * 6, 'month');
        //半年开始时间

        const halfYearEnd = dayjs(halfYearStart)
          .clone()
          .add(6, 'month')
          .subtract(1, 'day');
        //半年结束时间
        console.log('🚀🚀🚀 ~ rows ~ halfYearStart🚀🚀🚀', halfYearStart);
        console.log('🚀🚀🚀 ~ rows ~ halfYearEnd🚀🚀🚀', halfYearEnd);
        console.log(
          '🚀🚀🚀 ~ rows ~  props.minDate🚀🚀🚀',
          dayjs(props.minDate).format('YYYY-MM-DD')
        );
        console.log(
          '🚀🚀🚀 ~ rows ~ props.maxDate🚀🚀🚀',
          dayjs(props.maxDate).format('YYYY-MM-DD')
        );

        const cell = {
          text: i === 1 ? '上半年' : '下半年',
          inRange:
            props.minDate &&
            props.maxDate &&
            halfYearStart.isSameOrAfter(props.minDate) &&
            halfYearEnd.isSameOrBefore(props.maxDate),
          start:
            halfYearStart.isSameOrBefore(props.minDate) &&
            halfYearEnd.isSameOrAfter(props.minDate),
          end:
            halfYearStart.isSameOrBefore(props.maxDate) &&
            halfYearEnd.isSameOrAfter(props.maxDate),
          disabled: props.disabledDate
            ? props.disabledDate(halfYearStart.toDate()) ||
              props.disabledDate(halfYearEnd.toDate())
            : false,
        };
        rows.push(cell);
      }
      return rows;
    });

    const getCellStyle = (cell) => {
      return {
        'in-range': cell.inRange,
        'start-date': cell.start,
        'end-date': cell.end,
        disabled: cell.disabled,
      };
    };

    const hasClass = (el, cls) => {
      if (!el || !cls) return false;
      if (cls.includes(' '))
        throw new Error('className should not contain space.');
      return el.classList.contains(cls);
    };
    const handleHalfYearTableClick = (event) => {
      const target = event.target.closest('td');
      if (target?.tagName !== 'TD') return;
      if (hasClass(target, 'disabled')) return;
      let itemText = event.target.innerText.trim();
      const isH1 = itemText === '上半年';
      const newDate = props.date.startOf('year').add(isH1 ? 0 : 6, 'month');
      console.log('🚀🚀🚀 ~ handleHalfYearTableClick ~ newDate🚀🚀🚀', newDate);

      if (!props.rangeState.selecting) {
        emit('pick', { minDate: newDate, maxDate: null });
        emit('select', true);
      } else {
        if (props.minDate && newDate >= props.minDate) {
          emit('pick', {
            minDate: props.minDate,
            maxDate: newDate.add(6, 'month').subtract(1, 'day'),
          });
        } else {
          emit('pick', {
            minDate: newDate,
            maxDate: props.minDate.add(6, 'month').subtract(1, 'day'),
          });
        }
        emit('select', false);
      }
    };

    return {
      rows,
      getCellStyle,
      handleHalfYearTableClick,
    };
  },
});
</script>
