/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { FieldErrors, useForm, useFormState } from 'react-hook-form';

import MuiAutocomplete from './components/MuiAutoCompleteField';
import MuiNumberField from './components/MuiNumberField';
import MuiTextField from './components/MuiTextField';
import top100Films from './components/top100Films';

type FormData = {
  name: string;
  assets: number;
  movie: string;
};

const MaterialForm = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    // onSubmit modeの場合、formStateのisValidは適切な値とならないことに注意
    mode: 'onSubmit'
  });

  const { isDirty, isSubmitted } = useFormState({
    control
  });

  const onSubmit = useCallback((data: FormData) => {
    console.log('✅Submitted', data);
  }, []);

  const onError = useCallback((errors: FieldErrors<FormData>) => {
    console.log('❌Error', errors);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <MuiTextField<FormData>
          name='name'
          control={control}
          rules={{
            required: '必須項目です。',
            maxLength: { value: 5, message: '5文字以内で入力してください。' }
          }}
          config={{
            displayErrorMessage: true
          }}
          muiProps={{
            fullWidth: true
          }}
        />
        <MuiNumberField<FormData>
          name='assets'
          control={control}
          rules={{
            required: '必須項目です。',
            max: {
              value: 10000,
              message: '10,000以下の数値を入力してください。'
            }
          }}
          config={{
            displayErrorMessage: true,
            thousandSeparator: true
          }}
          muiProps={{
            fullWidth: true
          }}
        />
        <MuiAutocomplete<FormData>
          name='movie'
          control={control}
          rules={{
            required: '必須項目です。'
          }}
          config={{
            displayErrorMessage: true
          }}
          muiProps={{
            disablePortal: true,
            options: top100Films
          }}
        />
        <Button variant='contained' type='submit'>
          送信
        </Button>
      </form>
      <div>
        <p>isDirty: {String(isDirty)}</p>
        <p>isSubmitted: {String(isSubmitted)}</p>
      </div>
    </>
  );
};

export default MaterialForm;
