import { FirebaseError } from "firebase/app"



export const authErrors = {
  "auth/admin-restricted-operation": "This operation is restricted to administrators only. Please contact your administrator for assistance.",
  "auth/argument-error": "An argument error occurred. Please check the input parameters and try again.",
  "auth/app-not-authorized": "This app is not authorized to use Firebase Authentication with the provided API key. Verify the app's authorization in the Google API console.",
  "auth/app-not-installed": "The requested mobile application is not installed on this device. Install the app and try again.",
  "auth/captcha-check-failed": "The reCAPTCHA verification failed. Ensure the token is valid, not expired, and matches the authorized domain list.",
  "auth/code-expired": "The SMS code has expired. Please request a new code to proceed.",
  "auth/cordova-not-ready": "The Cordova framework is not fully initialized. Retry after the setup is complete.",
  "auth/cors-unsupported": "This browser does not support the necessary CORS configuration. Consider using a different browser.",
  "auth/credential-already-in-use": "This credential is already linked to another account. Try signing in with a different method or unlinking the credential from the other account.",
  "auth/custom-token-mismatch": "The provided custom token is not valid for this project. Please review the token settings.",
  "auth/requires-recent-login": "This is a sensitive operation and requires a recent sign-in. Please log in again and try again.",
  "auth/dynamic-link-not-activated": "Activate Dynamic Links in the Firebase Console and accept the terms of use.",
  "auth/email-change-needs-verification": "Multi-factor users must have a verified email. Please verify your email address.",
  "auth/email-already-in-use": "This email address is already linked to an existing account. Try logging in or using a different email.",
  "auth/expired-action-code": "The action code has expired. Request a new one to proceed.",
  "auth/cancelled-popup-request": "This request was canceled because another popup was opened. Please close any other popups and try again.",
  "auth/internal-error": "An unexpected internal error occurred. Please try again later.",
  "auth/invalid-app-credential": "The phone verification request contains an invalid or expired application verifier.",
  "auth/invalid-app-id": "The mobile app ID provided is not registered in this project. Verify the app ID in the Firebase Console.",
  "auth/invalid-user-token": "This user's token is invalid for this project. Check if the token is tampered with or belongs to a different project.",
  "auth/invalid-auth-event": "An unexpected error occurred during authentication. Please try again.",
  "auth/invalid-verification-code": "The SMS code entered is invalid. Please ensure you are using the correct code.",
  "auth/invalid-continue-uri": "The provided continue URL is invalid. Please check and try again.",
  "auth/invalid-cordova-configuration": "To enable OAuth sign-in, ensure the required Cordova plugins are installed as outlined in Firebase documentation.",
  "auth/invalid-custom-token": "The format of the custom token is incorrect. Please verify according to the documentation.",
  "auth/invalid-dynamic-link-domain": "The provided dynamic link domain is not configured for this project. Confirm settings in the Firebase Console.",
  "auth/invalid-email": "The email format is invalid. Please enter a valid email address.",
  "auth/invalid-api-key": "The provided API key is invalid. Check that you've copied it correctly.",
  "auth/invalid-cert-hash": "The SHA-1 certificate hash is invalid. Please review and update it if necessary.",
  "auth/invalid-credential": "Invalid email or password. Please check again. If not registered, login with google or register.",
  "auth/invalid-message-payload": "The email template message contains invalid characters. Edit it in the Firebase Console Auth templates section.",
  "auth/invalid-multi-factor-session": "The request lacks proof of a successful initial sign-in.",
  "auth/invalid-oauth-provider": "This operation supports only OAuth providers. EmailAuthProvider is not supported here.",
  "auth/invalid-oauth-client-id": "The provided OAuth client ID is either invalid or does not match the given API key.",
  "auth/unauthorized-domain": "The domain is not authorized for OAuth in this project. Update the authorized domains in the Firebase Console.",
  "auth/invalid-action-code": "The action code is malformed, expired, or already used. Request a new code if necessary.",
  "auth/wrong-password": "The password is incorrect or the account does not have a password.",
  "auth/invalid-persistence-type": "The selected persistence type is invalid. It can be local, session, or none.",
  "auth/invalid-phone-number": "The phone number format is incorrect. Use E.164 format, e.g., +[country code][number].",
  "auth/invalid-provider-id": "The specified provider ID is invalid.",
  "auth/invalid-recipient-email": "The recipient email address is invalid. Please provide a valid email.",
  "auth/invalid-sender": "The email template sender email or name is invalid. Update it in the Firebase Console.",
  "auth/invalid-verification-id": "The verification ID is invalid. Please check the ID and try again.",
  "auth/invalid-tenant-id": "The tenant ID in the Auth instance is invalid.",
  "auth/multi-factor-info-not-found": "No matching second factor identifier found for the user.",
  "auth/multi-factor-auth-required": "A second-factor authentication is required to sign in.",
  "auth/missing-android-pkg-name": "Provide an Android Package Name if the Android app is required.",
  "auth/auth-domain-config-required": "Include authDomain in firebase.initializeApp() per Firebase Console instructions.",
  "auth/missing-app-credential": "The phone verification request lacks an application verifier (reCAPTCHA token).",
  "auth/missing-verification-code": "The SMS verification code is empty. Please provide a valid code.",
  "auth/missing-continue-uri": "A continue URL is required to proceed.",
  "auth/missing-iframe-start": "An internal error occurred during iframe initialization.",
  "auth/missing-ios-bundle-id": "An iOS Bundle ID is required if an App Store ID is provided.",
  "auth/missing-multi-factor-info": "No identifier for a second factor is provided.",
  "auth/missing-multi-factor-session": "Proof of first factor sign-in is missing.",
  "auth/missing-or-invalid-nonce": "The nonce is invalid. Ensure the SHA-256 hash of the nonce matches the hashed nonce in the ID token.",
  "auth/missing-phone-number": "A phone number is required to send verification codes.",
  "auth/missing-verification-id": "The verification ID is empty. Provide a valid verification ID.",
  "auth/app-deleted": "This FirebaseApp instance has been deleted. Reinitialize the app to continue.",
  "auth/account-exists-with-different-credential": "An account with this email exists with different sign-in credentials. Use an associated sign-in method.",
  "auth/network-request-failed": "A network error occurred. Check your internet connection and try again.",
  "auth/no-auth-event": "An unexpected error occurred. Please retry the authentication.",
  "auth/no-such-provider": "The user is not linked to an account with the specified provider.",
  "auth/null-user": "A null user object was provided for an operation that requires a valid user object.",
  "auth/operation-not-allowed": "The selected sign-in provider is disabled. Enable it in the Firebase Console Auth section.",
  "auth/operation-not-supported-in-this-environment": "This operation is not supported in this environment. Ensure HTTP/HTTPS or chrome-extension protocol and enabled web storage.",
  "auth/popup-blocked": "The popup could not connect and may have been blocked by the browser.",
  "auth/popup-closed-by-user": "The user closed the popup before completing the operation.",
  "auth/provider-already-linked": "Each provider can be linked only once per user account.",
  "auth/quota-exceeded": "The project's quota for this operation is exceeded.",
  "auth/redirect-cancelled-by-user": "The redirect operation was canceled before completion.",
  "auth/redirect-operation-pending": "A redirect sign-in operation is already in progress.",
  "auth/rejected-credential": "The credential is malformed or mismatched.",
  "auth/second-factor-already-in-use": "This second factor is already linked to this account.",
  "auth/maximum-second-factor-count-exceeded": "The maximum number of second factors allowed for this user is exceeded.",
  "auth/tenant-id-mismatch": "The provided tenant ID does not match the instance's tenant ID.",
  "auth/timeout": "The operation timed out. Please try again.",
  "auth/user-token-expired": "The user’s credentials have expired. Sign in again to continue.",
  "auth/too-many-requests": "We’ve blocked requests from this device due to unusual activity. Try again later.",
  "auth/unauthorized-continue-uri": "The continue URL domain is not whitelisted. Please add it in the Firebase Console.",
  "auth/unsupported-first-factor": "Enrolling or signing in with a multi-factor account requires a valid first factor.",
  "auth/unsupported-persistence-type": "The environment does not support the specified persistence type.",
  "auth/unsupported-tenant-operation": "This operation is not supported in a multi-tenant setup.",
  "auth/unverified-email": "A verified email is required to perform this action.",
  "auth/user-cancelled": "The user did not approve the requested permissions for your app.",
  "auth/user-not-found": "No user found with this identifier. The user may have been deleted.",
  "auth/user-disabled": "This account has been disabled by an administrator.",
  "auth/user-mismatch": "The credentials do not match the previously signed-in user.",
  "auth/user-signed-out": "The user has been signed out. Sign in again to continue.",
  "auth/weak-password": "The password is too weak. It should be at least 6 characters.",
  "auth/web-storage-unsupported": "This browser does not support web storage or has 3rd-party cookies disabled."
}