import { getGameAssets } from '../init/assets.js';

// 아이템 획득 검증
export const itemHandler = (userId, payload) => {
  const { items, itemUnlocks } = getGameAssets();
  const { itemId, score, stageId, timestamp } = payload;

  // 아이템 종류 별 획득 점수 계산
  const index = items.data.findIndex((e) => e.id === itemId);
  // 클라이언트에서 받은 점수가 확인 점수와 다를 시, 아이템 획득 점수 인증 실패 메시지 반환
  if (score !== items.data[index].score) {
    return { status: 'fail', message: 'item score verification failed' };
  }

  // 아이템 종류 별 획득 스테이지 검증
  const unlockIndex = itemUnlocks.data.findIndex((e) => e.stage_id === stageId);
  // 클라이언트에서 받은 아이템 ID가 스테이지에 맞는 해금 아이템이 들어오지 않은 경우, 실패 메시지 반환
  if (!itemUnlocks.data[unlockIndex].item_id.includes(itemId)) {
    return { status: 'fail', message: 'item unlock stage verification failed' };
  }

  return {
    status: 'success',
    message: '아이템 획득 성공!',
    handler: 21,
  };
};
