import { defaults } from '../default';

export const authEndpoints = {
  loginUser: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/login/',
    },
  },
  forgotPasswordSendOTP: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/send-otp/',
    },
  },
  forgotPasswordVerifyEmailOTP: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/verify-email-otp/',
    },
  },
  forgotPasswordResetPassword: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/reset-password/',
    },
  },
  registerUser: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/register/',
    },
  },
  registerVerifyOTP: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/verify-otp/',
    },
  },
  getUserProfile: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/profile/',
    },
  },
  editUserProfile: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/profile/',
    },
  },
  changeUserPassword: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/change-password/',
    },
  },
  createContact: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/contact/',
    },
  },
  editContactApi: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/contact/',
    },
  },
  deleteContactApi: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/contact/',
    },
  },
  contactDetailApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/contact/',
    },
  },
  allContactsDirectory: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/all-contacts/',
    },
  },
  getAllNotesApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/notes/',
    },
  },
  deleteNoteApi: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/notes/',
    },
  },
  getContactsName: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/all-contacts-name/',
    },
  },
  createNoteApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/create-note/',
    },
  },
  editNoteApi: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/notes/',
    },
  },
  remindersApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/reminders/',
    },
  },
  memoriesApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/event/',
    },
  },
  birthdaysApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/birthdays/',
    },
  },
  completeReminderApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/complete-reminder/',
    },
  },
  contactUsFormApi: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/contact-us/',
    },
  },
  aboutUsDataApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/topics/',
    },
  },
  searchApi: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/search/',
    },
  },
};
