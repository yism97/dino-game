import { CLIENT_VERSION } from '../constants.js';
import { createStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

// 종료와 접속 함수
export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users: ', getUser());
  // 스테이지 빈 배열 생성
  createStage(uuid);

  socket.emit('connection', { uuid });
};
// 유저의 모든 메시지를 받아 적절한 핸들러로 보내주는 이벤트 핸들러
export const handlerEvent = (io, socket, data) => {
  // 클라이언트 버전 체크
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  // 핸들러 맵핑
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);

  // 모든 유저에게 정보를 보내야 할 때
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  // 접속한 유저에게만 정보를 보내야 할 때
  socket.emit('response', response);
};
