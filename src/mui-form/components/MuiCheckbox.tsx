/* eslint-disable react/jsx-props-no-spreading */
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText
} from '@mui/material';
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps
} from 'react-hook-form';

type MuiCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = UseControllerProps<TFieldValues, TName> & {
  /** Additional settings */
  config?: {
    /**
     * Whether to display error messages below the checkbox.
     * If `true`, message displays.
     * @defaultValue `false`
     */
    displayErrorMessage?: boolean;
    /** Label for the checkbox. */
    label?: string;
    /**
     * If pass configuration, form value is managed by a string value insted of boolean.
     * Note the validation logic for value required.
     */
    manageWithOtherValue?: {
      trueValue: string | number;
      falseValue: string | number;
    };
  };
  /** Settings for MUI elements */
  muiProps?: {
    /**
     * Settings for Checkbox inside MuiCheckbox
     *
     * API: {@link https://mui.com/material-ui/api/checkbox/}
     */
    checkboxProps?: Omit<CheckboxProps, 'checked'>;
  };
};

/**
 * MUI Checkbox component linked to React Hook Form.
 * Type arguments are optional, but specifying them provides powerful type checking and type inference.
 * @typeParam TFieldValues - Type of the form.
 * @typeParam TName - Field name.
 * @example
 * ```
 * type FormData = {
 *   check: boolean;
 * };
 *
 * <MuiCheckbox<FormData, 'check'>
 *   name='check'
 *   control={control}
 *   rules={{
 *     required: 'Check the box'
 *   }}
 *   config={{
 *     displayErrorMessage: true,
 *     label: 'Confirmed'
 *   }}
 * />
 * ```
 */
export const MuiCheckbox: <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: MuiCheckboxProps<TFieldValues, TName>
) => JSX.Element = (props) => {
  const { muiProps, config, ...others } = props;
  const { checkboxProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  return (
    <FormControl error={!!fieldState.error}>
      <FormControlLabel
        label={config?.label}
        control={
          <Checkbox
            // Attention to ther order of parameters passing
            {...checkboxProps}
            inputRef={field.ref}
            name={field.name}
            checked={
              config?.manageWithOtherValue
                ? field.value === config.manageWithOtherValue.trueValue
                : field.value ?? false
            }
            onChange={
              config?.manageWithOtherValue
                ? (event) => {
                    field.onChange(
                      event.target.checked
                        ? config.manageWithOtherValue?.trueValue
                        : config.manageWithOtherValue?.falseValue
                    );
                  }
                : field.onChange
            }
            onBlur={field.onBlur}
          />
        }
      />
      <FormHelperText>
        {config?.displayErrorMessage && fieldState.error?.message}
      </FormHelperText>
    </FormControl>
  );
};
