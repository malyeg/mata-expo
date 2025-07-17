import {useCallback} from 'react';
import useLoader from './useLoader';
// import usePerformance from './usePerformance';

type UseApiProps = {
  loadingInitValue?: boolean;
};
// Important Note: don't use request as a hook depenedency
const useApi = (props?: UseApiProps) => {
  const {loader, loading, showLoader, hideLoader} = useLoader(
    props?.loadingInitValue,
  );
  // const {startTrace} = usePerformance();
  const request = useCallback(
    async <T, U = T>(
      serviceFunction: Function,
      options: {showLoader: boolean} = {showLoader: true},
    ) => {
      let trace = null;
      try {
        // const perfApiEnabled =
        //   configApi.getValue('perf_api_enabled').asBoolean() ?? false;

        // perfApiEnabled && (trace = await startTrace('custom_trace'));
        options.showLoader && showLoader();

        let response = await serviceFunction();
        if (response) {
          // trace.putAttribute('response', response);
        }
        return response as U;
      } finally {
        if (trace) {
          // await trace.stop();
        }
        options.showLoader && hideLoader();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    request,
    loading,
    loader,
  };
};

export default useApi;
