/* eslint-disable react/jsx-props-no-spreading */
import { TextField, BaseTextFieldProps } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';

type MuiTextFieldProps<T> = UseControllerProps<T> & {
  config?: {
    displayErrorMessage?: boolean;
  };
  muiProps?: BaseTextFieldProps;
};

export const MuiTextField: <T>(props: MuiTextFieldProps<T>) => JSX.Element = (
  props
) => {
  const { config, muiProps } = props;
  const { field, fieldState } = useController(props);

  return (
    <TextField
      {...muiProps}
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
