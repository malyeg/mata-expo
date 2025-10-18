import {
  Dimensions,
  ImageStyle,
  PixelRatio,
  Platform,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

type CreateReturnType = ReturnType<typeof StyleSheet.create>;

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

// type CSSKey = keyof CSSProperties;
type StyleKey = keyof TextStyle;

const normalizedKeys: StyleKey[] = [
  // margins
  "margin",
  "marginStart",
  "marginEnd",
  "marginLeft",
  "marginRight",
  "marginBottom",
  "marginTop",
  "marginHorizontal",
  "marginVertical",

  // padding
  "padding",
  "paddingStart",
  "paddingEnd",
  "paddingLeft",
  "paddingRight",
  "paddingBottom",
  "paddingTop",
  "paddingHorizontal",
  "paddingVertical",
  // fonts
  "fontSize",

  // positions
  "top",
  "bottom",
  "left",
  "right",

  // scales
  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",

  // border
  "borderWidth",
  "borderStartWidth",
  "borderEndWidth",
  "borderTopWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
];

const dimentions = Dimensions.get("window");
const scales: { height: number; width: number } = {
  height: dimentions.height / 812,
  width: dimentions.width / 375,
};

// based on iphone X's scale

function n(size: number, based = "width") {
  const newSize =
    based === "height" ? size * scales.height : size * scales.width;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}
function create<T extends CreateReturnType>(
  styles: T | NamedStyles<T>,
  normalize = true
): T {
  if (!normalize) {
    const result = StyleSheet.create(styles);
    return result;
  }

  let stylesMap = new Map(Object.entries(styles));

  stylesMap.forEach((cssObj: unknown) => {
    if (typeof cssObj === "object" && cssObj !== null) {
      const obj = cssObj as any;
      Object.keys(obj).forEach((objKey: string) => {
        const item = normalizedKeys.find(
          (v) =>
            v === objKey && typeof obj[objKey] === "number" && obj[objKey] !== 0
        );
        if (item) {
          const changedValue = n(obj[objKey]);
          obj[objKey] = changedValue;
        }
      });
    }
  });

  return StyleSheet.create(styles);
}

// const build = () => {
//   // EStyleSheet.build({
//   //   $rem: width > 340 ? 18 : 16,
//   //   '@media ios': {
//   //     $fontSize: 22,
//   //   },
//   //   '@media android': {
//   //     $fontSize: 16,
//   //   },
//   // }),
// };

const EStyleSheet = {
  n,
  create,
};

export { create, EStyleSheet, n };
export default create;
