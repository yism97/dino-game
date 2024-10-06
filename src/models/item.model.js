//key: uuid, value array ->Item정보는 배열
const items = {};

//유저의 아이템 배열 생성
export const createItem = (uuid) => {
  items[uuid] = [];
  console.log(`createItem`);
};

//유저가 획득한 아이템 받아오기
export const getItem = (uuid) => {
  console.log(`getItem`);
  return items[uuid];
};

//유저 아이템 초기값 세팅
export const setItem = (uuid, id, timestamp, itemScore) => {
  console.log(`setItem`);
  return items[uuid].push({ id, timestamp, itemScore });
};

//유저 아이템 비우기
export const clearItem = (uuid) => {
  console.log(`clearItem`);
  items[uuid] = [];
};
