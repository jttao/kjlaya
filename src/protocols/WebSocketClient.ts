/**
* name 	
*/
module io {
	
	import Event = Laya.Event;
	import Socket = Laya.Socket;
	import Byte = Laya.Byte;
	import EventDispatcher = Laya.EventDispatcher;

	class WebSocketClient extends EventDispatcher {

		private socket: Socket;
		private output: Byte;  
		
		constructor(){
			super();
			this.connect();
		} 
		
		private connect(): void { 

			if(this.socket && this.socket.connected){
				return;  
			}

			this.socket = new Socket();
			//this.socket.connect("echo.websocket.org", 80);
			this.socket.connectByUrl("ws://echo.websocket.org:80");

			this.output = this.socket.output;

			this.socket.on(Event.OPEN, this, this.onSocketOpen);
			this.socket.on(Event.CLOSE, this, this.onSocketClose);
			this.socket.on(Event.MESSAGE, this, this.onMessageReveived);
			this.socket.on(Event.ERROR, this, this.onConnectError);

		}

		private close(): void {
			if(this.socket && this.socket.connected){
				this.socket.close(); 
				this.socket.cleanSocket();
			} 	
		} 

		public send(message: any):void {

			// 发送字符串
			this.socket.send(message); 

			// 使用output.writeByte发送 
			for (var i: number = 0; i < message.length; ++i) {
				this.output.writeByte(message.charCodeAt(i));
			} 
			this.socket.flush();

		}

		private onSocketOpen(): void {
			console.log("Connected");
			
		}

		private onSocketClose(): void {
			console.log("Socket closed");
		}

		private onMessageReveived(message: any): void {

			console.log("Message from server:");
			
			if (typeof message == "string") {
				console.log(message);
			}
			else if (message instanceof ArrayBuffer) { 
				console.log(new Byte(message).readUTFBytes());
			}

			this.event("message",message)
			this.socket.input.clear();
		}

		private onConnectError(e: Event): void {
			console.log("error");
		}

	}
}