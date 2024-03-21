import { Form } from 'antd';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import FormAction from './components/FormAction';
import FormItem from './components/FormItem';
import { dateItemType } from './helper';
import { useFormEvents } from './hooks/useFormEvents';
import { useFormValues } from './hooks/useFormValues';
import { BasicProps } from './props';
import { FormActions, FormProps, FormSchema } from './types/form';

const BasicForm: React.FC<BasicProps> = (props) => {
  // const { schemas } = props;
  const [formInstance] = Form.useForm();
  const [formModel, setFormModel] = useState<Recordable>({});
  const schemaRef = useRef<FormSchema[] | null>(null);
  const formPropsRef = useRef<Partial<FormProps>>();
  const defaultValueRef = useRef<Recordable>({});

  const updateFormModel = (key: string, value: any, schema: FormSchema) => {
    setTimeout(() => {
      setFormModel({ ...formModel, [key]: value });
    }, 10);
  };

  const getProps = useMemo(() => {
    return { ...props, ...formPropsRef.current };
  }, [formPropsRef.current]);

  const getSchema = useMemo(() => {
    const _schemas: FormSchema[] = getProps.schemas || [];
    for (const schema of _schemas) {
      const {
        defaultValue,
        component,
        componentProps = {},
        isFormatDate = false,
      } = schema;
      if (
        isFormatDate &&
        defaultValue &&
        component &&
        dateItemType.includes(component)
      ) {
        const opt = {
          schema,
          formModel,
          formActionType: {} as FormActions,
        };
        const valueFormat = componentProps
          ? typeof componentProps === 'function'
            ? (componentProps as any)(opt)['format']
            : (componentProps as any)['format']
          : null;
        if (!Array.isArray(defaultValue)) {
          schema.defaultValue = valueFormat
            ? dayjs(defaultValue).format(valueFormat)
            : dayjs(defaultValue);
        } else {
          const def: any[] = [];
          defaultValue.forEach((item) => {
            def.push(
              valueFormat ? dayjs(item).format(valueFormat) : dayjs(item)
            );
          });
          schema.defaultValue = def;
        }
      }
    }
    return cloneDeep(_schemas);
  }, [getProps]);

  const { initFormValue, handleFormValues } = useFormValues({
    defaultValueRef,
    formInstance,
    formProps: getProps,
    getSchema,
  });

  const {
    submit,
    resetFields,
    setFieldsValue,
    getFieldValue,
    getFieldsValue,
    validate,
    validateFields,
  } = useFormEvents({
    formInstance,
    defaultValueRef,
    formModel,
    formProps: getProps,
    handleFormValues,
  });

  async function setProps(formProps: Partial<FormProps>) {
    formPropsRef.current = formProps;
  }

  const formActions: FormActions = {
    submit,
    resetFields,
    setFieldsValue,
    getFieldValue,
    getFieldsValue,
    validate,
    validateFields,
    setProps,
  };

  useEffect(() => {
    initFormValue();
    props.register && props.register(formActions);
  }, []);

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout={getProps.layout || 'horizontal'}
      form={formInstance}
      scrollToFirstError
      {...props}
    >
      {getSchema?.map((schema) => {
        return (
          <FormItem
            formActions={formActions}
            schema={schema}
            key={schema.field}
            setFormModel={updateFormModel}
            formModel={formModel}
            formProps={getProps}
          />
        );
      })}
      <FormAction submitAction={submit} />
    </Form>
  );
};
export default BasicForm;
