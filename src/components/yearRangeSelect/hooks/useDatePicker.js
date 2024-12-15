import _ from 'lodash';
import { getCurrentInstance, watch, ref, unref } from 'vue';
import dayjs from 'dayjs';
// 将计算时间的相关操作单独抽一个hooks 之后做年份的时候可以复用 季度，年份时间单位不同而已
export const useDatePicker = (props) => {
  // 时间范围 超出该范围禁用
  console.log(props, 'props');

  const { range } = props;

  const { emit } = getCurrentInstance();
  // 默认值起始时间
  const minDate = ref();
  // 默认值结束时间
  const maxDate = ref();
  // 左侧面板时间 ps：面板时间与默认值时间无关 只是用于面板title显示 不需要过于纠结
  const leftDate = ref();
  // 右侧面板时间
  const rightDate = ref();

  const rangeState = ref({
    endDate: null,
    selecing: false,
  });

  const disabledDate = (cell) => {
    // range 不存在  不做禁用
    if (!range) {
      return false;
    }

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
      emit(
        'change',
        [_minDate, _maxDate].map((_) => _.toDate())
      );
      emit(
        'update:modelValue',
        [_minDate, _maxDate].map((_) => _.toDate())
      );
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
    // 将默认转为dayjs时间对象
    const [start, end] = props.modelValue.map((item) => dayjs(item));
    console.log(start, 'start');
    console.log(end, 'end');

    minDate.value = start;
    maxDate.value = end || start;
    leftDate.value = start;
    rightDate.value = start.add(1, 'year');
  };

  watch(
    () => props.modelValue,
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
