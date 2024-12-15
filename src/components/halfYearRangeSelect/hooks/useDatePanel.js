import { computed } from 'vue';

export const useDatePanel = ({ leftDate, rightDate }) => {
  const leftPrevYear = () => {
    leftDate.value = leftDate.value.subtract(1, 'year');
    rightDate.value = rightDate.value.subtract(1, 'year');
  };

  const rightNextYear = () => {
    leftDate.value = leftDate.value.add(1, 'year');
    rightDate.value = rightDate.value.add(1, 'year');
  };

  const leftLabel = computed(() => {
    return `${leftDate.value.year()}年`;
  });

  const rightLabel = computed(() => {
    return `${rightDate.value.year()}年`;
  });

  return {
    leftPrevYear,
    rightNextYear,
    leftLabel,
    rightLabel,
  };
};
