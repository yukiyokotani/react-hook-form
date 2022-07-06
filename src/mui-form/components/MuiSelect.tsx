/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps
} from '@mui/material';
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps
} from 'react-hook-form';

type MuiSelectProps<
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
    /**
     * An array of Selectable options. Each option should be an object that has `value`, and shold have `label` property.
     * However an array of string or number also acceptable. In that case, `value` and `label` match the value of each element.
     * Note that each value must be unique.
     */
    options: Array<
      { value: string | number; label?: string } | string | number
    >;
  };
  /** Settings for MUI elements */
  muiProps?: {
    /**
     * Settings for Select inside MuiSelect
     *
     * API: {@link https://mui.com/material-ui/api/select/}
     */
    selectProps?: SelectProps;
  };
};

/**
 * MUI Select component linked to React Hook Form.
 * Type arguments are optional, but specifying them provides powerful type checking and type inference.
 * @typeParam TFieldValues - Type of the form.
 * @typeParam TName - Field name.
 * @example
 * ```
 * type FormData = {
 *   menu: string;
 * };
 *
 * <MuiSelect<FormData, 'menu'>
 *   name='menu'
 *   control={control}
 *   rules={{
 *     required: 'Select menu.'
 *   }}
 *   config={{
 *     displayErrorMessage: true,
 *     options: ['Beef', 'Pork', 'Chicken']
 *   }}
 *   muiProps={{
 *     selectProps: {
 *       label: 'Menu',
 *       fullWidth: true
 *     }
 *   }}
 * />
 * ```
 */
export const MuiSelect: <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: MuiSelectProps<TFieldValues, TName>
) => JSX.Element = (props) => {
  const { muiProps, config, ...others } = props;
  const { selectProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  return (
    <FormControl
      error={!!fieldState.error}
      style={{ width: selectProps?.fullWidth ? '100%' : undefined }}
    >
      <InputLabel id={`mui-select-label-${selectProps?.label}`}>
        {selectProps?.label}
      </InputLabel>
      <Select
        // Attention to ther order of parameters passing
        {...selectProps}
        labelId={`mui-select-label-${selectProps?.label}`}
        inputRef={field.ref}
        name={field.name}
        value={field.value}
        error={!!fieldState.error}
        onChange={field.onChange}
        onBlur={field.onBlur}
      >
        {config?.options.map((option) => {
          return (
            <MenuItem
              key={typeof option === 'object' ? option.value : option}
              value={typeof option === 'object' ? option.value : option}
            >
              {typeof option === 'object'
                ? option.label ?? option.value
                : option}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>
        {config?.displayErrorMessage && fieldState.error?.message}
      </FormHelperText>
    </FormControl>
  );
};
