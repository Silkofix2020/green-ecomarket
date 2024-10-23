/**
 * @typedef {Object} ComputedRef
 * @template T
 * @property {T} value
 */

/**
 * @typedef {Object} Ref
 * @template T
 * @property {T} value
 */

/**
 * @typedef {Object} User
 */

/**
 * @typedef {Object} UserSession
 * @property {User} [user]
 */

/**
 * @typedef {UserSession} UserSessionRequired
 * @property {User} user
 */

/**
 * @typedef {Object} UserSessionComposable
 * @property {ComputedRef<boolean>} ready - Computed indicating if the auth session is ready
 * @property {ComputedRef<boolean>} loggedIn - Computed indicating if the user is logged in
 * @property {ComputedRef<User|null>} user - The user object if logged in, null otherwise
 * @property {Ref<UserSession>} session - The session object
 * @property {function(): Promise<void>} fetch - Fetch the user session from the server
 * @property {function(): Promise<void>} clear - Clear the user session and remove the session cookie
 */

export const User = {};
export const UserSession = {};
export const UserSessionRequired = {};
export const UserSessionComposable = {};
