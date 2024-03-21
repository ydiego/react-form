import {
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
} from 'antd';
import { ComponentType } from './types';

const componentMap = new Map<ComponentType, any>();
componentMap.set('Input', Input);
componentMap.set('InputGroup', Input.Group);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputSearch', Input.Search);
componentMap.set('InputTextArea', Input.TextArea);
componentMap.set('InputNumber', InputNumber);
componentMap.set('Select', Select);
componentMap.set('AutoComplete', AutoComplete);
componentMap.set('TreeSelect', TreeSelect);
componentMap.set('Switch', Switch);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);
componentMap.set('Cascader', Cascader);
componentMap.set('Slider', Slider);
componentMap.set('Rate', Rate);
componentMap.set('Transfer', Transfer);
componentMap.set('DatePicker', DatePicker);
componentMap.set('MonthPicker', DatePicker.MonthPicker);
componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('TimeRangePicker', TimePicker.RangePicker);
componentMap.set('Divider', Divider);

export { componentMap };
