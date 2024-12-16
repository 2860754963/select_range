import _ from 'lodash';
import { getCurrentInstance, watch, ref, unref } from 'vue';
import dayjs from 'dayjs';

export const useDatePicker = (props) => {
  const { range } = props;

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
    if (!_.isArray(range)) {
      console.warn('传入时间范围不是数组');
      return false;
    }
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
    if (!props.defaultValue || !props.defaultValue.length) {
      return console.warn('请填默认值');
    }
    const tempArr = props.defaultValue.map((item) => dayjs(item));
    let start = tempArr[0];
    let end = tempArr[1] || tempArr[0];
    if (start.isSameOrAfter(end)) {
      [start, end] = [end, start];
    }
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
    minDate, //默认值的开始时间
    maxDate, //默认值的结束时间 或者是 默认值的开始时间
    leftDate, //左侧面板日期  默认值的开始时间
    rightDate, //右侧面板日期  默认值的开始时间加一年
    rangeState, //范围状态
    disabledDate, //禁用日期
    handleRangePick, //处理范围选择
    onSelect, // 选择日期
    handleChangeRange, //处理范围选择
  };
};
