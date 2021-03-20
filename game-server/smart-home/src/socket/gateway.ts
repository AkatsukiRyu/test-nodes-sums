import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class SmartHomeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('SmartHomeGateway');

  afterInit(server: any) {
    console.log('Gateway initiated');
  }

  // just a temperature for received device status from device sending to server
  @SubscribeMessage('homeDevices')
  public handleReceivingDeviceStatus(client: Socket, payload: string): void {
    // handling status of device which received from device
    // Saved first.
    console.log('Device: ', client);
  }

  // This is a endpoint for client send and received message from server
  @SubscribeMessage('deviceStatus')
  public handleDeviceStatus(client: Socket, payload: string): void {
    // Response to client, payload is just the body sent to Client
    this.server.emit('homeItemsStatusClient', payload);
  }

  handleConnection(client: any, ...args: any[]) {
    // Client Connected, the current Client connected here should be saved to DB or registered Connection of Device
    // More Over should be checked is device allowed for connecting

    console.log('Client Connected: ', client);
  }

  handleDisconnect(client: any) {
    // With Device Connection if there are any problem with disconnected with Device should be warn to client

    console.log('Client Disconnected: ', client);
  }
}
