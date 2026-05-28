import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const description = `
REST API for creating and managing polls.

## WebSocket Gateway

**Namespace:** \`/polls\`
**Transport:** Socket.IO

Connect to the gateway to receive real-time poll results.

### Client → Server events

| Event | Payload | Description |
|---|---|---|
| \`joinPoll\` | \`pollId: number\` | Subscribe to a poll room. Immediately emits current results back to the caller via \`resultsUpdated\`. |
| \`leavePoll\` | \`pollId: number\` | Unsubscribe from a poll room. |

### Server → Client events

| Event | Payload | Description |
|---|---|---|
| \`resultsUpdated\` | \`{ pollId, title, questions: [{ questionId, text, options: [{ optionId, text, votes }] }] }\` | Broadcast to all clients in the poll room after each answer submission. |

### Example (Socket.IO client)
\`\`\`js
const socket = io('http://localhost:3000/polls');
socket.emit('joinPoll', 1);
socket.on('resultsUpdated', (results) => console.log(results));
\`\`\`
`;

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Voting System API')
    .setDescription(description)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
