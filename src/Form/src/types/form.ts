import { RuleObject } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';
import { RowProps } from 'antd/lib/grid/row';
import { CSSProperties } from 'react';
import { ComponentProps, ComponentType } from '.';
import { FormItem } from './formItems';

export type Rule = RuleObject & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
};

export type PropWithCallback<T = any, K = undefined> =
  | T
  | ((cbParam: RenderCallbackParams, opts?: K) => T);

export interface RenderCallbackParams {
  schema: FormSchemaInner;
  values: Recordable;
  model: Recordable;
  field: string;
}

export interface FormActions {
  submit: () => Promise<void>;
  setFieldsValue: (values: Recordable) => void;
  resetFields: () => Promise<void>;
  getFieldValue: (name: string) => any;
  getFieldsValue: () => Recordable;
  validate: (nameList?: NamePath[]) => Promise<void>;
  validateFields: (nameList?: NamePath[]) => Promise<void>;
  setProps: (props: Recordable) => Promise<void>;
}

export type RegisterFn = (formInstance: FormActions) => void;
export type UseFormReturnType = [RegisterFn, FormActions];

export type RenderOpts = {
  disabled: boolean;
  [key: string]: any;
};

interface BaseFormSchema<T extends ComponentType = any> {
  field: string;
  fields?: string[];
  label?: React.ReactNode;
  subLabel?: React.ReactNode;
  helpMessage?: PropWithCallback<string | string[]>;
  required?: PropWithCallback<boolean>;
  componentProps?:
    | ComponentProps[T]
    | ((opt: {
        schema: FormSchema;
        formActions: FormActions;
        formModel: Recordable;
      }) => ComponentProps[T]);
  rules?: Rule[];
  dynamicRules?: PropWithCallback<Rule[]>;
  defaultValue?: any;
  show?: PropWithCallback<boolean>;
  isFormatDate?: boolean;
  itemProps?: Partial<FormItem>;
  changeEvent?: string;
  render?: (
    cbParams: RenderCallbackParams,
    opts: RenderOpts
  ) => React.ReactNode;
}

export interface ComponentFormSchema<T extends ComponentType = any>
  extends BaseFormSchema<T> {
  component: T;
}

type ComponentFormSchemaType<T extends ComponentType = ComponentType> =
  T extends any ? ComponentFormSchema<T> : never;

export type FormSchema = ComponentFormSchemaType;

export type FormSchemaInner = Partial<ComponentFormSchema> & BaseFormSchema;

export interface FormProps {
  name?: string;
  layout?: 'vertical' | 'inline' | 'horizontal';
  // Form value
  model?: Recordable;
  labelWidth?: number | string;
  labelAlign?: 'left' | 'right';
  rowProps?: RowProps;
  submitOnReset?: boolean;
  submitOnChange?: boolean;
  baseRowStyle?: CSSProperties;
  // Form configuration rules
  schemas?: FormSchema[];
  // Function values used to merge into dynamic control form items
  mergeDynamicData?: Recordable;
  // Compact mode for search forms
  compact?: boolean;
  // Internal component size of the form
  size?: 'default' | 'small' | 'large';
  // Whether to disable
  disabled?: boolean;
  // Whether to readonly
  readonly?: boolean;
  formatRangeDate?: [string, [string, string], (string | [string, string])?][];
  // Placeholder is set automatically
  autoSetPlaceHolder?: boolean;
  // Auto submit on press enter on input
  autoSubmitOnEnter?: boolean;
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;
  // Whether to show collapse and expand buttons
  showAdvancedButton?: boolean;
  // Whether to focus on the first input box, only works when the first form item is input
  autoFocusFirstItem?: boolean;
  // Automatically collapse over the specified number of rows
  autoAdvancedLine?: number;
  alwaysShowLines?: number;
  showActionButtonGroup?: boolean;
  showResetButton?: boolean;
  showSubmitButton?: boolean;

  resetFunc?: () => Promise<void>;
  submitFunc?: () => Promise<void>;
  transformDateFunc?: (date: any) => string;
  colon?: boolean;
  //如果 showAdvancedButton 为 true，超过指定列数默认折叠，默认为3
  autoAdvancedCol?: number;
}
