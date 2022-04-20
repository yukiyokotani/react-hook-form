/* eslint-disable react/jsx-props-no-spreading */
import {
  BaseTextFieldProps,
  InputBaseComponentProps,
  TextField
} from '@mui/material';
import { forwardRef } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps
} from 'react-hook-form';
import NumberFormat, { NumberFormatPropsBase } from 'react-number-format';

type MuiNumberFieldConfig = {
  label?: string;
  id?: string;
  displayErrorMessage?: boolean;
  valueType?: 'STRING' | 'FLOAT' | 'FORMATTED_STRING';
};

type MuiNumberFieldProps<T extends FieldValues> = UseControllerProps<T> & {
  config?: NumberFormatPropsBase<unknown> & MuiNumberFieldConfig;
  muiProps?: BaseTextFieldProps;
};

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

const MuiNumberField: <T>(props: MuiNumberFieldProps<T>) => JSX.Element = (
  props
) => {
  const { config, muiProps } = props;
  const { field, fieldState } = useController(props);

  return (
    <TextField
      {...muiProps}
      id={config?.id}
      label={config?.label}
      inputRef={field.ref}
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

export default MuiNumberField;
