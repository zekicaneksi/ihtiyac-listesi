let backendUrlPrefix = "/api";

// Check response for usual stuff such as 401 for redirecting to /sign
function processResponse(res: Response) {
  if (res.status === 401) {
    window.location.replace("/sign");
  }
}

export async function fetchBackendPOST<BodyType>(
  url: string,
  bodyData: BodyType,
): Promise<Response> {
  const response: Response = await fetch(backendUrlPrefix + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });

  processResponse(response);

  return response;
}

export async function fetchBackendGET(url: string): Promise<Response> {
  const response: Response = await fetch(backendUrlPrefix + url);
  processResponse(response);

  return response;
}
