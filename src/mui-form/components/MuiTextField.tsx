/* eslint-disable react/jsx-props-no-spreading */
import { TextField, BaseTextFieldProps } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';

type MuiTextFieldProps<T> = UseControllerProps<T> & {
  config?: {
    displayErrorMessage?: boolean;
  };
  muiProps?: {
    textFieldProps?: BaseTextFieldProps;
  };
};

export const MuiTextField: <T>(props: MuiTextFieldProps<T>) => JSX.Element = (
  props
) => {
  const { muiProps, config, ...others } = props;
  const { textFieldProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  return (
    <TextField
      {...textFieldProps}
      inputRef={field.ref}
      name={field.name}
      value={field.value}
      error={!!fieldState.error}
      helperText={config?.displayErrorMessage && fieldState.error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
    />
  );
};
