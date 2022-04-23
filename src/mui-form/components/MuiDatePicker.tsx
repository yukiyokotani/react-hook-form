/* eslint-disable react/jsx-props-no-spreading */
import { BaseTextFieldProps, TextField } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
import { useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

/** Determine if the date is valid. If valid, retrun `true`. */
export const isValidDate = (date: Date | string | number) => {
  if (date instanceof Date) {
    // Check if the date instance is 'Invalid Date' or not
    return !Number.isNaN(date.getTime());
  }
  if (typeof date === 'string') {
    // Check parsed date is same as original. (reject a date like Feb. 29)
    return parseISO(date).toISOString() === date;
  }
  return false;
};

type MuiDatePickerProps<T> = UseControllerProps<T> & {
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
      DatePickerProps,
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
 *  MUI DatePicker component linked to React Hook Form.
 * @example
 * ```
 * type FormData = {
 *   birthday: string;
 * };
 *
 * <MuiDatePicker<FormData>
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
      } else {
        field.onChange('');
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
