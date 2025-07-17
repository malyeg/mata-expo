import React from 'react';

export function formMemo<T extends object>(component: React.SFC<T>) {
  return React.memo<T>(component, (prevProps, nextProps) => {
    if ((prevProps as any)?.control) {
      return (
        (prevProps as any)?.control?.getIsDirty() ===
        (nextProps as any)?.control?.getIsDirty()
      );
    } else {
      //
    }
    // return false;
  });
}

export default {formMemo};
