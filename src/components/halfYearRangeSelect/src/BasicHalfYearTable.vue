<template>
  <table
    role="grid"
    class="el-half-year-table">
    <tbody>
      <tr class="el-date-table__row">
        <td
          v-for="(item, index) in rows"
          :key="index"
          :class="getCellStyle(item)"
          @click="handleHalfYearTableClick(item)">
          <div>
            <span class="cell">{{ item.text }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed, defineComponent } from 'vue';

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
    const rows = computed(() => {
      const rows = [];
      for (let i = 0; i < 2; i++) {
        const halfYearStart = props.date
          .clone()
          .startOf('year')
          .add(i * 6, 'month');
        const halfYearEnd = halfYearStart
          .clone()
          .add(6, 'month')
          .subtract(1, 'day');
        const cell = {
          text: i === 0 ? '上半年' : '下半年',
          inRange:
            !!props.minDate &&
            !!props.maxDate &&
            halfYearStart.isBefore(props.maxDate) &&
            halfYearEnd.isAfter(props.minDate),
          start: halfYearStart.isSame(props.minDate),
          end: halfYearEnd.isSame(props.maxDate),
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

    const handleHalfYearTableClick = (item) => {
      if (item.disabled) return;
      const halfYearStart = props.date
        .clone()
        .startOf('year')
        .add(item.text === '上半年' ? 0 : 6, 'month');
      emit('pick', {
        minDate: halfYearStart,
        maxDate: halfYearStart.clone().add(6, 'month').subtract(1, 'day'),
      });
    };

    return {
      rows,
      getCellStyle,
      handleHalfYearTableClick,
    };
  },
});
</script>
