import uuid from "react-native-uuid";

const WebsocketHander = (url) => {
  const ws = new WebSocket(url);

  ws.onerror = (e) => {
    console.log("Websocket error", e);
  };

  const waitForConnectionToOpen = () => {
    if (ws.readyState === 1) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      ws.onopen = () => resolve();
    });
  };

  ws.onmessage = (event) => {
    // console.log(event.data);
  };
  ws.onclose = () => {
    console.log("Websocket disconnected");
  };
  // Send message to server and await an acknowledgement
  const messageQueue = [];
  const send = async (message) => {
    const messageId = uuid.v4();
    messageQueue.push(messageId);
    ws.send(JSON.stringify({ message, messageId }));
    const response = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout"));
      }, 5000);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data.messageId);
        if (data.messageId === messageId) {
          clearTimeout(timeout);
          resolve(data.message);
        }
      };
    });
  };

  const sendFile = async (base64, fname, statusUpdate) => {
    // Break up the base64 string into chunks
    const chunks = [];
    const chunksize = 1024 * 100;
    for (let i = 0; i < base64.length; i += chunksize) {
      chunks.push(base64.substring(i, i + chunksize));
    }
    // Send each chunk
    let queue = [];
    for (let i = 0; i < chunks.length; i++) {
      await send({
        // queue.push(
        type: "file",
        data: chunks[i],
        chunk: i,
        totalChunks: chunks.length,
      });
      // console.log(`Chunk ${i} sent`);
      statusUpdate &&
        statusUpdate({
          sent: i,
          total: chunks.length,
          ratio: (i + 1) / chunks.length,
        });
    }
    console.log("File sent");
    await send({ type: "finish", filename: fname });
    console.log("File finished");
    const getTotalChunks = () => {
      return chunks.length;
    };
  };

  return { send, sendFile, waitForConnectionToOpen };
};

export { WebsocketHander };
