import { ColProps } from 'antd/es/grid/col';
import { Rule } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';

type RNode = React.ReactNode;

export interface FormItem {
  colon?: boolean;
  extra?: RNode;
  help?: RNode;
  label?: RNode;
  hasFeedback?: boolean;
  wrapperCol?: ColProps;
  labelCol?: ColProps;
  required?: boolean;
  validateStatus?: 'error' | 'success' | 'validating' | 'warning' | '';
  name?: NamePath;
  htmlFor?: string;
  labelAlign?: 'left' | 'right';
  rules?: Rule[];
  autoLink?: boolean;
  validateFirst?: boolean;
  validateTrigger?: string | string[] | false;
}
