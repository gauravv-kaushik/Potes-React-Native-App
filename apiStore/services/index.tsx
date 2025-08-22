import { callApi } from '../../utils/api/apiUtils';
import { authEndpoints } from '../endpoints/product';

export const loginUser = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.loginUser.v1,
    body,
  });
export const forgotPasswordSendOTP = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.forgotPasswordSendOTP.v1,
    body,
  });
export const forgotPasswordVerifyEmailOTP = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.forgotPasswordVerifyEmailOTP.v1,
    body,
  });
export const forgotPasswordResetPassword = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.forgotPasswordResetPassword.v1,
    body,
  });
export const registerUser = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.registerUser.v1,
    body,
  });
export const registerVerifyOTP = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.registerVerifyOTP.v1,
    body,
  });
export const getUserProfile = () =>
  callApi({
    uriEndPoint: authEndpoints.getUserProfile.v1,
  });
export const editUserProfile = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.editUserProfile.v1,
    body,
    multipart: true,
  });
export const changeUserPassword = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.changeUserPassword.v1,
    body,
  });
export const createContact = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.createContact.v1,
    body,
    multipart: true,
  });
export const editContactApi = ({ body, query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.editContactApi.v1,
    body,
    query,
    multipart: true,
  });
export const allContactsDirectory = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.allContactsDirectory.v1,
    query,
  });
export const contactDetailApi = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.contactDetailApi.v1,
    query,
  });
export const getAllNotesApi = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.getAllNotesApi.v1,
    query,
  });
export const getContactsName = () =>
  callApi({
    uriEndPoint: authEndpoints.getContactsName.v1,
  });
export const createNoteApi = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.createNoteApi.v1,
    body,
  });
export const editNoteApi = ({ body, query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.editNoteApi.v1,
    body,
    query,
  });
export const deleteNoteApi = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.deleteNoteApi.v1,
    query,
  });
export const deleteContactApi = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.deleteContactApi.v1,
    query,
  });
export const remindersApi = () =>
  callApi({
    uriEndPoint: authEndpoints.remindersApi.v1,
  });
export const memoriesApi = () =>
  callApi({
    uriEndPoint: authEndpoints.memoriesApi.v1,
  });
export const birthdaysApi = () =>
  callApi({
    uriEndPoint: authEndpoints.birthdaysApi.v1,
  });
export const completeReminderApi = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.completeReminderApi.v1,
    query,
  });
export const contactUsFormApi = ({ body }: any) =>
  callApi({
    uriEndPoint: authEndpoints.contactUsFormApi.v1,
    body,
  });
export const aboutUsDataApi = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.aboutUsDataApi.v1,
    query,
  });
export const searchApi = ({ query }: any) =>
  callApi({
    uriEndPoint: authEndpoints.searchApi.v1,
    query,
  });
