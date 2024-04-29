"use client";

import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { backendWSPrefix } from "@/app/utils/fetch";

interface useWSProps {
  url: string;
}

const useWS = (props: useWSProps) => {
  // Used to refresh page when WebSocket connection is gone AFTER it has been established to prevent showing out of date data
  const [shouldRefreshPage, setShouldRefreshPage] = useState<boolean>(false);

  const ws = useWebSocket(backendWSPrefix + props.url, {
    onOpen: () => {
      setShouldRefreshPage(true);
    },
    heartbeat: { timeout: 10000 + 1000, interval: 5000 },
    shouldReconnect: (_) => {
      if (shouldRefreshPage) {
        window.location.reload();
        return false;
      }
      return true;
    },
  });

  return ws;
};

export default useWS;
