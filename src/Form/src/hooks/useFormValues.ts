import { type FormInstance } from 'antd';
import dayjs from 'dayjs';
import {
  get,
  isArray,
  isEmpty,
  isFunction,
  isNil,
  isObject,
  isString,
  set,
  unset,
} from 'lodash-es';
import { useEffect, useRef } from 'react';
import { FormProps, FormSchema } from '../types/form';

interface UseFormValuesContext {
  defaultValueRef: React.MutableRefObject<any>;
  getSchema: FormSchema[];
  formProps: FormProps;
  formInstance: FormInstance;
}

/**
 * @desription deconstruct array-link key. This method will mutate the target.
 */
function tryDeconstructArray(key: string, value: any, target: Recordable) {
  const pattern = /^\[(.+)\]$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      value = Array.isArray(value) ? value : [value];
      keys.forEach((k, index) => {
        set(target, k.trim(), value[index]);
      });
      return true;
    }
  }
}

/**
 * @desription deconstruct object-link key. This method will mutate the target.
 */
function tryDeconstructObject(key: string, value: any, target: Recordable) {
  const pattern = /^\{(.+)\}$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      value = isObject(value) ? value : {};
      keys.forEach((k) => {
        set(target, k.trim(), value[k.trim()]);
      });
      return true;
    }
  }
}

export function useFormValues({
  defaultValueRef,
  getSchema,
  formProps,
  formInstance,
}: UseFormValuesContext) {
  const fp = useRef(formProps);
  useEffect(() => {
    fp.current = { ...formProps };
  }, [formProps]);

  function handleFormValues(values: Recordable) {
    if (!isObject(values)) return {};
    const res: Recordable = {};
    for (const item of Object.entries(values)) {
      let [key, value] = item;
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
        continue;
      }
      const transformDateFunc = fp.current.transformDateFunc;
      if (isObject(value)) {
        value = transformDateFunc ? transformDateFunc(value) : value;
      }

      if (isArray(value) && value[0]?.format && value[1]?.format) {
        value = value.map((item) =>
          transformDateFunc ? transformDateFunc(item) : item
        );
      }

      if (isString(value)) {
        // remove params from URL
        if (value === '') {
          value = undefined;
        } else {
          value = value.trim();
        }
      }

      if (
        !tryDeconstructArray(key, value, res) &&
        !tryDeconstructObject(key, value, res)
      ) {
        // 没有解构成功的，按原样赋值
        set(res, key, value);
      }
    }
    return handleRangeTimeValue(res);
  }

  function handleRangeTimeValue(values: Recordable) {
    const formatRangeDate = fp.current.formatRangeDate;
    // debugger;
    if (!formatRangeDate || !Array.isArray(formatRangeDate)) {
      return values;
    }

    for (const [
      field,
      [startTimeKey, endTimeKey],
      format = 'YYYY-MM-DD',
    ] of formatRangeDate) {
      if (!field || !startTimeKey || !endTimeKey) {
        continue;
      }
      if (!get(values, field)) {
        unset(values, field);
        continue;
      }
      const [startTime, endTime]: string[] = get(values, field);
      const [startTimeFormat, endTimeFormat] = Array.isArray(format)
        ? format
        : [format, format];

      if (!isNil(startTime) && !isEmpty(startTime)) {
        set(values, startTimeKey, formatTime(startTime, startTimeFormat));
      }
      if (!isNil(endTime) && !isEmpty(endTime)) {
        set(values, endTimeKey, formatTime(endTime, endTimeFormat));
      }
      unset(values, field);
    }
    return values;
  }

  function formatTime(time: string, format: string) {
    if (format === 'timestamp') {
      return dayjs(time).unix();
    } else if (format === 'timestampStartDay') {
      return dayjs(time).startOf('day').unix();
    }
    return dayjs(time).format(format);
  }

  function initFormValue() {
    const obj: Recordable = {};
    getSchema.forEach((item) => {
      const { defaultValue } = item;
      if (!isNil(defaultValue)) {
        obj[item.field] = defaultValue;
      }
    });
    formInstance.setFieldsValue(obj);
    defaultValueRef.current = obj;
  }

  return { handleFormValues, initFormValue };
}
