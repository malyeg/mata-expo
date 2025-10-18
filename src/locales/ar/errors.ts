export default {
  ["auth/user-not-found"]: "المستخدم غير موجود",
  ["auth/user-disabled"]: "هذا المستخدم معطل",
  ["auth/facebook/loginCanceled"]: "تم إلغاء تسجيل الدخول",
  ["auth/invalid-email"]: "بريد إلكتروني غير صالح",
  ["auth/wrong-password"]: "بيانات اعتماد غير صالحة",
  ["auth/weak-password"]: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
  ["auth/network-request-failed"]: "حدث خطأ في الشبكة، يرجى المحاولة مرة أخرى.",
  ["auth/email-already-in-use"]: "هذا البريد الإلكتروني مستخدم بالفعل",
  ["auth/missing-android-pkg-name"]:
    "يجب توفير اسم حزمة أندرويد إذا كان تثبيت تطبيق أندرويد مطلوبًا.",
  ["auth/missing-continue-uri"]: "يجب توفير رابط متابعة في الطلب.",
  ["auth/missing-ios-bundle-id"]:
    "يجب توفير معرّف حزمة iOS إذا تم توفير معرّف متجر التطبيقات.",
  ["auth/invalid-continue-uri"]: "رابط المتابعة المقدم في الطلب غير صالح.",
  ["auth/unauthorized-continue-uri"]:
    "نطاق رابط المتابعة غير مدرج في القائمة البيضاء. يرجى إدراجه في وحدة تحكم Firebase.",
  ["storage/imageMaxSize"]:
    "تم الوصول إلى الحد الأقصى لحجم الملف وهو {{maxSize}}",

  ["firestore/permission-denied"]: "تم رفض الإذن",
  ["firestore/failed-precondition"]:
    "خطأ غير معروف أثناء جلب البيانات، يرجى الاتصال بالمسؤول",

  // location errors
  ["location/permissionDenied"]: "تم رفض الإذن",
  ["location/simCountryNotFound"]: "تعذر تحديد الموقع",
  ["location/serviceNotAvailable"]: "تعذر تحديد الموقع",

  // app errors
  ["app/noInternetConnection"]: "أنت غير متصل بالإنترنت",
  ["app/noConnection"]: "أنت غير متصل بالإنترنت",
  ["app/unknown"]: "حدث خطأ غير معروف",
};
