import { Form } from 'antd';
import { cloneDeep, isFunction, isNull, upperFirst } from 'lodash-es';
import { useMemo } from 'react';
import { componentMap } from '../componentMap';
import { NO_AUTO_LINK_COMPONENTS } from '../helper';
import { FormActions, FormProps, FormSchema } from '../types/form';

type FormItemProps = {
  schema: FormSchema;
  formProps: FormProps;
  formModel: Recordable;
  formActions: FormActions;
  setFormModel: (key: string, value: any, schema: FormSchema) => void;
};

const FormItem: React.FC<FormItemProps> = (props) => {
  const getValues = useMemo(() => {
    const { schema, formModel } = props;
    return {
      schema,
      field: schema.field,
      values: {
        ...formModel,
      },
      model: formModel,
    };
  }, [props]);
  const getComponentsProps = useMemo(() => {
    const { schema, formModel, formActions } = props;
    let { componentProps = {} } = schema;
    if (isFunction(componentProps)) {
      componentProps = componentProps({ schema, formModel, formActions }) ?? {};
    }
    return componentProps as Recordable<any>;
  }, [props]);

  const renderComponent = () => {
    const { component, field, label, changeEvent = 'change' } = props.schema;
    const isCheck = component && ['Switch', 'Checkbox'].includes(component);
    const event = `on${upperFirst(changeEvent)}`;
    const on = {
      [event]: (...args: Nullable<Recordable<any>>[]) => {
        const [e] = args;
        const target = e ? e.target : null;
        const value = target ? (isCheck ? target.checked : target.value) : e;
        props.setFormModel(field, value, props.schema);
      },
    };
    let placeholder = getComponentsProps?.placeholder ?? `请输入${label}`;
    if (component.includes('Picker')) {
      placeholder = undefined;
    }
    const Comp = componentMap.get(component);
    const compAttrs = {
      ...getComponentsProps,
      ...on,
      placeholder,
    };
    return <Comp {...compAttrs}></Comp>;
  };

  const renderItem = () => {
    const {
      field,
      label,
      component,
      render,
      required,
      show = true,
      rules: defaultRules = [],
    } = props.schema;
    const isShow = isFunction(show) ? show(getValues) : show;
    if (!isShow) return null;
    const isRequired = isFunction(required)
      ? required({
          field,
          model: props.formModel,
          values: {
            ...props.formModel,
          },
          schema: props.schema,
        })
      : required;

    let rules = cloneDeep(defaultRules);
    function validator(rule: any, value: any) {
      const msg = rule.message || `请填写${label}`;
      if (value === undefined || isNull(value)) return Promise.reject(msg);

      if (Array.isArray(value) && value.length === 0)
        return Promise.reject(msg);

      if (typeof value === 'string' && value.trim() === '')
        return Promise.reject(msg);
      if (
        typeof value === 'object' &&
        Reflect.has(value, 'checked') &&
        Reflect.has(value, 'halfChecked') &&
        Array.isArray(value.checked) &&
        Array.isArray(value.halfChecked) &&
        value.checked.length === 0 &&
        value.halfChecked.length === 0
      )
        // 非关联选择的tree组件
        return Promise.reject(msg);

      return Promise.resolve();
    }
    if (isRequired) {
      if (!rules || rules.length === 0) {
        const trigger = NO_AUTO_LINK_COMPONENTS.includes(component)
          ? 'blur'
          : 'change';
        rules = [{ required: isRequired, trigger, validator }];
      } else {
        const requiredIndex = rules.findIndex((rule) =>
          Reflect.has(rule, 'required')
        );
        if (requiredIndex === -1) {
          rules.push({ required: isRequired, validator });
        }
      }
    }
    return (
      <Form.Item name={field} label={label} rules={rules}>
        {render
          ? render(getValues, {
              disabled: false,
              readonly: false,
            })
          : renderComponent()}
      </Form.Item>
    );
  };
  const { component } = props.schema;
  if (!(component && componentMap.get(component))) return null;
  return <>{renderItem()}</>;
};
export default FormItem;
