import { NamePath } from 'antd/lib/form/interface';
import { useEffect, useRef, useState } from 'react';
import { FormActions, FormProps, UseFormReturnType } from '../types/form';

type UseFormProps = Partial<FormProps>;

export function useForm(props: UseFormProps): UseFormReturnType {
  const formActionsRef = useRef<Nullable<FormActions>>(null);
  const [loaded, setLoaded] = useState(false);

  function getActions() {
    const actions = formActionsRef.current;
    if (!actions) {
      throw new Error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
      );
    }
    return actions;
  }

  function register(actions: FormActions): void {
    if (loaded && actions === formActionsRef.current) {
      return;
    }
    formActionsRef.current = actions;
    props && actions.setProps(props);
    setLoaded(true);
  }

  // useEffect(() => {
  //   const actions = formActionsRef.current;
  //   props && actions && actions.setProps(props);
  // }, [props]);

  useEffect(() => {
    return () => {
      formActionsRef.current = null;
    };
  }, []);

  const methods: FormActions = {
    submit: async (): Promise<any> => {
      const actions = getActions();
      return await actions.submit();
    },
    resetFields: async (): Promise<any> => {
      const actions = getActions();
      await actions.resetFields();
    },
    getFieldValue(name) {
      const actions = getActions();
      return actions.getFieldValue(name);
    },
    getFieldsValue: async (): Promise<any> => {
      const actions = getActions();
      return await actions.getFieldsValue();
    },
    setFieldsValue: async (value: any): Promise<any> => {
      const actions = getActions();
      await actions.setFieldsValue(value);
    },
    validate: async (nameList?: NamePath[]): Promise<any> => {
      const actions = getActions();
      return await actions.validate(nameList);
    },
    validateFields: async (nameList?: NamePath[]): Promise<any> => {
      const actions = getActions();
      return await actions.validateFields(nameList);
    },
    setProps: async (formProps: Partial<FormProps>) => {
      const actions = getActions();
      actions.setProps(formProps);
    },
  };

  return [register, methods];
}
