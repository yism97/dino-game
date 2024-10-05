//user.model.js
const users = [];

export const addUser = (user) => {
  users.push(user);
};

// 유저가 접속해제할때
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = () => {
  return users;
};
