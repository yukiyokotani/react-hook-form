/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  AutocompleteProps,
  BaseTextFieldProps,
  TextField
} from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';

type AutocompleteOption = {
  label: string;
};

type MuiAutocompleteProps<T> = UseControllerProps<T> & {
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
     * Settings for Autocomplete inside MuiAutocomplete.
     *
     * API: {@link https://mui.com/material-ui/api/autocomplete/}
     */
    autocompleteProps?: Omit<
      AutocompleteProps<AutocompleteOption, undefined, undefined, undefined>,
      'renderInput'
    >;
    /**
     * Settings for TextField inside MuiAutocomplete
     *
     * API: {@link https://mui.com/material-ui/api/text-field/}
     */
    textFieldProps?: BaseTextFieldProps;
  };
};

/**
 *  MUI Autocomplete component linked to React Hook Form.
 * @example
 * ```
 * type FormData = {
 *   film: string;
 * };
 *
 * <MuiAutocomplete<FormData>
 *   name='movie'
 *   control={control}
 *   rules={{
 *     required: 'Enter your favorite film.A'
 *   }}
 *   config={{
 *     displayErrorMessage: true
 *   }}
 *   muiProps={{
 *     autocompleteProps: {
 *       disablePortal: true,
 *       options: [
 *         { label: 'The Dark Knight', year: 2008 },
 *         { label: 'The Matrix', year: 1999 },
 *         { label: 'Back to the Future', year: 1985 }
 *       ]
 *     },
 *     textFieldProps: {
 *       label: 'Favorite Film'
 *     }
 *   }}
 * />
 * ```
 */
export const MuiAutocomplete: <T>(
  props: MuiAutocompleteProps<T>
) => JSX.Element = (props) => {
  const { muiProps, config, ...others } = props;
  const { autocompleteProps, textFieldProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  return (
    <Autocomplete<AutocompleteOption>
      {...autocompleteProps}
      id={autocompleteProps?.id}
      options={autocompleteProps?.options ?? []}
      getOptionLabel={(option) => option.label}
      onChange={(_, value) => field.onChange(value?.label)}
      onBlur={field.onBlur}
      renderInput={(params) => (
        <TextField
          // Attention to ther order of parameters passing
          {...textFieldProps}
          {...params}
          inputRef={field.ref}
          name={field.name}
          value={field.value}
          error={!!fieldState.error}
          helperText={config?.displayErrorMessage && fieldState.error?.message}
        />
      )}
    />
  );
};
