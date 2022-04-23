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
  displayErrorMessage?: boolean;
  valueType?: 'STRING' | 'FLOAT' | 'FORMATTED_STRING';
};

type MuiNumberFieldProps<T extends FieldValues> = UseControllerProps<T> & {
  config?: NumberFormatPropsBase<unknown> & MuiNumberFieldConfig;
  muiProps?: {
    textFieldProps?: BaseTextFieldProps;
  };
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

export const MuiNumberField: <T>(
  props: MuiNumberFieldProps<T>
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
