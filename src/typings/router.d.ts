import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Title for the route (displayed in menu and browser title)
     */
    title?: string;

    /**
     * Icon component name from ElementPlus icons
     */
    icon?: string;

    /**
     * If true, the route will be hidden from the menu
     */
    hideInMenu?: boolean;

    /**
     * Authorization required for this route
     */
    requiresAuth?: boolean;

    /**
     * Roles allowed to access this route
     */
    roles?: string[];
  }
}
