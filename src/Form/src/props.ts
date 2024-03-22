import { FormActions, FormSchema } from './types/form';

export type BasicProps = {
  register?: (actions: FormActions) => void;
  onSubmit?: (values: Recordable) => void;
};
