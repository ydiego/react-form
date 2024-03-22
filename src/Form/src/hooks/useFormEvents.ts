import { type FormInstance } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import { isFunction } from 'lodash-es';
import { FormProps } from '../types/form';

interface UseFormEventsContext {
  formInstance: FormInstance;
  formModel: Recordable;
  defaultValueRef: React.MutableRefObject<any>;
  formProps: FormProps;
  handleFormValues: Fn;
  onSubmit?: Fn;
}

export function useFormEvents({
  formInstance,
  formModel,
  defaultValueRef,
  formProps,
  handleFormValues,
  onSubmit,
}: UseFormEventsContext) {
  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = formProps;
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    if (!formInstance) return;
    await formInstance.resetFields();
  }

  async function setFieldsValue(values: Recordable): Promise<void> {
    if (!Object.keys(values).length) return;
    await formInstance.setFieldsValue(values);
  }

  function getFieldsValue(): Recordable {
    return handleFormValues(formInstance.getFieldsValue());
  }

  function getFieldValue(name: NamePath): Recordable {
    return formInstance.getFieldValue(name);
  }

  async function validate(nameList?: NamePath[]): Promise<any> {
    await validateFields(nameList);
    return getFieldsValue();
  }

  async function validateFields(nameList?: NamePath[]): Promise<void> {
    return await formInstance.validateFields(nameList);
  }

  async function submit(e?: Event): Promise<void> {
    e && e.preventDefault();
    const { submitFunc } = formProps;
    if (submitFunc && isFunction(submitFunc)) {
      return await submitFunc();
    }
    const value = await validate();
    return onSubmit?.(value);
  }

  async function scrollToField(
    name: string,
    options?: Parameters<FormInstance['scrollToField']>[1]
  ): Promise<void> {
    await formInstance.scrollToField(name, options);
  }

  async function appendSchemaByField() {}

  async function removeSchemaByField() {}

  async function resetSchema() {}

  async function updateSchema() {}

  return {
    resetFields,
    setFieldsValue,
    getFieldValue,
    getFieldsValue,
    validate,
    validateFields,
    submit,
    scrollToField,
    appendSchemaByField,
    removeSchemaByField,
    resetSchema,
    updateSchema,
  };
}
