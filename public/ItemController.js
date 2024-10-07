import Item from './Item.js';
import item_unlock from './assets/item_unlock.json' with { type: 'json' };
import items from './assets/item.json' with { type: 'json' };

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 5000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem(stageIndex) {
    // item_unlock.json의 데이터 테이블 item_id
    const itemId = item_unlock.data[stageIndex].item_id;
    // item_id의 index중 첫번째부터 마지막요소 중 하나를 랜덤으로 가져옴
    const index = this.getRandomNumber(0, itemId.length - 1);
    // index의 item_id의 값 할당
    const itemInfo = this.itemImages[itemId[index] - 1];

    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
    // 생성한 아이템 ID 반환
    return itemId[index];
  }

  update(gameSpeed, deltaTime, stageIndex) {
    if (this.nextInterval <= 0) {
      this.createItem(stageIndex);
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);

      // 아이템 획득 시 해당 아이템의 점수 출력
      const itemIndex = items.data.findIndex((e) => e.id === collidedItem.id);
      const itemScore = items.data[itemIndex].score;

      // 아이템 점수 표시
      console.log(`아이템 획득 점수: ${itemScore}`);
      return {
        itemId: collidedItem.id,
        score: itemScore,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
