import { Button, ColProps, Form } from 'antd';

type FormActionProps = {
  wrapperCol?: ColProps;
  text?: string;
  submitAction?: () => Promise<void>;
};

const FormAction: React.FC<FormActionProps> = ({
  wrapperCol = { span: 14, offset: 4 },
  text = 'Submit',
  submitAction = () => Promise.resolve(),
}) => {
  return (
    <Form.Item wrapperCol={wrapperCol}>
      <Button type="primary" onClick={submitAction}>
        {text}
      </Button>
    </Form.Item>
  );
};
export default FormAction;
