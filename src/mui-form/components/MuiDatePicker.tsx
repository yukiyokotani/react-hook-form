/* eslint-disable react/jsx-props-no-spreading */
import { BaseTextFieldProps, TextField } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps
} from 'react-hook-form';

/** Determine if the date is valid. If valid, retrun `true`. */
export const isValidDate = (date: Date | string | number) => {
  if (date instanceof Date) {
    // Check if the date instance is 'Invalid Date' or not
    return !Number.isNaN(date.getTime());
  }
  if (typeof date === 'string') {
    // Check parsed date is same as original. (reject a date like Feb. 29, 2022)
    const dateTime = DateTime.fromISO(date);
    return dateTime.isValid;
  }
  return false;
};

type MuiDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = UseControllerProps<TFieldValues, TName> & {
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
     * Settings for DatePicker inside MuiDatePicker.
     *
     * API: {@link https://mui.com/x/api/date-pickers/date-picker/}
     */
    datePickerProps: Omit<
      DatePickerProps<unknown, unknown>,
      'value' | 'onChange' | 'renderInput'
    >;
    /**
     * Settings for TextField inside MuiDatePicker
     *
     * API: {@link https://mui.com/material-ui/api/text-field/}
     */
    textFieldProps?: BaseTextFieldProps;
  };
};

/**
 * MUI DatePicker component linked to React Hook Form.
 * Type arguments are optional, but specifying them provides powerful type checking and type inference.
 * @typeParam TFieldValues - Type of the form.
 * @typeParam TName - Field name.
 * @example
 * ```
 * type FormData = {
 *   birthday: string;
 * };
 *
 * <MuiDatePicker<FormData, 'birthday'>
 *   name='birthday'
 *   control={control}
 *   rules={{
 *     required: 'Enter a valid date here.',
 *     validate: (val) =>
 *       isValidDate(val) ? true : 'Enter a valid date here.'
 *   }}
 *   config={{
 *     displayErrorMessage: true
 *   }}
 *   muiProps={{
 *     datePickerProps: {
 *       disableFuture: true,
 *       label: 'Birthday',
 *       openTo: 'day'
 *     },
 *     textFieldProps: {
 *       fullWidth: true
 *     }
 *   }}
 * />
 * ```
 */
export const MuiDatePicker: <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: MuiDatePickerProps<TFieldValues, TName>
) => JSX.Element = (props) => {
  const { muiProps, config, ...others } = props;
  const { datePickerProps, textFieldProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  const onChangeHandler = useCallback(
    (date: unknown) => {
      if (date instanceof DateTime && date.isValid) {
        field.onChange(date.toISO());
      } else {
        field.onChange('invalid');
      }
    },
    [field]
  );

  return (
    <DatePicker
      {...datePickerProps}
      ref={field.ref}
      value={DateTime.fromISO(field.value).toFormat('yyyy/MM/dd')}
      inputFormat='yyyy/MM/dd'
      mask='____/__/__'
      onChange={onChangeHandler}
      renderInput={(params) => (
        <TextField
          // Attention to ther order of parameters passing
          {...textFieldProps}
          {...params}
          name={field.name}
          error={!!fieldState.error || fieldState.error}
          helperText={config?.displayErrorMessage && fieldState.error?.message}
        />
      )}
    />
  );
};
