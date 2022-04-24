/* eslint-disable react/jsx-props-no-spreading */
import {
  BaseTextFieldProps,
  InputBaseComponentProps,
  TextField
} from '@mui/material';
import { forwardRef } from 'react';
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps
} from 'react-hook-form';
import NumberFormat, { NumberFormatPropsBase } from 'react-number-format';

type MuiNumberFieldConfig = {
  /**
   * Whether to display error messages below the input field.
   * If `true`, message displays.
   * @defaultValue `false`
   */
  displayErrorMessage?: boolean;
  /**
   * Type of value to be managed in the form.
   * @exmaple
   * If you input 1000,
   * - FLOAT: `1000`
   * - STRING: `'1000'`
   * - FORMATTED_STRING: `'1,000'` (depends on your format setting.)
   * @defaultValue `'FLOAT'`
   */
  valueType?: 'FLOAT' | 'STRING' | 'FORMATTED_STRING';
};

type MuiNumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = UseControllerProps<TFieldValues, TName> & {
  /** Additional settings */
  config?: NumberFormatPropsBase<unknown> & MuiNumberFieldConfig;
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
 * Input of react-number-format
 */
const NumberFormatCustom = forwardRef<
  HTMLInputElement,
  InputBaseComponentProps & MuiNumberFieldConfig
>((props, ref) => {
  // 不要なプロパティを除くためdestructureする
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { displayErrorMessage, valueType, defaultValue, onChange, ...others } =
    props;

  return (
    <NumberFormat
      {...others}
      getInputRef={ref}
      onValueChange={(values, sourceInfo) => {
        if (!onChange) return;
        let value: string | number | undefined;
        switch (valueType) {
          case 'STRING':
            value = values.value;
            break;
          case 'FORMATTED_STRING':
            value = values.formattedValue;
            break;
          default:
            value = values.floatValue;
        }
        const event = {
          ...sourceInfo.event,
          target: {
            ...sourceInfo.event.target,
            name: props.name,
            value
          }
        };
        onChange(event);
      }}
    />
  );
});

/**
 * MUI TextField component linked to React Hook Form and react-number-format.
 * Type arguments are optional, but specifying them provides powerful type checking and type inference.
 * @typeParam TFieldValues - Type of the form.
 * @typeParam TName - Field name.
 * @example
 * ```
 * type FormData = {
 *   assets: number;
 * };
 *
 * <MuiNumberField<FormData, 'assets'>
 *   name='assets'
 *   control={control}
 *   rules={{
 *     required: 'Enter your assets.',
 *     max: {
 *       value: 1000000,
 *       message: 'Enter $1,000,000 or less.'
 *     }
 *   }}
 *   config={{
 *     displayErrorMessage: true,
 *     thousandSeparator: true,
 *     prefix: '$'
 *   }}
 *   muiProps={{
 *     textFieldProps: {
 *       label: 'Assets',
 *       fullWidth: true
 *     }
 *   }}
 * />
 * ```
 */
export const MuiNumberField: <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: MuiNumberFieldProps<TFieldValues, TName>
) => JSX.Element = (props) => {
  const { muiProps, config, ...others } = props;
  const { textFieldProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  return (
    <TextField
      {...textFieldProps}
      id={textFieldProps?.id}
      label={textFieldProps?.label}
      name={field.name}
      value={field.value}
      error={!!fieldState.error}
      helperText={config?.displayErrorMessage && fieldState.error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
      InputProps={{
        inputComponent: NumberFormatCustom,
        inputProps: {
          ...field,
          ...config
        }
      }}
    />
  );
};
