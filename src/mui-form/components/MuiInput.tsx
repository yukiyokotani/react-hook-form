import { TextField } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';

type Props<T> = UseControllerProps<T> & {
  config?: {
    displayErrorMessage?: boolean;
  };
};

const MuiInput: <T>(props: Props<T>) => JSX.Element = (props) => {
  const { config } = props;
  const { field, fieldState } = useController(props);

  return (
    <TextField
      inputRef={field.ref} // send input ref, so we can focus on input when error appear
      name={field.name} // send down the input name
      value={field.value} // input value
      error={!!fieldState.error}
      helperText={config?.displayErrorMessage && fieldState.error?.message}
      onChange={field.onChange} // send value to hook form
      onBlur={field.onBlur} // notify when input is touched/blur
    />
  );
};

export default MuiInput;
