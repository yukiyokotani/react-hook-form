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
  config?: {
    displayErrorMessage?: boolean;
  };
  muiProps?: {
    autoCompleteProps?: Omit<
      AutocompleteProps<AutocompleteOption, undefined, undefined, undefined>,
      'renderInput'
    >;
    textFieldProps?: BaseTextFieldProps;
  };
};

export const MuiAutocomplete: <T>(
  props: MuiAutocompleteProps<T>
) => JSX.Element = (props) => {
  const { muiProps, config, ...others } = props;
  const { autoCompleteProps, textFieldProps } = muiProps ?? {};
  const { field, fieldState } = useController(others);

  return (
    <Autocomplete<AutocompleteOption>
      {...autoCompleteProps}
      id={autoCompleteProps?.id}
      options={autoCompleteProps?.options ?? []}
      getOptionLabel={(option) => option.label}
      onChange={(_, value) => field.onChange(value?.label)}
      onBlur={field.onBlur}
      renderInput={(params) => (
        <TextField
          // 注意：spreadで渡すものを先に渡す
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
