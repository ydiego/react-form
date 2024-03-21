## USAGE
``` tsx
const schema: FormSchema[] = [
  {
    field: 'name',
    label: 'Name',
    component: 'Input',
    required: true,
    show: true,
    defaultValue: '',
  },
  {
    field: 'date',
    label: '日期',
    component: 'RangePicker',
    required: true,
  },
  {
    field: 'select',
    label: 'Select',
    component: 'Select',
    defaultValue: '1',
    required: true,
    componentProps: {
      options: [
        {
          label: 'Option 1',
          value: '1',
        },
        {
          label: 'Option 2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'radio',
    label: 'Radio',
    component: 'RadioGroup',
    required: true,
    componentProps: {
      options: [
        {
          label: 'Option 1',
          value: 'cc',
        },
      ],
    },
    show: ({ model }) => {
      return model.select == '1';
    },
  },
];

const Demo = () => {
  const [register, { validate }] = useForm({
    schemas: schema,
    submitFunc: handle,
    formatRangeDate: [['date', ['startAt', 'endAt']]],
  });
  async function handle() {
    try {
      const res = await validate();
      console.log(res);
    } catch (err) {
      console.log(err, 222);
    }
  }

  return <BasicForm register={register}></BasicForm>
}

```