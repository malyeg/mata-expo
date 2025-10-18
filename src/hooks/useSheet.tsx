import { useMemo, useRef } from "react";
import { SheetOptions, SheetProps } from "../components/widgets/Sheet";

const useSheet = () => {
  const sheetRef = useRef<SheetProps>(null);

  const context = useMemo(
    () => ({
      show: (options: SheetOptions) => {
        sheetRef?.current!.show!(options);
      },
      hide: () => sheetRef.current!.hide!(),
    }),
    []
  );

  return { ...context, sheetRef };
};

export default useSheet;
