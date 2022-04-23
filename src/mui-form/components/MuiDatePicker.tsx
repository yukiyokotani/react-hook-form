/* eslint-disable react/jsx-props-no-spreading */
import { BaseTextFieldProps, TextField } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useController, UseControllerProps } from 'react-hook-form';

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

  return (
    <DatePicker
      {...datePickerProps}
      value={field.value}
      onChange={field.onChange}
      renderInput={(params) => (
        <TextField
          {...textFieldProps}
          name={field.name}
          inputRef={field.ref}
          error={!!fieldState.error}
          helperText={config?.displayErrorMessage && fieldState.error?.message}
          onChange={field.onChange}
          onBlur={field.onBlur}
          {...params}
        />
      )}
    />
  );
};
