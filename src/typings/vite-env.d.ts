/// <reference types="vite/client" />
/**
 * Namespace Env
 *
 * It is used to declare the type of the import.meta object
 */
declare namespace Env {
  /** Interface for import.meta */
  // eslint-disable-next-line @typescript-eslint/no-shadow
  interface ImportMeta extends ImportMetaEnv {
    /** backend service base url */
    readonly VITE_SERVICE_BASE_URL: string;
    /**
     * success code of backend service
     *
     * when the code is received, the request is successful
     */
    readonly VITE_SERVICE_SUCCESS_CODE: string;
    /**
     * logout codes of backend service
     *
     * when the code is received, the user will be logged out and redirected to login page
     *
     * use "," to separate multiple codes
     */
    readonly VITE_SERVICE_LOGOUT_CODES: string;
    /**
     * modal logout codes of backend service
     *
     * when the code is received, the user will be logged out by displaying a modal
     *
     * use "," to separate multiple codes
     */
    readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string;
    /**
     * token expired codes of backend service
     *
     * when the code is received, it will refresh the token and resend the request
     *
     * use "," to separate multiple codes
     */
    readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string;
    /** when the route mode is static, the defined super role */
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}
