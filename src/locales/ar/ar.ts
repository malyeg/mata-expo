import errors from "./errors";

export default {
  app: {
    exitModal: {
      title: "انتظر!",
      body: "هل أنت متأكد؟",
    },
    connectionCheck: {
      noInternetMessage: "لا يوجد اتصال، يتم العمل دون اتصال بالإنترنت",
    },
  },
  common: {
    form: {
      error: {
        email: "بريد إلكتروني غير صالح",
        required: "هذا الحقل مطلوب",
      },
    },
    noData: {
      title: "لم يتم العثور على نتائج",
      subTitle: "لم نجد أي نتائج، حاول مرة أخرى",
    },
    picker: {
      pickerPlaceholder: "اختر",
      searchPlaceholder: "بحث",
    },
    imagePicker: {
      imageAction: "إجراءات الصورة",
      deleteText: "حذف",
      markAsDefaultText: "تحديد كصورة افتراضية",
      optionsModal: {
        title: "اختر خيارًا",
        cameraText: "الكاميرا",
        galleryText: "معرض الصور",
      },
    },
    countryPicker: {
      title: "اختر الدولة",
    },
    itemConditionPicker: {
      title: "حالة المنتج",
      placeholder: "حالة المنتج",
      modalTitle: "حالة المنتج",
      withIssuesDesc: "صف مشكلة المنتج",
      descError: "وصف المشكلة مطلوب",
      submit: "تأكيد",
    },
    tabBar: {
      homeTitle: "الرئيسية",
      profileTitle: "ملفي الشخصي",
      settingsTitle: "الإعدادات",
      notificationsTitle: "الإشعارات",
      wishListTitle: "قائمة أمنياتي",
      myItemsTitle: "منتجاتي",
      dealsTitle: "صفقاتي",
      anonymousDialog: {
        header: "يجب تسجيل الدخول",
        body: "يرجى تسجيل الدخول أولاً",
        confirmTitle: "تسجيل الدخول",
      },
    },
    drawer: {
      homeLabel: "الرئيسية",
      profileLabel: "ملفي الشخصي",
      editProfileLabel: "تعديل الملف الشخصي",
      changePasswordLabel: "تغيير كلمة المرور",
      settingsLabel: "الإعدادات",
      notificationsLabel: "الإشعارات",
      wishListLabel: "قائمة أمنياتي",
      itemsLabel: "المنتجات",
      myItemsLabel: "منتجاتي",
      nearByItemsLabel: "منتجات قريبة",
      searchItemsLabel: "البحث عن منتجات",
      dealsLabel: "صفقاتي",
      faqLabel: "الأسئلة الشائعة",
      aboutUsLabel: "عنّا",
      contactUsLabel: "تواصل معنا",
      supportUsLabel: "ادعم ماتا",
      signInLabel: "تسجيل الدخول",
      legal: "معلومات قانونية",
    },
    screens: {
      profile: "ملفي الشخصي",
      settings: "الإعدادات",
      wishlist: "قائمة أمنياتي",
      addItem: "إضافة منتج",
      editProfile: "تعديل الملف الشخصي",
      changePassword: "تغيير كلمة المرور",
      myItems: "منتجاتي",
      myArchivedItems: "منتجاتي المؤرشفة",
      userItems: "منتجات المستخدم",
      items: "البحث عن منتجات",
      itemDetails: "تفاصيل المنتج",
      deals: "صفقاتي",
      archivedDeals: "صفقاتي المؤرشفة",
      incomingDeals: "الواردة",
      outgoingDeals: "الصادرة",
      dealDetails: "تفاصيل الصفقة",
      faq: "الأسئلة الشائعة",
      notifications: "الإشعارات",
      supportUs: "ادعم ماتا",
      contactUs: "تواصل معنا",
      complains: "تواصل معنا",
      aboutUs: "عنّا",
      wishList: "قائمة أمنياتي",
      legal: "معلومات قانونية",
      privacy: "سياسة الخصوصية",
    },
    menu: {
      dealsLabel: "صفقاتي",
      archivedDealsLabel: "صفقاتي المؤرشفة",
    },
    location: {
      title: "اختر الموقع",
      search: {
        placeholder: "ابحث عن موقع",
      },
    },
  },
  dialogs: {
    guestDialog: {
      header: "يجب تسجيل الدخول",
      body: "يرجى تسجيل الدخول أولاً",
      confirmTitle: "تسجيل الدخول",
    },
  },
  components: {
    textDescription: {
      showMoreTitle: "اقرأ المزيد ...",
      showLessTitle: "اقرأ أقل ...",
    },
  },
  widgets: {
    passwordMeter: {
      medium: "جيد",
      strong: "ممتاز 👍",
      weak: "ضعيف ⚠️",
    },
    offlineCard: {
      title: "عفوًا!",
      body: "يبدو أن شبكتك غير متصلة، يرجى التحقق من اتصالك بالإنترنت.",
      locationBody:
        "يبدو أن خدمة تحديد الموقع في جهازك متوقفة. لتجربة أفضل، يرجى تشغيل خدمات تحديد الموقع.",
    },
    nearByItems: {
      title: "منتجات قريبة",
      changeCityLink: "استكشف المزيد",
      itemsLink: "عرض الكل",
      anotherAreaLink: "جرب منطقة أخرى",
      noItemsFoundText: "لم يتم العثور على منتجات في {{city}}",
    },
    recommendedItems: {
      title: "مقترح لك",
      itemsLink: "عرض الكل",
    },
    sheet: {
      header: "تأكيد",
      confirmationTitle: "تأكيد",
      confirmBtnText: "تأكيد",
      cancelBtnText: "إلغاء",
    },
    itemsFilter: {
      title: "بحث",
      searchInput: {
        placeholder: "ابحث عن منتجات",
        minLength: "الحد الأدنى 3 أحرف",
      },
      iconLabel: "تصفية",
      showResultsBtnTitle: "عرض النتائج",
      clearBtnTitle: "مسح",
      country: {
        placeholder: "الدولة",
        modalTitle: "الدولة",
        required: "الدولة مطلوبة",
      },
      state: {
        placeholder: "الولاية/المحافظة",
        modalTitle: "الولاية/المحافظة",
        required: "الولاية/المحافظة مطلوبة",
      },
      city: {
        placeholder: "المدينة",
        modalTitle: "المدينة",
        required: "المدينة مطلوبة",
      },
      category: {
        placeholder: "الفئة",
        modalTitle: "الفئة",
      },
      swapTypes: {
        placeholder: "نوع المبادلة",
        modalTitle: "نوع المبادلة",
      },
      condition: {
        placeholder: "الحالة",
        modalTitle: "حالة المنتج",
      },
      swapCategory: {
        placeholder: "فئة المبادلة",
        modalTitle: "فئة المبادلة",
        required: "فئة المبادلة مطلوبة",
      },
      status: {
        placeholder: "الحالة",
        modalTitle: "الحالة",
      },
    },
    itemDealsTab: {
      modalTitle: "صفقات جديدة",
    },
    itemPicker: {
      noCategoryTitle: "عفوًا!",
      noDataNoCategory: "ليس لديك أي منتجات للتبديل في [ {{categoryName}} ].",
      noCategoryLinkTitle: "الرجاء إضافة منتج",
      noData: "لم يتم العثور على منتجات",
    },
    rating: {
      header: "رائع 👍",
      body: "مع ماتا، الصفقة دائمًا مربحة للجميع. تقييمك محل تقدير.",
      btnSubmitTitle: "تقييم",
      inputPlaceholder: "أخبرنا عن تجربتك (اختياري)",
      required: "يرجى التقييم أولاً",
    },
    itemsSearch: {
      placeholder: "ابحث عن منتجات",
    },
    itemsList: {
      noDataFound: "لم نجد أي نتائج، حاول مرة أخرى",
      changeFilterBtnTitle: "تغيير التصفية",
    },
    acceptOfferModal: {
      title: "بدء الصفقة",
      rejectOtherOffersTitle: "رفض العروض الأخرى لهذا المنتج",
      acceptBtnTitle: "بدء",
      cancelBtnTitle: "إلغاء",
    },
  },
  homeScreen: {
    title: "الرئيسية",
    profileBtnLabel: "ملفي الشخصي",
  },
  signUpScreen: {
    username: {
      placeholder: "البريد الإلكتروني",
      required: "البريد الإلكتروني مطلوب",
      invalid: "بريد إلكتروني غير صالح",
    },
    firstName: {
      placeholder: "الاسم الأول",
      required: "الاسم الأول مطلوب",
    },
    lastName: {
      placeholder: "الاسم الأخير",
      required: "الاسم الأخير مطلوب",
    },
    phonePrefix: {
      label: "الهاتف",
      placeholder: "المقدمة",
      required: "المقدمة مطلوبة",
      invalid: "مقدمة غير صالحة",
      pattern: "يجب أن تكون ؟؟؟",
    },
    country: {
      placeholder: "الدولة",
      required: "الدولة مطلوبة",
    },
    state: {
      placeholder: "الولاية/المحافظة",
      required: "الولاية/المحافظة مطلوبة",
    },
    city: {
      placeholder: "المدينة",
      required: "المدينة مطلوبة",
    },
    phone: {
      label: " ",
      placeholder: "الهاتف",
      required: "الهاتف مطلوب",
      invalid: "رقم هاتف غير صالح",
      pattern: "يجب أن يكون ؟؟؟",
    },
    password: {
      placeholder: "كلمة المرور",
      required: "كلمة المرور مطلوبة",
      pattern:
        "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف واحد ورقم واحد على الأقل",
    },
    confirmPassword: {
      placeholder: "تأكيد كلمة المرور",
      required: "تأكيد كلمة المرور مطلوب",
      match: "يجب أن تتطابق كلمات المرور",
    },
    terms: {
      label: "أوافق على جميع الشروط وسياسة الخصوصية",
    },
    forgotPasswordLink: "هل نسيت كلمة المرور؟",
    loginBtnTitle: "تسجيل الدخول",
    loginGuestBtnTitle: "تسجيل الدخول كزائر",
    registerBtnTitle: "تسجيل",
    passwordLink: "هل نسيت كلمة المرور؟",
    haveAccountText: "هل لديك حساب بالفعل؟",
    LoginLink: "سجل الدخول الآن",
  },
  signInScreen: {
    username: {
      placeholder: "البريد الإلكتروني",
      required: "البريد الإلكتروني مطلوب",
      invalid: "بريد إلكتروني غير صالح",
    },
    password: {
      placeholder: "كلمة المرور",
      required: "كلمة المرور مطلوبة",
    },
    dontHaveAccountText: "ليس لديك حساب؟",
    signUpLink: "سجل الآن",
    forgotPasswordLink: "هل نسيت كلمة المرور؟",
    loginBtnTitle: "تسجيل الدخول",
    loginGuestBtnTitle: "تسجيل الدخول كزائر",
    facebookLoginButtonTitle: "تسجيل الدخول باستخدام فيسبوك",
    appleLoginButtonTitle: "تسجيل الدخول باستخدام أبل",
    passwordLink: "هل نسيت كلمة المرور؟",
  },
  forgotPasswordScreen: {
    title: "هل نسيت كلمة المرور",
    username: {
      placeholder: "البريد الإلكتروني",
      required: "البريد الإلكتروني مطلوب",
      invalid: "بريد إلكتروني غير صالح",
    },
    forgotPasswordTitle: "هل نسيت كلمة المرور",
    forgotPasswordSubTitle:
      "يرجى إدخال بريدك الإلكتروني المسجل لإعادة تعيين كلمة المرور الخاصة بك.",
    confirmBtnTitle: "تأكيد",
    emailSentTitle:
      "لقد أرسلنا لك بريدًا إلكترونيًا. يرجى اتباع التعليمات الموجودة في البريد الإلكتروني للوصول إلى حسابك.",
    emailSentSubTitle:
      "يرجى اتباع التعليمات الموجودة في البريد الإلكتروني للوصول إلى حسابك.",
    haveAccountText: "هل لديك حساب بالفعل؟",
    LoginLink: "سجل الدخول الآن",
  },
  addItemScreen: {
    title: "إضافة منتج",
    editItemTitle: "تعديل المنتج",
    addItemSuccess: "تمت إضافة المنتج بنجاح 👋",
    editItemSuccess: "تم تحديث المنتج بنجاح 👋",
    name: {
      placeholder: "اسم المنتج",
      required: "الاسم مطلوب",
      invalid: "اسم غير صالح",
    },
    inappropriateContentWarning: {
      header: "تحذير",
      body: "لا يمكنك إضافة محتوى منتج مثل {{content}}\n\nيرجى التأكد من أن منتجك لا ينتهك شروط وأحكام ماتا",
    },
    description: {
      placeholder: "وصف قصير",
    },
    category: {
      placeholder: "الفئة",
      required: "الفئة مطلوبة",
      invalid: "فئة غير صالحة",
      modalTitle: "الفئة",
    },
    swapType: {
      placeholder: "نوع المبادلة",
      modalTitle: "نوع المبادلة",
      required: "نوع المبادلة مطلوب",
    },
    swapCategory: {
      placeholder: "فئة المبادلة",
      modalTitle: "فئة المبادلة",
      required: "فئة المبادلة مطلوبة",
    },
    status: {
      placeholder: "الحالة",
      required: "الحالة مطلوبة",
      invalid: "حالة غير صالحة",
      label: "الحالة",
      online: "متصل",
      draft: "مسودة",
      saveAsDraftLabel: "حفظ كمسودة",
    },
    images: {
      required: "مطلوب صورة واحدة على الأقل",
    },
    location: {
      required: "موقع المنتج مطلوب",
    },
    addBtnTitle: "إضافة",
    updateBtnTitle: "تحديث",
  },
  profileScreen: {
    myItemsLink: "منتجاتي",
    dealsLink: "صفقاتي",
    editProfileLink: "تعديل الملف الشخصي",
    changePasswordLink: "تغيير كلمة المرور",
    myInterestsLink: "اهتماماتي",
    inviteUserTitle: "دعوة صديق",
    wishListTitle: "قائمة أمنياتي",
    logout: {
      logoutLink: "تسجيل الخروج",
      confirmLogoutTitle: "تأكيد تسجيل الخروج",
      confirmLogoutText: "هل أنت متأكد؟",
      confirmLogoutBtnTitle: "تأكيد",
      cancelBtnTitle: "إلغاء",
    },
    deleteAccount: {
      title: "حذف الحساب",
      link: "حذف الحساب",
      confirmTitle: "حذف الحساب",
      confirmText:
        "هل أنت متأكد؟ سيتم حذف جميع بياناتك وسيتم إلغاء أي عروض أو صفقات.",
      confirmBtnTitle: "تأكيد",
      cancelBtnTitle: "إلغاء",
    },
  },
  editProfileScreen: {
    firstName: {
      placeholder: "الاسم الأول",
      required: "الاسم الأول مطلوب",
    },
    lastName: {
      placeholder: "الاسم الأخير",
      required: "الاسم الأخير مطلوب",
    },
    email: {
      placeholder: "البريد الإلكتروني",
    },
    country: {
      placeholder: "الدولة",
      required: "الدولة مطلوبة",
    },
    state: {
      placeholder: "الولاية/المحافظة",
      required: "الولاية/المحافظة مطلوبة",
    },
    city: {
      placeholder: "المدينة",
      required: "المدينة مطلوبة",
    },
    phonePrefix: {
      label: "الهاتف",
      placeholder: "المقدمة",
      required: "المقدمة مطلوبة",
      invalid: "مقدمة غير صالحة",
      pattern: "يجب أن تكون ؟؟؟",
    },
    phone: {
      label: " ",
      placeholder: "الهاتف",
      required: "الهاتف مطلوب",
      invalid: "رقم هاتف غير صالح",
      pattern: "يجب أن يكون ؟؟؟",
    },
    interests: {
      placeholder: "الاهتمامات",
      required: "الاهتمامات مطلوبة",
    },
    marketingFlag: {
      label: "قبول الرسائل التسويقية",
      required: "الحالة مطلوبة",
      invalid: "حالة غير صالحة",
    },
    isPublic: {
      label: "السماح للآخرين برؤية ملفي الشخصي",
    },
    submitBtnTitle: "تحديث",
    changeSuccess: "تم تحديث الملف الشخصي بنجاح 👋",
  },
  changePasswordScreen: {
    oldPasswordTitleText: "أدخل كلمة المرور القديمة.",
    newPasswordTitleText: "أدخل كلمة المرور الجديدة.",
    submitBtnTitle: "تحديث",
    oldPassword: {
      placeholder: "كلمة المرور القديمة",
      required: "كلمة المرور القديمة مطلوبة",
    },
    newPassword: {
      placeholder: "كلمة المرور الجديدة",
      required: "كلمة المرور الجديدة مطلوبة",
      pattern:
        "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف واحد ورقم واحد على الأقل",
    },
    confirmPassword: {
      placeholder: "تأكيد كلمة المرور الجديدة",
      required: "تأكيد كلمة المرور مطلوب",
      match: "يجب أن تتطابق كلمات المرور",
      history: "لا يمكن أن تكون كلمة المرور الجديدة نفس القديمة",
    },
    submitSuccess: "تم تغيير كلمة المرور بنجاح 👋",
  },
  dealsScreen: {
    menu: {
      archivedDealsLabel: "صفقاتي المؤرشفة",
    },
  },
  dealDetailsScreen: {
    approveBtnTitle: "متابعة",
    rejectBtnTitle: "رفض",
    closeBtnTitle: "تمت الصفقة",
    rateBtnTitle: "تقييم",
    cancelBtnTitle: "إلغاء الصفقة",
    chatHeader: 'الدردشة مع "{{userName}}"',
    menu: {
      cancelLabel: "إلغاء الصفقة",
      rejectLabel: "رفض العرض",
    },
    closeDeal: {
      success: "تهانينا، تمت الصفقة بنجاح!",
    },
    cancelOfferConfirmationHeader: "إلغاء الصفقة",
    cancelOfferConfirmationBody: "هل أنت متأكد؟",
    rejectOfferConfirmationHeader: "رفض العرض",
    rejectOfferConfirmationBody: "هل أنت متأكد؟",
    confirmCloseDealHeader: "إغلاق الصفقة",
    confirmCloseDealBody: "قبل إتمام الصفقة، تأكد من:",
    confirmCloseDealContent:
      "أنك راضٍ عن الصفقة/حالة المنتج (حسب الاقتضاء) وأنك تبادلت معلومات الاتصال مع الطرف/المستخدم الآخر (حسب الحاجة)",
  },
  IncomingDealsScreen: {
    noData: {
      body: "لا توجد عروض في الوقت الحالي",
      searchItemsLink: "البحث عن منتجات",
    },
  },
  OutgoingDealsScreen: {
    noData: {
      body: "لا توجد عروض في الوقت الحالي",
      searchItemsLink: "البحث عن منتجات",
    },
  },
  itemDetailsScreen: {
    ownerItemsTitle: "منتجات أخرى للمالك",
    itemDescriptionTitle: "الوصف: ",
    addressTitle: "الموقع: ",
    categoryTitle: "الفئة: ",
    itemConditionTitle: "الحالة: ",
    pendingDialog: {
      header: "تحذير",
      body: "لديك صفقات معلقة على هذا المنتج، حذف المنتج سيلغي جميع الصفقات المعلقة",
    },
    editPendingDialog: {
      header: "تحذير",
      body: "لديك صفقات معلقة على هذا المنتج، يرجى إغلاقها أولاً",
    },
    blockedDialog: {
      header: "تحذير",
      body: "تم حظر منتجك لانتهاكه شروط وأحكام ماتا",
    },
    archivedDialog: {
      header: "تحذير",
      body: "المنتج لم يعد متاحًا، هل تريد عرض منتجات مشابهة؟",
    },
    deleteConfirmationHeader: "تأكيد",
    deleteConfirmationBody:
      "هل أنت متأكد من أنك تريد حذف المنتج ({{itemName}})؟",
    blockItemConfirmation: {
      header: "تحذير",
      body: "حظر المنتج [{{itemName}}] حتى لا يراه الآخرون ولن يتمكن مالك المنتج من تعديله",
    },
    swapHeader: "عرض جديد",
    swapConfirmTitle: "إرسال",
    swapCategoryBody:
      'إرسال عرض مبادلة للمنتج "{{source}}" بـ "{{destination}}"',
    swapBody: "تأكيد إرسال عرض جديد للمنتج {{item}}",
    newOfferSuccess: "تم إرسال العرض الجديد بنجاح 👋",
    alreadyHasDealError: "لديك صفقة بالفعل لهذا المنتج",
    swapTypeTitle: "نوع المبادلة: ",
    swapCategoryTitle: "فئة المبادلة: ",
    statusTitle: "الحالة: ",
    sendSwapButton: "إرسال عرض مبادلة",
    menu: {
      shareLabel: "مشاركة",
      editItemLabel: "تعديل",
      complainItemLabel: "إرسال شكوى",
      deleteLabel: "حذف",
      dealsLabel: "صفقاتي الجارية",
      archivedDealsLabel: "صفقاتي المؤرشفة",
      blockLabel: "حظر المنتج",
    },
    itemPickerTitle: "اختر منتجًا",
  },
  MyItemsScreen: {
    menu: {
      archivedLabel: "منتجاتي المؤرشفة",
      itemsLabel: "منتجاتي النشطة",
    },
    noData: {
      title: "لا توجد منتجات متاحة للمبادلة",
    },
    pendingDialog: {
      header: "تحذير",
      body: "لديك صفقات معلقة على هذا المنتج، حذف المنتج سيلغي جميع الصفقات المعلقة",
    },
    editPendingDialog: {
      header: "تحذير",
      body: "لديك صفقات معلقة على هذا المنتج، يرجى إغلاقها أولاً",
    },
  },
  ItemsScreen: {
    filterIcon: {
      label: "تصفية",
    },
    viewInMapLabel: "عرض على الخريطة",
    noData: {
      noDataFound: "لم نجد أي نتائج، حاول مرة أخرى",
      changeFilterBtnTitle: "تغيير التصفية",
    },
  },
  SupportUsScreen: {
    content: "ماتا هي منصة مجانية لجميع المجتمعات. ادعم ماتا واشتر لنا قهوة",
  },
  NotificationsScreen: {
    noNotificationTitle: " 👍",
    noNotificationsText: "كل شيء على ما يرام!",
  },
  ContactUsScreen: {
    content: "ماتا هي منصة مجانية لجميع المجتمعات. ادعم ماتا واشتر لنا قهوة",
    subject: {
      placeholder: "الموضوع",
      required: "الموضوع مطلوب",
    },
    body: {
      placeholder: "الرسالة",
      required: "الرسالة مطلوبة",
    },
    submitBtnTitle: "إرسال",
    submitSuccess: "تم إرسال رسالتك بنجاح",
  },
  ComplainsScreen: {
    header:
      "إذا كنت تعتقد أن هذا المنتج أو محتواه يعتبر محظورًا أو غير قانوني وفقًا لقوانين السلطات المحلية.",
    subject: {
      placeholder: "الموضوع",
      required: "الموضوع مطلوب",
      defaultValue: "بلاغ / شكوى",
    },
    type: {
      placeholder: "النوع",
      required: "النوع مطلوب",
      modalTitle: "النوع",
    },
    body: {
      placeholder: "الرسالة",
      required: "الرسالة مطلوبة",
    },
    submitBtnTitle: "إرسال",
    submitSuccess: "تم إرسال رسالتك بنجاح",
  },
  NoConnectionScreen: {
    contentTitle: "عفوًا",
    contentBody: "يبدو أن هناك خطأ ما في اتصالك بالإنترنت.",
    retryBtnTitle: "إعادة المحاولة",
  },
  NoLocationScreen: {
    contentTitle: "عفوًا",
    contentBody:
      "يبدو أن خدمة تحديد الموقع في جهازك متوقفة. لتجربة أفضل، يرجى تشغيل خدمات تحديد الموقع.",
    retryBtnTitle: "إعادة المحاولة",
  },
  LegalInformationScreen: {
    title: "معلومات قانونية",
    header1: "عزيزي العميل،",
    header2:
      'يرجى قراءة شروط الخدمة ("الشروط"، "شروط الخدمة") والمعلومات القانونية المتعلقة بالخصوصية بعناية قبل استخدام هذا التطبيق المحمول',
    privacyTitle: "سياسة الخصوصية",
    termsTitle: "شروط الخدمة",
    contactUsTitle: "تواصل معنا",
    aboutUsTitle: "عنّا",
    contactUs: {
      title: "تواصل معنا",
      body: 'إذا كان لديك أي أسئلة حول هذه الشروط، يمكنك الاتصال بنا:\n • عبر البريد الإلكتروني: contact@mataup.com\n • عن طريق زيارة صفحة الاتصال في موقعنا الإلكتروني: www.mataup.com\n • عن طريق زيارة صفحة/شاشة "تواصل معنا" في هذا التطبيق',
    },
    aboutUs: {
      title: "عنّا",
      body: 'باسم ماتا ("الخدمة") التي تديرها MATA AOTEAROA LIMITED، Ellerslie، أوكلاند، 1060، نيوزيلندا ("شركتنا"، "نحن"، أو "خاصتنا").',
    },
  },
  error: errors,
};
