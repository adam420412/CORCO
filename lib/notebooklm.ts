const PROJECT_NUMBER = process.env.NOTEBOOKLM_PROJECT_NUMBER!;
const LOCATION = process.env.NOTEBOOKLM_LOCATION || "global";
const ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN!;

const BASE_URL = `https://${LOCATION}-discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_NUMBER}/locations/${LOCATION}/notebooks`;

function headers(extra?: Record<string, string>): HeadersInit {
  return {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NotebookLM API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

/** Creates a new notebook */
export async function createNotebook(
  title: string
): Promise<{ notebookId: string; name: string }> {
  const data = await request<{ name: string }>(BASE_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ title }),
  });

  // name format: projects/{p}/locations/{l}/notebooks/{id}
  const notebookId = data.name.split("/").pop()!;
  return { notebookId, name: data.name };
}

/** Adds text content as a source to a notebook */
export async function addTextSource(
  notebookId: string,
  sourceName: string,
  content: string
): Promise<{ sourceId: string }> {
  const url = `${BASE_URL}/${notebookId}/sources:batchCreate`;
  const data = await request<{ sources: Array<{ name: string }> }>(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      userContents: [
        { textContent: { sourceName, content } },
      ],
    }),
  });

  const sourceId = data.sources[0].name.split("/").pop()!;
  return { sourceId };
}

/** Adds a web URL as a source */
export async function addWebSource(
  notebookId: string,
  url: string,
  sourceName: string
): Promise<{ sourceId: string }> {
  const endpoint = `${BASE_URL}/${notebookId}/sources:batchCreate`;
  const data = await request<{ sources: Array<{ name: string }> }>(endpoint, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      userContents: [
        { webContent: { url, sourceName } },
      ],
    }),
  });

  const sourceId = data.sources[0].name.split("/").pop()!;
  return { sourceId };
}

/** Uploads a file (PDF, DOCX, TXT, etc.) to a notebook */
export async function uploadFileSource(
  notebookId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<{ sourceId: string }> {
  const url = `https://${LOCATION}-discoveryengine.googleapis.com/upload/v1alpha/projects/${PROJECT_NUMBER}/locations/${LOCATION}/notebooks/${notebookId}/sources:uploadFile`;

  const data = await request<{ source: { name: string } }>(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": contentType,
      "X-Goog-Upload-File-Name": fileName,
      "X-Goog-Upload-Protocol": "raw",
    },
    body: fileBuffer,
  });

  const sourceId = data.source.name.split("/").pop()!;
  return { sourceId };
}

/** Gets notebook details */
export async function getNotebook(notebookId: string): Promise<any> {
  return request(`${BASE_URL}/${notebookId}`, {
    method: "GET",
    headers: headers(),
  });
}

/** Gets a source in a notebook */
export async function getSource(
  notebookId: string,
  sourceId: string
): Promise<any> {
  return request(`${BASE_URL}/${notebookId}/sources/${sourceId}`, {
    method: "GET",
    headers: headers(),
  });
}

/** Deletes sources from a notebook */
export async function deleteSources(
  notebookId: string,
  sourceNames: string[]
): Promise<void> {
  const url = `${BASE_URL}/${notebookId}/sources:batchDelete`;
  await request(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ names: sourceNames }),
  });
}

/** Creates an audio overview from notebook sources */
export async function createAudioOverview(
  notebookId: string,
  options?: {
    sourceIds?: string[];
    focus?: string;
    languageCode?: string;
  }
): Promise<{ audioOverviewId: string }> {
  const url = `${BASE_URL}/${notebookId}/audioOverviews`;
  const body: Record<string, unknown> = {};

  if (options?.sourceIds) body.sourceIds = options.sourceIds;
  if (options?.focus) body.episodeFocus = options.focus;
  if (options?.languageCode) body.languageCode = options.languageCode;

  const data = await request<{ name: string }>(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  const audioOverviewId = data.name.split("/").pop()!;
  return { audioOverviewId };
}
