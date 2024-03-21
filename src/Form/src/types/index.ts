export type DATET_TYPES =
  | 'DatePicker'
  | 'MonthPicker'
  | 'WeekPicker'
  | 'TimePicker'
  | 'RangePicker';

export type ComponentType = keyof ComponentList;

export type ComponentList = {
  Input: typeof import('antd/es/input')['default'];
  InputGroup: typeof import('antd/es/input')['default']['Group'];
  InputPassword: typeof import('antd/es/input')['default']['Password'];
  InputSearch: typeof import('antd/es/input')['default']['Search'];
  InputTextArea: typeof import('antd/es/input')['default']['TextArea'];
  InputNumber: typeof import('antd/es/input-number')['default'];
  Select: typeof import('antd/es/select')['default'];
  AutoComplete: typeof import('antd/es/auto-complete')['default'];
  Cascader: typeof import('antd/es/cascader')['default'];
  Checkbox: typeof import('antd/es/checkbox')['default'];
  CheckboxGroup: typeof import('antd/es/checkbox')['default']['Group'];
  DatePicker: typeof import('antd/es/date-picker')['default'];
  Divider: typeof import('antd/es/divider')['default'];
  RadioGroup: typeof import('antd/es/radio')['Group'];
  Rate: typeof import('antd/es/rate')['default'];
  Slider: typeof import('antd/es/slider')['default'];
  Switch: typeof import('antd/es/switch')['default'];
  TimePicker: typeof import('antd/es/time-picker')['default'];
  WeekPicker: typeof import('antd/es/date-picker')['default']['WeekPicker'];
  MonthPicker: typeof import('antd/es/date-picker')['default']['MonthPicker'];
  RangePicker: typeof import('antd/es/date-picker')['default']['RangePicker'];
  TimeRangePicker: typeof import('antd/es/time-picker')['default']['RangePicker'];
  TreeSelect: typeof import('antd/es/tree-select')['default'];
  Transfer: typeof import('antd/es/transfer')['default'];
};

type GenCP<
  T extends {
    [key: string]:
      | React.JSXElementConstructor<any>
      | keyof React.JSX.IntrinsicElements;
  }
> = {
  [K in keyof T]: React.ComponentProps<T[K]>;
};

export type ComponentProps = GenCP<ComponentList>;
