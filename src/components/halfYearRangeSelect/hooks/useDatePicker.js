import { getCurrentInstance, watch, ref, unref } from 'vue';
import dayjs from 'dayjs';

export const useDatePicker = (props) => {
  console.log(props, 'props');

  const { range } = props;
  console.log(range, 'range123');

  const { emit } = getCurrentInstance();
  const minDate = ref();
  const maxDate = ref();
  const leftDate = ref();
  const rightDate = ref();
  const rangeState = ref({
    endDate: null,
    selecting: false,
  });

  const disabledDate = (cell) => {
    const [start, end] = range.map((item) => dayjs(item));
    return !(
      dayjs(cell).isSameOrAfter(start) && dayjs(cell).isSameOrBefore(end)
    );
  };

  const onSelect = (selecting) => {
    rangeState.value.selecting = selecting;
    if (!selecting) {
      rangeState.value.endDate = null;
    }
  };

  const handleChangeRange = (val) => {
    rangeState.value = val;
  };

  const isValidRange = (range) => {
    if (!_.isArray(range)) return false;
    const [left, right] = range;
    return (
      dayjs.isDayjs(left) && dayjs.isDayjs(right) && left.isSameOrBefore(right)
    );
  };

  const handleRangeConfirm = () => {
    const _minDate = unref(minDate);
    const _maxDate = unref(maxDate);
    if (isValidRange([_minDate, _maxDate])) {
      emit('pick', [_minDate, _maxDate]);
    }
  };

  const handleRangePick = (val) => {
    const minDate_ = val.minDate;
    const maxDate_ = val.maxDate;
    if (maxDate.value === maxDate_ && minDate.value === minDate_) {
      return;
    }
    maxDate.value = maxDate_;
    minDate.value = minDate_;

    handleRangeConfirm();
  };

  const restoreDefault = () => {
    const [start, end] = props.defaultValue.map((item) => dayjs(item));
    minDate.value = start;
    maxDate.value = end;
    leftDate.value = start;
    rightDate.value = start.add(1, 'year');
  };

  watch(
    () => props.defaultValue,
    (value) => {
      if (value) {
        restoreDefault();
      }
    },
    {
      immediate: true,
    }
  );

  return {
    minDate,
    maxDate,
    leftDate,
    rightDate,
    rangeState,
    disabledDate,
    handleRangePick,
    onSelect,
    handleChangeRange,
  };
};
