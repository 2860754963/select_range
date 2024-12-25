import _ from 'lodash';
import { getCurrentInstance, watch, ref, unref } from 'vue';
import dayjs from 'dayjs';
// 将计算时间的相关操作单独抽一个hooks 之后做年份的时候可以复用 季度，年份时间单位不同而已
export const useDatePicker = (props) => {
  // 时间范围 超出该范围禁用
  const { range } = props;

  const { emit } = getCurrentInstance();
  // 默认值起始时间
  const minDate = ref();
  // 默认值结束时间
  const maxDate = ref();

  const rangeState = ref({
    endDate: null,
    selecting: false,
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
    // 更新范围状态时同时更新临时的结束日期
    rangeState.value = {
      ...val,
      endDate: val.endDate ? dayjs(val.endDate).startOf('year') : null
    };
  };

  const isValidRange = (range) => {
    if (!Array.isArray(range) || range.length !== 2) return false;
    const [left, right] = range;
    if (!left || !right) return false;
    return dayjs.isDayjs(left) && dayjs.isDayjs(right) && left.isSameOrBefore(right);
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
    
    // 添加日期验证
    if (!minDate_) return;
    
    // 第一次选择
    if (!maxDate_) {
      minDate.value = dayjs(minDate_).startOf('year');
      maxDate.value = null;
      return;
    }
    
    // 第二次选择
    const start = dayjs(minDate_).startOf('year');
    const end = dayjs(maxDate_).startOf('year');
    
    // 确保开始日期小于结束日期
    if (start.isAfter(end)) {
      minDate.value = end;
      maxDate.value = start;
    } else {
      minDate.value = start;
      maxDate.value = end;
    }
    
    handleRangeConfirm();
  };

  const restoreDefault = () => {
    // 确保 modelValue 是一个包含 dayjs 对象的数组
    const [start, end] = props.modelValue.map((item) => dayjs(item));
    minDate.value = start;
    maxDate.value = end;
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
    rangeState,
    disabledDate,
    handleRangePick,
    onSelect,
    handleChangeRange,
  };
};
