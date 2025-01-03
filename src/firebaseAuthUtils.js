const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/claims-too-large":
      return "The claim data is too large. Please reduce the size of the claims.";
    case "auth/email-already-exists":
      return "The email is already in use. Please use a different email address.";
    case "auth/id-token-expired":
      return "Your session has expired. Please log in again.";
    case "auth/id-token-revoked":
      return "Your session has been revoked. Please log in again.";
    case "auth/insufficient-permission":
      return "You do not have permission to perform this action. Please contact an admin.";
    case "auth/internal-error":
      return "An unexpected error occurred. Please try again later.";
    case "auth/invalid-argument":
      return "Invalid argument provided. Please check your input and try again.";
    case "auth/invalid-claims":
      return "Invalid claim attributes. Please check the data and try again.";
    case "auth/invalid-continue-uri":
      return "The URL provided is invalid. Please check the URL and try again.";
    case "auth/invalid-creation-time":
      return "Invalid creation time provided. Please check the date format and try again.";
    case "auth/invalid-credential":
      return "Invalid credentials provided. Please check your authentication method.";
    case "auth/invalid-disabled-field":
      return "Invalid value for the disabled user property. It must be a boolean.";
    case "auth/invalid-display-name":
      return "The display name must be a non-empty string.";
    case "auth/invalid-dynamic-link-domain":
      return "The dynamic link domain is not configured or authorized for your project.";
    case "auth/invalid-email":
      return "The email address is invalid. Please check the format and try again.";
    case "auth/invalid-email-verified":
      return "The email verified flag is invalid. It must be a boolean.";
    case "auth/invalid-id-token":
      return "The ID token is invalid. Please log in again.";
    case "auth/invalid-last-sign-in-time":
      return "Invalid last sign-in time provided. Please check the date format and try again.";
    case "auth/invalid-page-token":
      return "Invalid page token provided. Please check the token and try again.";
    case "auth/invalid-password":
      return "The password is invalid. It must be at least 6 characters long.";
    case "auth/invalid-phone-number":
      return "The phone number is invalid. Please check the number and try again.";
    case "auth/invalid-photo-url":
      return "The photo URL is invalid. Please provide a valid URL.";
    case "auth/invalid-provider-data":
      return "Invalid provider data. Please check the provider details and try again.";
    case "auth/invalid-provider-id":
      return "Invalid provider ID. Please check the provider details and try again.";
    case "auth/invalid-session-cookie-duration":
      return "The session cookie duration is invalid. It must be between 5 minutes and 2 weeks.";
    case "auth/invalid-uid":
      return "The UID is invalid. It must be a non-empty string.";
    case "auth/invalid-user-import":
      return "The user data is invalid. Please check the import file and try again.";
    case "auth/maximum-user-count-exceeded":
      return "The maximum number of users has been exceeded.";
    case "auth/missing-android-pkg-name":
      return "The Android Package Name is required. Please provide a valid package name.";
    case "auth/missing-continue-uri":
      return "A valid continue URL is required.";
    case "auth/missing-ios-bundle-id":
      return "The iOS Bundle ID is missing. Please provide a valid bundle ID.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled for your project. Please enable it in the Firebase console.";
    case "auth/phone-number-already-exists":
      return "The phone number is already in use. Please use a different number.";
    case "auth/project-not-found":
      return "No Firebase project was found. Please check your Firebase configuration.";
    case "auth/session-cookie-expired":
      return "Your session cookie has expired. Please log in again.";
    case "auth/session-cookie-revoked":
      return "Your session cookie has been revoked. Please log in again.";
    case "auth/too-many-requests":
      return "Too many requests have been made. Please try again later.";
    case "auth/uid-already-exists":
      return "The UID is already in use. Please use a different UID.";
    case "auth/unauthorized-continue-uri":
      return "The continue URL domain is not whitelisted. Please check your Firebase console settings.";
    case "auth/user-not-found":
      return "No user found with the provided identifier. Please check the details and try again.";
    default:
      return "An error occurred. Please try again.";
  }
};

export { getErrorMessage };
