export enum RoleEvents {
  // roleList
  ROLE_CLICKED = 'role_clicked',
  ROLE_DELETED_CONFIRMED = 'role_delete_confirmed',
  ROLE_DELETED_CANCELLED = 'role_delete_cancelled',
  ROLE_DELETED_INITIATED = 'role_delete_initiated',
  ROLE_LIST_RETRY = 'role_list_retry',

  // roleId
  ROLE_UPDATE_CONFIRM_SAVE = 'role_update_confirm_save',
  ROLE_UPDATE_CONFIRM_CANCEL = 'role_update_confirm_cancel',
  ROLE_UPDATE_BACK_CLICKED = 'role_update_back_clicked',
  ROLE_UPDATE_SAVE_BUTTON_CLICKED = 'role_update_save_button_clicked',
  ROLE_DETAIL_RETRY = 'role_detail_retry',

  // role index
  ROLE_CREATE_INITIATED = 'role_create_initiated',

  // role create
  ROLE_CREATE_BACK_CLICKED = 'role_create_back_clicked',
  ROLE_CREATE_BUTTON_CLICKED = 'role_create_button_clicked',

}

export enum UserEvents {
  // userList
  USER_CLICKED = 'user_clicked',

  // userId
  USER_DELETED_INITIATED = 'user_delete_initiated',
  USER_DELETED_CONFIRMED = 'user_delete_confirmed',
  USER_DELETED_CANCELLED = 'user_delete_cancelled',
  USER_UPDATE_BACK_CLICKED = 'user_update_back_clicked',
  USER_UPDATE_SAVE_BUTTON_CLICKED = 'user_update_save_button_clicked',

  // user index
  USER_ROLE_FILTER_APPLIED = 'user_role_filter_applied',
  USER_CREATE_INITIATED = 'user_create_initiated',
  USER_LIST_RETRY = 'user_list_retry',

  // user create
  USER_CREATE_BACK_CLICKED = 'user_create_back_clicked',
  USER_CREATE_BUTTON_CLICKED = 'user_create_button_clicked',

}

export enum AccountEvents {
  // account index
  ACCOUNT_CHANGE_PASSWORD_CLICKED = 'account_change_password_clicked',
  ACCOUNT_LOGOUT_INITIATED = 'account_logout_initiated',

  // change password 
  PASSWORD_CHANGE_ATTEMPTED = 'password_change_attempted',
  PASSWORD_CHANGE_BACK_CLICKED = 'password_change_back_clicked',
}

export enum LoginEvents {
  // login
  LOGIN_BUTTON_CLICKED = 'login_button_clicked',
  LOGIN_REGISTER_LINK_CLICKED = 'login_register_link_clicked',
  LOGIN_FORGOT_PASSWORD_CLICKED = 'login_forgot_password_clicked',
}

export enum CommonEvents {
  LANGUAGE_CHANGED = 'language_changed',
  PAGE_VIEW = 'page_view',
}

export enum RegistrationEvents {
  // register
  REGISTRATION_ATTEMPTED = "registration_attempted",
  REGISTRATION_LOGIN_LINK_CLICKED = "registration_login_link_clicked",
};