/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import { useCallback } from 'react';
import { FieldErrors, useForm, useFormState } from 'react-hook-form';

import { MuiAutocomplete } from './components/MuiAutocomplete';
import { MuiCheckbox } from './components/MuiCheckbox';
import { isValidDate, MuiDatePicker } from './components/MuiDatePicker';
import { MuiNumberField } from './components/MuiNumberField';
import { MuiTextField } from './components/MuiTextField';
import { top100Films } from './components/top100Films';

type FormData = {
  name: string;
  assets: number;
  film: string;
  birthday: string;
  check: boolean;
};

const MaterialForm = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      birthday: '',
      check: false
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                サンプルフォーム
              </Typography>
              <Typography gutterBottom variant='body1' component='div'>
                「送信」ボタンを押すとフォームオブジェクトがconsoleに出力されます。
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                  <MuiTextField<FormData>
                    name='name'
                    control={control}
                    rules={{
                      required: '必須項目です。',
                      maxLength: {
                        value: 5,
                        message: '5文字以内で入力してください。'
                      }
                    }}
                    config={{
                      displayErrorMessage: true
                    }}
                    muiProps={{
                      textFieldProps: {
                        label: '名前',
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MuiNumberField<FormData>
                    name='assets'
                    control={control}
                    rules={{
                      required: '必須項目です。',
                      max: {
                        value: 100000,
                        message: '100,000以下の数値を入力してください。'
                      }
                    }}
                    config={{
                      displayErrorMessage: true,
                      thousandSeparator: true,
                      suffix: '円'
                    }}
                    muiProps={{
                      textFieldProps: {
                        label: '貯蓄額',
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MuiAutocomplete<FormData>
                    name='film'
                    control={control}
                    rules={{
                      required: '必須項目です。'
                    }}
                    config={{
                      displayErrorMessage: true
                    }}
                    muiProps={{
                      autocompleteProps: {
                        disablePortal: true,
                        options: top100Films
                      },
                      textFieldProps: {
                        label: '好きな映画'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MuiDatePicker<FormData, 'birthday'>
                    name='birthday'
                    control={control}
                    rules={{
                      required: '必須項目です。',
                      validate: (val) =>
                        isValidDate(val) ? true : '無効な日付です。'
                    }}
                    config={{
                      displayErrorMessage: true
                    }}
                    muiProps={{
                      datePickerProps: {
                        disableFuture: true,
                        label: '誕生日',
                        openTo: 'day'
                      },
                      textFieldProps: {
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  display='flex'
                  alignItems='center'
                >
                  <MuiCheckbox<FormData, 'check'>
                    name='check'
                    control={control}
                    rules={{
                      required: '必須項目です。'
                    }}
                    config={{
                      displayErrorMessage: true,
                      label: 'チェックボックス'
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button variant='contained' type='submit'>
                送信
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <p>isDirty: {String(isDirty)}</p>
            <p>isSubmitted: {String(isSubmitted)}</p>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MaterialForm;
