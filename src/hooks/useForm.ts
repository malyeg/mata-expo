import { useMemo } from "react";
import { UseFormProps, useForm as useHookForm } from "react-hook-form";
import * as yup from "yup";
import { AnySchema, Lazy, Reference } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export type ValidationSchema = Record<
  string,
  AnySchema<any, any, any> | Reference<unknown> | Lazy<any, any>
>;

function useForm<T>(
  validationObj: ValidationSchema,
  options?: UseFormProps<T>
) {
  const validationSchema = useMemo(() => {
    return yup.object().shape(validationObj);
  }, [validationObj]);
  const formMethods = useHookForm<T>({
    resolver: yupResolver(validationSchema),
    ...options,
  });
  return { validationSchema, ...formMethods };
}

export default useForm;
