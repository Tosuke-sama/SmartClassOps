/**
 * @Description
 */
class WebSocketService {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.isReady = false;
    this.callbacks = {};
    this.eventHandlers = {
      open: [],
      close: [],
      message: [],
      error: [],
    };

    this.initialize();
  }

  initialize() {
    this.socket.binaryType = 'arraybuffer';

    this.socket.addEventListener('open', () => {
      this.isReady = true;
      this.eventHandlers.open.forEach((callback) => callback());
    });

    this.socket.addEventListener('close', () => {
      this.isReady = false;
      this.eventHandlers.close.forEach((callback) => callback());
    });

    this.socket.addEventListener('message', (event) => {
      this.eventHandlers.message.forEach((callback) => callback(event.data));
    });

    this.socket.addEventListener('error', (error) => {
      this.eventHandlers.error.forEach((callback) => callback(error));
    });
  }

  sendAudioData(data) {
    if (this.isReady) {
      this.socket.send(data);
    } else {
      console.error('WebSocket connection is not ready yet.');
    }
  }

  onOpen(callback) {
    this.eventHandlers.open.push(callback);
  }

  onClose(callback) {
    this.eventHandlers.close.push(callback);
  }

  onMessage(callback) {
    this.eventHandlers.message.push(callback);
  }

  onError(callback) {
    this.eventHandlers.error.push(callback);
  }
  reMoveMessage(callback){
    this.socket.removeEventListener('message',callback);
  }
}
export default WebSocketService;
