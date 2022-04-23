/* eslint-disable react/jsx-props-no-spreading */
import { TextField, BaseTextFieldProps } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';

type MuiTextFieldProps<T> = UseControllerProps<T> & {
  /** Additional settings */
  config?: {
    /**
     * Whether to display error messages below the input field.
     * If `true`, message displays.
     * @defaultValue `false`
     */
    displayErrorMessage?: boolean;
  };
  /** Settings for MUI elements */
  muiProps?: {
    /**
     * Settings for TextField inside MuiTextField
     *
     * API: {@link https://mui.com/material-ui/api/text-field/}
     */
    textFieldProps?: BaseTextFieldProps;
  };
};

/**
 *  MUI TextField component linked to React Hook Form.
 * @example
 * ```
 * type FormData = {
 *   username: string;
 * };
 *
 * <MuiTextField<FormData>
 *   name='username'
 *   control={control}
 *   rules={{
 *     required: 'Enter your username.',
 *     maxLength: {
 *       value: 10,
 *       message: 'Enter up to 10 characters.'
 *     }
 *   }}
 *   config={{
 *     displayErrorMessage: true
 *   }}
 *   muiProps={{
 *     textFieldProps: {
 *       label: 'Username',
 *       fullWidth: true
 *     }
 *   }}
 * />
 * ```
 */
export const MuiTextField: <T>(props: MuiTextFieldProps<T>) => JSX.Element = (
  props
) => {
  const { muiProps, config, ...others } = props;
  const { textFieldProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  return (
    <TextField
      // Attention to ther order of parameters passing
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
