export let backendUrlPrefix = "/api";
export let backendWSPrefix = "/ws";

// Check response for usual stuff such as 401 for redirecting to /sign
async function processResponse(res: Response) {
  if (res.status === 401 && window.location.pathname !== "/sign") {
    const text = await res.text();
    if (text === "redirect") window.location.replace("/sign");
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

  await processResponse(response);

  return response;
}

export async function fetchBackendGET(url: string): Promise<Response> {
  const response: Response = await fetch(backendUrlPrefix + url);
  await processResponse(response);

  return response;
}
