import errors from "./errors";

export default {
  app: {
    exitModal: {
      title: "Hold on!",
      body: "Are you sure?",
    },
    connectionCheck: {
      noInternetMessage: "No connection, working offline",
    },
    intro: {
      skipBtn: "Skip",
      closeBtn: "Close",
      slides: {
        slide1: {
          title: "Ancient trade in contemporary style",
          body: "Mata renovates ancient trade in a contemporary BOUNDLESS form of stuff SWAPPING",
        },
        slide2: {
          title: "Let's reuse stuff & save earth resources",
          body: "Mata supports environment by upgrading the concept of stuff RECYCLING into stuff REUSING",
        },
        slide3: {
          title: "You can trade value for value",
          body: "Mata promotes trading on the basis of VALUE FOR VALUE instead of VALUE FOR MONEY",
        },
        slide4: {
          title: "A value added social life",
          body: "Mata motivates SOCIAL RELATIONSHIPS through MONEY-FREE / VALUE-ADDED deals",
        },
        slide5: {
          title: "Mutual benefit = win-win",
          body: "Mata addresses the notion of MUTUALLY BENEFICIAL SWAP-DEAL so all are SATISFIED",
        },
      },
    },
  },
  common: {
    search: "Search",
    timeAgo: {
      justNow: "Just now",
      seconds: "{{count}} seconds",
      minutes: "{{count}} minutes",
      hours: "{{count}} hours",
      days: "{{count}} days",
      months: "{{count}} months",
      years: "{{count}} years",
    },
    form: {
      error: {
        email: "Invalid email",
        required: "Field is required",
      },
    },
    noData: {
      title: "No result found",
      subTitle: "We found no result , try again",
    },
    appMenu: {
      modalOptionsTitle: "Options",
      reportIssueLabel: "Report Issue",
      shareLabel: "Share",
      contactProviderLabel: "Contact Provider",
      providerDetailsLabel: "Provider Details",
      sendComplainLabel: "Send Complain",
      blockItemLabel: "Block Item",
    },
    picker: {
      pickerPlaceholder: "Select",
      select: "Select",
      searchPlaceholder: "Search",
      selectAll: "Select All",
    },
    imagePicker: {
      imageAction: "Image Actions",
      deleteText: "Delete",
      markAsDefaultText: "Mark as default",
      optionsModal: {
        title: "Select Option",
        cameraText: "Camera",
        galleryText: "Photo Gallery",
      },
    },
    countryPicker: {
      title: "Select Country",
    },
    itemConditionPicker: {
      title: "Item Condition",
      placeholder: "Item Condition",
      modalTitle: "Item Condition",
      withIssuesDesc: "Describe the item issue",
      descError: "Description of the issue is required",
      submit: "Confirm",
    },
    tabBar: {
      homeTitle: "Home",
      profileTitle: "My Profile",
      settingsTitle: "Settings",
      notificationsTitle: "Notifications",
      wishListTitle: "My Wishlist",
      myItemsTitle: "My Items",
      dealsTitle: "My Deals",
      anonymousDialog: {
        header: "Sign in required",
        body: "Please sign in first",
        confirmTitle: "Sign in",
      },
    },
    myItems: {
      menu: {
        archivedItems: "Archived Items",
      },
    },

    drawer: {
      homeLabel: "Home",
      profileLabel: "My Profile",
      editProfileLabel: "Edit Profile",
      changePasswordLabel: "Change Password",
      settingsLabel: "Settings",
      notificationsLabel: "Notifications",
      wishListLabel: "My Wishlist",
      itemsLabel: "Items",
      myItemsLabel: "My Items",
      nearByItemsLabel: "Nearby Items",
      searchItemsLabel: "Search Items",
      dealsLabel: "My Deals",
      faqLabel: "FAQs",
      aboutUsLabel: "About Us",
      contactUsLabel: "Contact Us",
      supportUsLabel: "Support Mata",
      signInLabel: "Sign in",
      legal: "Legal Information",
      localeLabel: "Language",
    },

    screens: {
      profile: "My Profile",
      settings: "Settings",
      wishlist: "My Wishlist",
      addItem: "Add Item",
      editProfile: "Edit Profile",
      changePassword: "Change Password",
      myItems: "My Items",
      myArchivedItems: "My Archived Items",
      userItems: "User Items",
      items: "Search Items",
      totalItems: "{{count}} Items",
      itemDetails: "Item Details",
      deals: "My Deals",
      archivedDeals: "My Archived Deals",
      incomingDeals: "Incoming",
      outgoingDeals: "Outgoing",
      dealDetails: "Deal Details",
      faq: "FAQs",
      notifications: "Notifications",
      supportUs: "Support Mata",
      contactUs: "Contact Us",
      complains: "Contact Us",
      aboutUs: "About Us",
      wishList: "My Wishlist",
      legal: "Legal information",
      privacy: "Privacy policy",
    },
    menu: {
      dealsLabel: "My Deals",
      archivedDealsLabel: "My Archived Deals",
    },
    location: {
      title: "Select Location",
      search: {
        placeholder: "Search for location",
      },
    },
  },

  dialogs: {
    guestDialog: {
      header: "Sign in required",
      body: "Please sign in first",
      confirmTitle: "Sign in",
    },
  },

  components: {
    textDescription: {
      showMoreTitle: "Read more ...",
      showLessTitle: "Read less ...",
    },
  },
  widgets: {
    dealStatus: {
      new: "New",
      accepted: "Started",
      closed: "Closed",
      rejected: "Rejected",
      cancelled: "Cancelled",
    },
    passwordMeter: {
      medium: "Okay",
      strong: "Excellent 👍",
      weak: "Weak  ⚠️",
    },
    offlineCard: {
      title: "Oops!",
      body: "Your network seems to be offline, please check your internet connection.",
      locationBody:
        "Your device location seems to be turned off. For better experience, please turn on device location services.",
    },
    nearByItems: {
      title: "Items Nearby ",
      changeCityLink: "Explore More",
      itemsLink: "View All",
      anotherAreaLink: "Try another region",
      noItemsFoundText: "No Items found in {{city}}",
    },
    recommendedItems: {
      title: "Recommended for you",
      itemsLink: "View All",
    },
    sheet: {
      header: "Confirm",
      confirmationTitle: "Confirm",
      confirmBtnText: "Confirm",
      cancelBtnText: "Cancel",
    },
    itemsFilter: {
      title: "Search",
      searchInput: {
        placeholder: "Search items",
        minLength: "Minimum of 3 characters are required",
      },
      iconLabel: "Filter",
      showResultsBtnTitle: "Show Results",
      clearBtnTitle: "Clear",
      country: {
        placeholder: "Country",
        modalTitle: "Country",
        required: "Country is required",
      },
      state: {
        placeholder: "State",
        modalTitle: "State",
        required: "State is required",
      },
      city: {
        placeholder: "City",
        modalTitle: "City",
        required: "City is required",
      },
      category: {
        placeholder: "Category",
        modalTitle: "Category",
      },
      swapTypes: {
        placeholder: "Swap Type",
        modalTitle: "Swap Type",
      },
      condition: {
        placeholder: "Condition",
        modalTitle: "Item Condition",
      },
      swapCategory: {
        placeholder: "Swap Category",
        modalTitle: "Swap Category",
        required: "Swap category is required",
      },
      status: {
        placeholder: "Status",
        modalTitle: "Status",
      },
    },
    itemDealsTab: {
      modalTitle: "New Deals",
    },
    itemPicker: {
      // noCategory: 'No items found under category \n"{{categoryName}}"',
      noCategoryTitle: "Oops!",
      noDataNoCategory:
        "You don’t have any items to swap in [ {{categoryName}} ].",
      noCategoryLinkTitle: "Please add item",
      noData: "No items found",
    },
    rating: {
      header: "Awesome 👍",
      body: "With Mata, it’s always a win-win deal. Your rating is appreciated.",
      btnSubmitTitle: "Rate",
      inputPlaceholder: "Tell us your experience (optional)",
      required: "Please rate first",
    },
    itemsSearch: {
      placeholder: "Search Items",
    },
    itemsList: {
      noDataFound: "We found no result, try again",
      changeFilterBtnTitle: "Change Filter",
    },
    acceptOfferModal: {
      title: "Start Deal",
      rejectOtherOffersTitle: "Reject other offers for this item",
      acceptBtnTitle: "Start",
      cancelBtnTitle: "Cancel",
    },
  },
  /////////////////////// start screens
  homeScreen: {
    title: "Home",
    profileBtnLabel: "My Profile",
    updateProfileDialog: {
      body: "Your profile is not complete, please update your profile to continue",
    },
  },
  signUpScreen: {
    username: {
      placeholder: "Email",
      required: "Email is required",
      invalid: "Invalid Email",
    },
    firstName: {
      placeholder: "First Name",
      required: "First name is required",
    },
    lastName: {
      placeholder: "Last Name",
      required: "Last name is required",
    },
    phonePrefix: {
      label: "Phone",
      placeholder: "Prefix",
      required: "Prefix required",
      invalid: "Invalid Prefix",
      pattern: "Must be ???",
    },
    country: {
      placeholder: "Country",
      required: "Country is required",
    },
    state: {
      placeholder: "State",
      required: "State is required",
    },
    city: {
      placeholder: "City",
      required: "City is required",
    },
    phone: {
      label: " ",
      placeholder: "Phone",
      required: "Phone is required",
      invalid: "Invalid phone number",
      pattern: "Must be ???",
    },
    password: {
      placeholder: "Password",
      required: "Password is required",
      pattern:
        "Password should be at least 8 characters and contains at least one letter and one number",
    },
    confirmPassword: {
      placeholder: "Confirm password",
      required: "Confirm Password is required",
      match: "Passwords must match",
    },
    terms: {
      label: "I accept all terms and privacy policy",
    },
    forgotPasswordLink: "Forgot Password",
    loginBtnTitle: "Sign in",
    loginGuestBtnTitle: "Sign in as guest",

    registerBtnTitle: "Register",
    passwordLink: "Forgot password?",
    haveAccountText: "Already have an account?",
    LoginLink: "Sign in now",
  },
  contactScreen: {
    subject: {
      placeholder: "Subject",
      required: "Subject is required",
    },
    body: {
      placeholder: "Message",
      required: "Message is required",
    },
    submitBtnTitle: "Send",
    submitSuccess: "Your message has been sent successfully",
  },
  signInScreen: {
    username: {
      placeholder: "Email",
      required: "Email is required",
      invalid: "Invalid Email",
    },
    password: {
      placeholder: "Password",
      required: "Password is required",
    },
    dontHaveAccountText: "Don’t have an account?",
    signUpLink: "Register now",
    forgotPasswordLink: "Forgot Password",
    loginBtnTitle: "Sign in",
    loginGuestBtnTitle: "Sign in as guest",
    facebookLoginButtonTitle: "Sign in with Facebook",
    appleLoginButtonTitle: "Sign in with Apple",
    passwordLink: "Forgot password?",
    guestLoginText: "or login",
    guestLoginLink: "as guest",
  },
  legalInfoScreen: {
    title: "Legal Information",
    termsAndConditions: "Terms and Conditions",
    privacyPolicy: "Privacy Policy",
  },
  forgotPasswordScreen: {
    title: "Forgot password",
    username: {
      placeholder: "Email",
      required: "Email is required",
      invalid: "Invalid Email",
    },
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordSubTitle:
      "Please enter your registered email to reset your password.",
    confirmBtnTitle: "Confirm",
    emailSentTitle:
      "We’ve just sent you an email. Please follow the instructions in the email to access your account.",
    emailSentSubTitle:
      "Please follow the instructions in the email to access your account.",
    haveAccountText: "Already have an account?",
    LoginLink: "Sign in now",
  },
  addItemScreen: {
    title: "Add Item",
    editItemTitle: "Edit Item",
    addItemSuccess: "Item added successfully 👋",
    editItemSuccess: "Item updated successfully 👋",
    name: {
      placeholder: "Item Name",
      required: "Name is required",
      invalid: "Invalid Name",
    },
    inappropriateContentWarning: {
      header: "Warning",
      body: "You can’t add such item content {{content}}\n\nPlease make sure your item is not violating Mata T’s & C’s",
    },
    description: {
      placeholder: "Short Description",
    },
    category: {
      placeholder: "Category",
      required: "Category is required",
      invalid: "Invalid Category",
      modalTitle: "Category",
    },
    swapType: {
      placeholder: "Swap Type",
      modalTitle: "Swap Type",
      required: "Swap type is required",
    },
    swapCategory: {
      placeholder: "Swap category",
      modalTitle: "Swap category",
      required: "Swap category is required",
    },
    status: {
      placeholder: "Status",
      required: "Status is required",
      invalid: "Invalid Status",
      label: "Status",
      online: "Online",
      draft: "Draft",
      saveAsDraftLabel: "Save Draft",
    },
    images: {
      required: "At least one image is required",
    },
    location: {
      required: "Item location is required",
    },
    addBtnTitle: "Add",
    updateBtnTitle: "Update",
  },
  profileScreen: {
    myItemsLink: "My Items",
    dealsLink: "My Deals",
    editProfileLink: "Edit Profile",
    changePasswordLink: "Change Password",
    myInterestsLink: "My Interests",
    inviteUserTitle: "Invite A Friend",
    wishListTitle: "My Wishlist",
    logout: {
      logoutLink: "Logout",
      confirmLogoutTitle: "Confirm Logout",
      confirmLogoutText: "Are You Sure?",
      confirmLogoutBtnTitle: "Confirm",
      cancelBtnTitle: "Cancel",
    },
    deleteAccount: {
      title: "Delete Account",
      link: "Delete Account",
      confirmTitle: "Delete Account",
      confirmText:
        "Are you sure? All your data will be deleted and any offers or deals will be cancelled?",
      confirmBtnTitle: "Confirm",
      cancelBtnTitle: "Cancel",
    },
  },
  editProfileScreen: {
    updateProfileDialog: {
      body: "Complete your profile for better experience",
    },
    firstName: {
      placeholder: "First Name",
      required: "First Name is required",
    },
    lastName: {
      placeholder: "Last Name",
      required: "Last Name is required",
    },
    email: {
      placeholder: "Email",
    },
    country: {
      placeholder: "Country",
      required: "Country is required",
    },
    state: {
      placeholder: "State",
      required: "State is required",
    },
    city: {
      placeholder: "City",
      required: "City is required",
    },
    phonePrefix: {
      label: "Phone",
      placeholder: "Code",
      required: "Prefix Required",
      invalid: "Invalid Prefix",
      pattern: "Must be ???",
    },
    phone: {
      label: " ",
      placeholder: "Phone",
      required: "Phone is required",
      invalid: "Invalid phone number",
      pattern: "Must be ???",
    },
    interests: {
      placeholder: "Interests",
      required: "Interests are required",
    },
    marketingFlag: {
      label: "Accepting marketing messages",
      required: "Status is required",
      invalid: "Invalid Status",
    },
    isPublic: {
      label: "Allow others to see my profile",
    },
    submitBtnTitle: "Update",
    changeSuccess: "Profile updated successfully 👋",
  },
  changePasswordScreen: {
    oldPasswordTitleText: "Enter old password.",
    newPasswordTitleText: "Enter new password.",
    submitBtnTitle: "Update",
    oldPassword: {
      placeholder: "Old Password",
      required: "Old Password is required",
    },
    newPassword: {
      placeholder: "New Password",
      required: "New password is required",
      pattern:
        "Password should be at least 8 characters and contains at least one letter and one number",
    },
    confirmPassword: {
      placeholder: "Confirm New Password",
      required: "Confirm Password is required",
      match: "Passwords must match",
      history: "Password can't be same as the old one",
    },
    submitSuccess: "Password changed successfully 👋",
  },
  dealsScreen: {
    menu: {
      archivedDealsLabel: "My Archived Deals",
    },
  },
  dealDetailsScreen: {
    outgoingDealTitle: "Outgoing deal",
    incomingDealTitle: "Incoming deal",
    approveBtnTitle: "Proceed",
    rejectBtnTitle: "Reject",
    closeBtnTitle: "Deal Done",
    rateBtnTitle: "Rate",
    cancelBtnTitle: "Cancel Deal",
    chatHeader: 'Chat with "{{userName}}"',
    menu: {
      cancelLabel: "Cancel Deal",
      rejectLabel: "Reject Offer",
    },
    closeDeal: {
      success: "Hurray, deal done!",
    },
    cancelOfferConfirmationHeader: "Cancel Deal",
    cancelOfferConfirmationBody: "Are you sure?",
    rejectOfferConfirmationHeader: "Reject Offer",
    rejectOfferConfirmationBody: "Are you sure?",
    confirmCloseDealHeader: "Close Deal",
    confirmCloseDealBody: "Before finalising the deal, make sure:",
    confirmCloseDealContent:
      "You are satisfied with the deal/item condition (as applicable) and you exchanged contact info with the other party/user (as needed) ",
  },
  IncomingDealsScreen: {
    noData: {
      body: "No offers at the moment",
      searchItemsLink: "Search items",
    },
  },
  OutgoingDealsScreen: {
    noData: {
      body: "No offers at the moment",
      searchItemsLink: "Search items",
    },
  },
  itemDetailsScreen: {
    ownerItemsTitle: "Owner other items",
    ownerTitle: "Owner: ",
    guestLabel: "Guest",
    sinceLabel: "Since {{time}}",
    itemDescriptionTitle: "Description: ",
    addressTitle: "Location: ",
    categoryTitle: "Category: ",
    itemConditionTitle: "Condition: ",
    pendingDialog: {
      header: "Warning",
      body: "You have pending deals on this item, deleting the item will cancel all pending deals",
    },
    editPendingDialog: {
      header: "Warning",
      body: "You have pending deals on this item, please close first",
    },
    blockedDialog: {
      header: "Warning",
      body: "Your item has been blocked for violating Mata T’s & C’s",
    },
    archivedDialog: {
      header: "Warning",
      body: "Item is no longer available, show similar items?",
      cancelBtn: "Cancel",
      showBtn: "Show",
    },
    deleteConfirmationHeader: "Confirm",
    deleteConfirmationBody:
      "Are you sure you want to delete item ({{itemName}})?",
    blockItemConfirmation: {
      header: "Warning",
      body: "Block item [{{itemName}}] to not be seen by others and item owner won't be able to edit it",
    },
    swapHeader: "New Offer",
    swapConfirmTitle: "Send",
    swapCategoryBody:
      'Send swap offer for item "{{source}}" with "{{destination}}"',
    swapBody: "Confirm sending new offer for item {{item}}",
    newOfferSuccess: "New offer sent successfully 👋",
    alreadyHasDealError: "You already have a deal for this item",
    swapTypeTitle: "Swap Type: ",
    swapCategoryTitle: "Swap Category: ",
    statusTitle: "Status: ",
    sendSwapButton: "Send Swap Offer",
    menu: {
      shareLabel: "Share",
      editItemLabel: "Edit",
      complainItemLabel: "Send Complain",
      deleteLabel: "Delete",
      dealsLabel: "My Ongoing Deals",
      archivedDealsLabel: "My Archived Deals",
      blockLabel: "Block Item",
    },
    itemPickerTitle: "Select Item",
  },
  MyItemsScreen: {
    menu: {
      archivedLabel: "Archived",
      itemsLabel: "Available",
    },
    noData: {
      title: "No items available for swap",
    },
    pendingDialog: {
      header: "Warning",
      body: "You have pending deals on this item, deleting the item will cancel all pending deals",
    },
    editPendingDialog: {
      header: "Warning",
      body: "You have pending deals on this item, please close first ",
    },
    addItemLinkTitle: "Add Item",
    addNewItemLinkTitle: "Add new Item",
  },
  ItemsScreen: {
    filterIcon: {
      label: "Filter",
    },
    viewInMapLabel: "View in map",
    noData: {
      noDataFound: "We found no result, try again",
      changeFilterBtnTitle: "Change Filter",
    },
  },
  SupportUsScreen: {
    content:
      "Mata is a free platform for all communities. Support Mata and buy us a coffee",
  },
  NotificationsScreen: {
    noNotificationTitle: " 👍",
    noNotificationsText: "All Good!",
  },
  ContactUsScreen: {
    content:
      "Mata is a free platform for all communities. Support Mata and buy us a coffee",
    subject: {
      placeholder: "Subject",
      required: "Subject is required",
    },
    body: {
      placeholder: "Message",
      required: "Message is required",
    },
    submitBtnTitle: "Send",
    submitSuccess: "Your message has been sent successfully",
  },
  ComplainsScreen: {
    header:
      "If you believe this item or its content is considered forbidden or illegal according to local authorities laws and regulations.",

    subject: {
      placeholder: "Subject",
      required: "Subject is required",
      defaultValue: "Report / Complaint",
    },
    type: {
      placeholder: "Type",
      required: "Type is required",
      modalTitle: "Type",
    },
    body: {
      placeholder: "Message",
      required: "Message is required",
    },
    submitBtnTitle: "Send",
    submitSuccess: "Your message has been sent successfully",
  },
  NoConnectionScreen: {
    contentTitle: "Oops",
    contentBody:
      "It seems there is something wrong with your internet connection.",
    retryBtnTitle: "Retry",
  },
  NoLocationScreen: {
    contentTitle: "Oops",
    contentBody:
      "Your device location seems to be turned off. For better experience, please turn on device location services.",
    retryBtnTitle: "Retry",
  },
  legalInfo: {
    title: "Legal Information",
    header1: "Dear customer,",
    header2:
      'Please read these Terms of Service ("Terms", "Terms of Service") and Privacy legal information carefully before using this mobile application',
    privacyTitle: "Privacy Policy",
    termsTitle: "Terms of Service",
    contactUsTitle: "Contact Us",
    aboutUsTitle: "About Us",
    contactUs: {
      title: "Contact Us",
      body: `If you have any questions about these Terms, You can contact us:
  •	By email: contact@mataup.com
  •	By visiting the contact page in our website: www.mataup.com
  •	By visiting the contact us page/screen in this Application`,
    },
    aboutUs: {
      title: "About Us",
      body: 'named Mata (the "Service") operated by MATA AOTEAROA LIMITED, Ellerslie, Auckland, 1060, New Zealand (“our company”, "us", "we", or "our").',
    },
  },

  /////////////////////// end screens

  error: errors,
  // legalInformation: legalInfo,
};
