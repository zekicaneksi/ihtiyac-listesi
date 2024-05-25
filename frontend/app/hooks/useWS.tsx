"use client";

import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { backendWSPrefix } from "@/app/utils/fetch";

interface useWSProps {
  url: string;
}

const useWS = (props: useWSProps) => {
  // Used to refresh page when WebSocket reconnection is made to prevent showing out of date data
  const [shouldRefreshPage, setShouldRefreshPage] = useState<boolean>(false);

  function refreshPage() {
    window.location.reload();
  }

  const ws = useWebSocket(backendWSPrefix + props.url, {
    onOpen: () => {
      if (shouldRefreshPage) refreshPage();
      setShouldRefreshPage(true);
    },
    onReconnectStop() {
      refreshPage();
    },
    heartbeat: { timeout: 10000 + 1000, interval: 5000 },
    shouldReconnect: (_) => true,
  });

  return ws;
};

export default useWS;
