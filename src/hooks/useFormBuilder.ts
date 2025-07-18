import {yupResolver} from '@hookform/resolvers/yup';
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import * as Yup from 'yup';

export default function useFormBuilder<T extends FieldValues = FieldValues>(
  schema: Yup.SchemaOf<T> | ((yup: typeof Yup) => Yup.SchemaOf<T>),
  useFormProps?: UseFormProps<T>,
): UseFormReturn<T> {
  const formMethods = useForm({
    ...useFormProps,
    resolver: yupResolver(typeof schema === 'function' ? schema(Yup) : schema),
  });

  return formMethods;
}
