import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    const userUUID = uuidv4(); // UUID 생성
    addUser({ uuid: userUUID, socketId: socket.id });

    // 접속시 유저 정보 생성 이벤트 처리
    handleConnection(socket, userUUID);
    // 모든 서비스 이벤트 처리
    socket.on('event', (data) => handlerEvent(io, socket, data));
    // 접속 해제시 이벤트 처리
    socket.on('disconnect', () => handleDisconnect(socket, userUUID)); // disconnect 할때까지 대기하는 메서드
  });
};

export default registerHandler;
