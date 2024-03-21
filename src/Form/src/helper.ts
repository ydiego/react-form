import { ComponentType } from './types';

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];
export const dateItemType = [...DATE_TYPE, 'RangePicker'];

export const NO_AUTO_LINK_COMPONENTS: ComponentType[] = [
  'AutoComplete',
  // "Upload",
  // 'ImageUpload',
];
