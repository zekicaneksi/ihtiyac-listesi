let backendUrlPrefix = "/api";

export function fetchBackendPOST<BodyType>(
  url: string,
  bodyData: BodyType,
): Promise<Response> {
  return fetch(backendUrlPrefix + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
}
