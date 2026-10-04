// MANDATORY IN-MEMORY CACHE FOR GOOGLE WORKSPACE ACCESS TOKEN
// Never stored in localStorage or sessionStorage
let cachedAccessToken: string | null = null;

export const getWorkspaceAccessToken = (): string | null => cachedAccessToken;

export const setWorkspaceAccessToken = (token: string | null): void => {
  cachedAccessToken = token;
};
