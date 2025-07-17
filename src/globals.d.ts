// Global TypeScript declarations for objects attached to the `window` object
// Add any other global variables you need to reference throughout the app here.
// Once declared, TypeScript will no longer complain that the property does not
// exist on `window`.

export {}; // Ensure this file is treated as a module.

declare global {
  interface Window {
    /**
     * Google Analytics gtag function added by the GA script tag.
     * Documentation: https://developers.google.com/analytics/devguides/collection/ga4
     */
    gtag?: (...args: any[]) => void;
  }
}
