import { computed, ref } from 'vue';
import _ from 'lodash';
export const useDatePanel = ({ minDate }) => {
  const innerDate = ref(_.cloneDeep(minDate.value));

  const year = computed(() => {
    return innerDate.value.year();
  });

  const yearLabel = computed(() => {
    const startYear = Math.floor(year.value / 10) * 10;
    return `${startYear} - ${startYear + 9}`;
  });

  /**
   * 切换时间
   * @param {*} forward
   */
  const moveByYear = (forward) => {
    const currentDate = innerDate.value;
    const action = forward ? 'add' : 'subtract';
    innerDate.value = currentDate[action](10, 'year');
  };
  return {
    innerDate,
    yearLabel,
    moveByYear,
  };
};
