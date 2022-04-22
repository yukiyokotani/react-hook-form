/* eslint-disable react/jsx-props-no-spreading */
import { BaseTextFieldProps, TextField } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { useController, UseControllerProps } from 'react-hook-form';

type MuiDatePickerProps<T> = UseControllerProps<T> & {
  config?: {
    displayErrorMessage?: boolean;
    textFieldProps?: BaseTextFieldProps;
  };
  muiProps?: Omit<DatePickerProps, 'value' | 'onChange' | 'renderInput'>;
};

export const MuiDatePicker: <T>(props: MuiDatePickerProps<T>) => JSX.Element = (
  props
) => {
  const { config, muiProps } = props;
  const { textFieldProps, ...others } = config || {};
  const { field, fieldState } = useController(props);

  return (
    <DatePicker
      {...muiProps}
      value={field.value}
      onChange={field.onChange}
      renderInput={(params) => (
        <TextField
          name={field.name}
          inputRef={field.ref}
          error={!!fieldState.error}
          helperText={others?.displayErrorMessage && fieldState.error?.message}
          onChange={field.onChange}
          onBlur={field.onBlur}
          {...params}
          {...textFieldProps}
        />
      )}
    />
  );
};
