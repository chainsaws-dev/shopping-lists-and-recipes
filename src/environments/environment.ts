// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  RecipePageSize: 5,
  ShoppingListPageSize: 14,
  AdminUserListPageSize: 11,
  SessionsListPageSize: 11,
  MediaListPageSize: 12,
  ApiKey: 'AIzaSyB3Jr8tp5wotjeS-re9iBSgX2b1zbM0Fx4',
  ConfirmEmailUrl: '/api/ConfirmEmail',
  ResendEmailUrl: '/api/ConfirmEmail/Send',
  ResetPasswordUrl: '/api/PasswordReset',
  SendEmailResetPassUrl: '/api/PasswordReset/Send',
  SignUpUrl: '/api/Accounts/SignUp',
  SignInUrl: '/api/Accounts/SignIn',
  GetSetRecipesUrl: '/api/Recipes',
  GetSetFileUrl: '/api/Files',
  SearchRecipesUrl: '/api/Recipes/Search',
  GetSetShoppingListUrl: '/api/ShoppingList',
  GetSetUsersUrl: '/api/Users',
  GetSetSessionsUrl: '/api/Sessions',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
