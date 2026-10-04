import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  type User 
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

// Least-privilege scopes: only files this app creates/opens, plus Sheets.
// Never request full `drive` access for a minors' app.
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

// Ensure all scopes are registered on the provider
WORKSPACE_SCOPES.forEach(scope => {
  try {
    googleProvider.addScope(scope);
  } catch (e) {
    // Already added or non-fatal
  }
});

import { getWorkspaceAccessToken, setWorkspaceAccessToken } from "./workspaceToken";
export { getWorkspaceAccessToken, setWorkspaceAccessToken };

let isSigningIn = false;

// Auth state listener: Clears in-memory token on logout or session end
export const initWorkspaceAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    const token = getWorkspaceAccessToken();
    if (user && token) {
      if (onAuthSuccess) onAuthSuccess(user, token);
    } else if (!isSigningIn) {
      setWorkspaceAccessToken(null);
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogleWorkspace = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("No se pudo obtener el Access Token de Google OAuth.");
    }
    const token = credential.accessToken;
    setWorkspaceAccessToken(token);
    return { user: result.user, accessToken: token };
  } catch (error: any) {
    console.error("Error signing in with Google Workspace:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signOutWorkspace = async (): Promise<void> => {
  await signOut(auth);
  setWorkspaceAccessToken(null);
};

// Data interfaces
export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SheetTabInfo {
  sheetId: number;
  title: string;
  index: number;
  rowCount?: number;
  columnCount?: number;
}

export interface GoogleSpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: SheetTabInfo[];
  spreadsheetUrl: string;
}

// 1. List user spreadsheets from Google Drive
export async function listGoogleSpreadsheets(): Promise<DriveSpreadsheetFile[]> {
  const token = getWorkspaceAccessToken();
  if (!token) throw new Error("Debes iniciar sesión con tu cuenta de Google para acceder a tus hojas.");

  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=30`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error al listar hojas (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

// 2. Fetch metadata of a Google Sheet (tabs, properties)
export async function getSpreadsheetDetails(spreadsheetId: string): Promise<GoogleSpreadsheetMetadata> {
  const token = getWorkspaceAccessToken();
  if (!token) throw new Error("Sesión no iniciada con Google.");

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=false`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error al obtener información de la hoja (${res.status})`);
  }

  const data = await res.json();
  const sheets: SheetTabInfo[] = (data.sheets || []).map((s: any) => ({
    sheetId: s.properties?.sheetId,
    title: s.properties?.title || 'Hoja 1',
    index: s.properties?.index || 0,
    rowCount: s.properties?.gridProperties?.rowCount,
    columnCount: s.properties?.gridProperties?.columnCount
  }));

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Sin Título',
    sheets,
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
}

// 3. Read range from a Google Sheet
export async function getSpreadsheetValues(
  spreadsheetId: string, 
  sheetName: string, 
  range: string = 'A1:H30'
): Promise<string[][]> {
  const token = getWorkspaceAccessToken();
  if (!token) throw new Error("Sesión no iniciada con Google.");

  // Clean and encode range
  const fullRange = sheetName ? `${sheetName}!${range}` : range;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(fullRange)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error al leer los valores (${res.status})`);
  }

  const data = await res.json();
  return data.values || [];
}

// 4. Create a new Google Spreadsheet in Google Drive
export async function createGoogleSpreadsheet(
  title: string, 
  initialSheetTitle: string = 'Datos ESO',
  initialValues?: string[][]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const token = getWorkspaceAccessToken();
  if (!token) throw new Error("Sesión no iniciada con Google.");

  const requestBody: any = {
    properties: {
      title: title
    },
    sheets: [
      {
        properties: {
          title: initialSheetTitle
        }
      }
    ]
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error al crear hoja de cálculo (${res.status})`);
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // If initial values are supplied, write them immediately
  if (initialValues && initialValues.length > 0) {
    await updateSpreadsheetValues(spreadsheetId, `${initialSheetTitle}!A1`, initialValues);
  }

  return { spreadsheetId, spreadsheetUrl };
}

// 5. Update values in a Google Sheet
export async function updateSpreadsheetValues(
  spreadsheetId: string, 
  range: string, 
  values: string[][]
): Promise<{ updatedCells: number; updatedRows: number }> {
  const token = getWorkspaceAccessToken();
  if (!token) throw new Error("Sesión no iniciada con Google.");

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Error al guardar datos en Google Sheets (${res.status})`);
  }

  const data = await res.json();
  return {
    updatedCells: data.updatedCells || 0,
    updatedRows: data.updatedRows || 0
  };
}
