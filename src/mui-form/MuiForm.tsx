/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { FieldErrors, useForm, useFormState } from 'react-hook-form';

import MuiInput from './components/MuiInput';

type FormData = {
  name: string;
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
    console.log('Submitted', data);
  }, []);

  const onError = useCallback((errors: FieldErrors<FormData>) => {
    console.log('Error', errors.name);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <MuiInput<FormData>
          name='name'
          control={control}
          rules={{
            required: '必須項目です。',
            maxLength: { value: 5, message: '5文字以内で入力してください。' }
          }}
          config={{
            displayErrorMessage: true
          }}
        />
        <Button variant='contained' type='submit'>
          Text
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
