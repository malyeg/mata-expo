import {useEffect, useRef} from 'react';
import {
  useController as useControllerBase,
  UseControllerProps,
} from 'react-hook-form';

const useController = (options: UseControllerProps) => {
  const control = options.control;

  const controller = useControllerBase({...options, control});
  const ref = useRef<any>(0);
  useEffect(() => {
    if (!controller.formState.isSubmitted && !controller.formState.isDirty) {
      if (!ref.current || ref.current === 0) {
        ref.current = 1;
        return;
      }
      ref.current++;
    }
  }, [controller.formState.isDirty, controller.formState.isSubmitted]);

  return controller;
};

export default useController;
