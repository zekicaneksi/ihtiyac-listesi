import { useEffect, useRef, useState } from "react";

interface Props {
  url: string;
}

export const useWs = ({ url }: Props) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [val, setVal] = useState(null);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("/ws" + url);

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (event) => setVal(event.data);
    socket.onerror = () => window.location.reload();

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  // bind is needed to make sure `send` references correct `this`
  return [
    isReady,
    val,
    ws.current ? ws.current.send.bind(ws.current) : null,
  ] as const;
};
