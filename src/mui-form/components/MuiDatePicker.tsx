/* eslint-disable react/jsx-props-no-spreading */
import { BaseTextFieldProps, TextField } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

/** 日付が有効化を判定する関数. 有効ならば `true` を返す */
export const isValidDate = (date: Date | string | number) => {
  if (date instanceof Date) {
    return !Number.isNaN(date.getTime());
  }
  if (typeof date === 'string') {
    return !Number.isNaN(new Date(date).getTime());
  }
  return false;
};

type MuiDatePickerProps<T> = UseControllerProps<T> & {
  config?: {
    displayErrorMessage?: boolean;
  };
  muiProps?: {
    datePickerProps: Omit<
      DatePickerProps,
      'value' | 'onChange' | 'renderInput'
    >;
    textFieldProps?: BaseTextFieldProps;
  };
};

export const MuiDatePicker: <T>(props: MuiDatePickerProps<T>) => JSX.Element = (
  props
) => {
  const { muiProps, config, ...others } = props;
  const { datePickerProps, textFieldProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  const onChangeHandler = useCallback(
    (date: unknown) => {
      if (date instanceof Date && isValidDate(date)) {
        field.onChange(date.toISOString());
      } else if (date !== null) {
        field.onChange(date);
      }
    },
    [field]
  );

  return (
    <DatePicker
      {...datePickerProps}
      ref={field.ref}
      value={field.value}
      onChange={onChangeHandler}
      renderInput={(params) => (
        <TextField
          // 注意：spreadで渡すものを先に渡す
          {...textFieldProps}
          {...params}
          // name={field.name}
          error={!!fieldState.error || fieldState.error}
          helperText={config?.displayErrorMessage && fieldState.error?.message}
          // onChange={params.onChange}
          // onBlur={field.onBlur}
        />
      )}
    />
  );
};
