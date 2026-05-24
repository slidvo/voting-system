import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { PollService } from './poll.service';

@WebSocketGateway({
    cors: { origin: "*" },
    namespace: 'polls',
})
export class PollGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(PollGateway.name);

    constructor(
         @Inject(forwardRef(() => PollService))
        private readonly pollService: PollService
    ) {}

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    // Клиент подписывается на результаты опроса
    @SubscribeMessage('joinPoll')
    async handleJoinPoll(
        @MessageBody() pollId: number,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`poll_${pollId}`);
        this.logger.log(`Client ${client.id} joined poll ${pollId}`);

        // Сразу отправляем текущие результаты при подключении
        const results = await this.pollService.getPollResults(pollId);
        client.emit('resultsUpdated', results);
    }

    // Клиент отписывается от результатов опроса
    @SubscribeMessage('leavePoll')
    handleLeavePoll(
        @MessageBody() pollId: number,
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(`poll_${pollId}`);
        this.logger.log(`Client ${client.id} left poll ${pollId}`);
    }

    // Вызывается из PollService после сохранения ответов
    async broadcastResults(pollId: number) {
        const results = await this.pollService.getPollResults(pollId);
        this.server
            .to(`poll_${pollId}`)
            .emit('resultsUpdated', results);
        this.logger.log(`Broadcasted results for poll ${pollId}`);
    }
}