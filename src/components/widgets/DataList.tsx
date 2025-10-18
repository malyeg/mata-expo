import { ApiResponse } from "@/api/Api";
import theme from "@/styles/theme";
import { Entity } from "@/types/DataTypes";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useImmerReducer } from "use-immer";
import dataListReducer, { DataListInitState } from "./dataListReducer";
import ListLoader from "./ListLoader";
import NoDataFound from "./NoDataFound";

export interface DataListProps<T>
  extends Omit<FlatListProps<T>, "data" | "onEndReached"> {
  data:
    | ApiResponse<T>
    | ((lastDoc?: any) => Promise<ApiResponse<T> | undefined>);
  itemSize?: number | undefined;
  pageable?: boolean;
  refreshable?: boolean;
  onLoadMore?: () => Promise<ApiResponse<T>>;
  loaderStyle?: ViewStyle;
  // ListEmptyComponent?: React.ReactElement;
  hideNoDataFoundComponent?: boolean;
  HeaderComponent?: React.ReactElement;
  containerStyle?: ViewStyle;
  listStyle?: ViewStyle;
  hideLoader?: boolean;
  onEndReached?: (info: any, length: number) => void;
}
// DEPRECATED
function DataList<T extends Entity>({
  data,
  itemSize,
  keyExtractor,
  pageable = false,
  horizontal,
  loaderStyle,
  HeaderComponent,
  containerStyle,
  listStyle,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  onEndReached,
  ...props
}: DataListProps<T>) {
  const initialState: DataListInitState = {
    loading: true,
    reloading: false,
    items: [],
    hasMore: false,
    lastDoc: undefined,
  };
  const [state, dispatch] = useImmerReducer(dataListReducer, initialState);
  const { loading, reloading, items, lastDoc, hasMore } = state;

  useEffect(() => {
    const initData = async () => {
      if (data instanceof Function) {
        const response = await data();
        dispatch({
          type: "SET_ITEMS",
          items: response?.items,
          lastDoc:
            response?.items?.length === response?.query?.limit
              ? response?.lastDoc
              : undefined,
        });
      } else {
        dispatch({
          type: "SET_ITEMS",
          items: data.items,
          lastDoc: data.lastDoc,
        });
      }
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getItemLayout = useCallback(
    (data: T[] | null | undefined, index: number) => {
      return {
        length: itemSize!,
        offset: itemSize! * index,
        index,
      };
    },
    [itemSize]
  );

  const keyExtractorHandler = useCallback((item: T) => {
    return item.id;
  }, []);

  const loadMoreHandler = useMemo(
    () => async (info: { distanceFromEnd: number }) => {
      if (!pageable && onEndReached) {
        onEndReached(info, items?.length);
        return;
      }
      if (pageable && !reloading && !!lastDoc) {
        dispatch({
          type: "SET_RELOADING",
          reloading: true,
        });
        const response: ApiResponse<T> = await (data as Function)(lastDoc);

        if (response) {
          const hasMoreData =
            !!response?.query?.limit &&
            !!response.lastDoc &&
            response.items?.length === response?.query?.limit;

          dispatch({
            type: "LOAD_MORE_ITEMS",
            items: response.items,
            lastDoc: hasMoreData ? response.lastDoc : undefined,
          });
        } else {
          dispatch({
            type: "FINISH_LOADING",
          });
        }
      }
    },
    [dispatch, items, data, lastDoc, onEndReached, pageable, reloading]
  );

  const ListFooter = useCallback(() => {
    return pageable && hasMore && !loading ? (
      <View
        style={[
          styles.listFooter,
          horizontal ? styles.horizontalFooter : undefined,
        ]}
      >
        <ActivityIndicator color={theme.colors.salmon} size="large" />
      </View>
    ) : null;
  }, [hasMore, horizontal, loading, pageable]);

  const NoDataHandler = useCallback(() => {
    if (props.ListEmptyComponent) {
      return props.ListEmptyComponent as React.ReactElement;
    }
    return !loading && !reloading ? (
      <NoDataFound style={styles.noDataFound} />
    ) : null;
  }, [props.ListEmptyComponent, loading, reloading]);

  const separatorHandler = useCallback(
    () => <View style={horizontal ? styles.hSeparator : styles.vSeparator} />,
    [horizontal]
  );

  return !loading ? (
    items ? (
      <View
        style={[
          styles.container,
          horizontal ? styles.horizontal : styles.vertical,
          containerStyle,
        ]}
      >
        {HeaderComponent}
        <FlatList
          {...props}
          style={[styles.flatList, listStyle]}
          horizontal={horizontal}
          data={items}
          contentContainerStyle={
            !!items && items?.length === 0 ? styles.noData : undefined
          }
          getItemLayout={itemSize ? getItemLayout : undefined}
          keyExtractor={keyExtractor ?? keyExtractorHandler}
          onEndReachedThreshold={0.2}
          scrollEventThrottle={150}
          pagingEnabled={pageable}
          ListFooterComponent={ListFooter}
          onEndReached={loadMoreHandler}
          ListEmptyComponent={NoDataHandler}
          ItemSeparatorComponent={separatorHandler}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        />
      </View>
    ) : (
      <NoDataHandler />
    )
  ) : (
    <ListLoader style={loaderStyle} />
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  horizontal: {
    // flexGrow: 0,
  },
  vertical: {
    flex: 1,
  },
  flatList: {
    // flex: 1,
  },
  listActivityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    flex: 1,
  },
  listFooter: {},
  horizontalFooter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vSeparator: {
    flex: 1,
    height: 10,
  },
  hSeparator: {
    flex: 1,
    width: 10,
  },
  noDataFound: {
    // width: '100%',
    // backgroundColor: 'grey',
  },
});

export default React.memo(DataList);
