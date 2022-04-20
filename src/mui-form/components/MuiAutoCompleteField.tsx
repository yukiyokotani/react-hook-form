/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';

type AutocompleteOption = {
  label: string;
};

type MuiAutocompleteProps<T> = UseControllerProps<T> & {
  config?: {
    label?: string;
    id?: string;
    displayErrorMessage?: boolean;
  };
  muiProps?: Omit<
    AutocompleteProps<AutocompleteOption, undefined, undefined, undefined>,
    'renderInput'
  >;
};

const MuiAutocomplete: <T>(props: MuiAutocompleteProps<T>) => JSX.Element = (
  props
) => {
  const { config, muiProps } = props;
  const { field, fieldState } = useController(props);

  return (
    <Autocomplete<AutocompleteOption>
      {...muiProps}
      id={config?.id}
      options={muiProps?.options ?? []}
      getOptionLabel={(option) => option.label}
      onChange={(_, value) => field.onChange(value?.label)}
      onBlur={field.onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={field.ref}
          name={field.name}
          label={config?.label}
          value={field.value}
          error={!!fieldState.error}
          helperText={config?.displayErrorMessage && fieldState.error?.message}
        />
      )}
    />
  );
};

export default MuiAutocomplete;
