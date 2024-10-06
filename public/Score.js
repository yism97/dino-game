import { sendEvent } from './Socket.js';
import stages from '../assets/stage.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stageLevel = 0; // 초기 스테이지 설정
  currentStageId = 1000;
  targetStageId = 1001;
  scorePerSecond = 1;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  movestage() {
    this.stageLevel++;
    console.log(`Stage Level : ${this.stageLevel}`);
    sendEvent(11, { currentStage: this.currentStageId, targetStage: this.targetStageId });
    this.currentStageId = this.targetStageId;
    this.targetStageId++;
  }

  update(deltaTime) {
    // 현재 스테이지의 scorePerSecond에 따라 점수 증가
    this.scorePerSecond = stages.data[this.stageLevel].scorePerSecond;
    this.score += deltaTime * 0.001 * this.scorePerSecond;
    // 스테이지 변경을 확인
    const stageIndex = stages.data.findIndex((e) => e.id === this.targetStageId);
    const stageLength = stages.data.length;

    let nextStageScore = null;
    if (stageIndex === stageLength - 1) {
      this.stageChange = false;
    } else {
      nextStageScore = stages.data[stageIndex].score;
    }

    if (Math.floor(this.score) >= nextStageScore && this.stageChange) {
      return this.movestage();
    }
  }

  // 현재 스테이지 레벨 리턴
  getStageLevel() {
    return this.stageLevel;
  }

  getItem(itemId) {
    // 아이템 획득시 점수 변화
    this.score += 0;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const nowStage = this.stageLevel + 1;
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const stageX = 10;
    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const stagePadded = nowStage.toString().padStart(1, 0);
    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(`Stage: ${stagePadded}`, stageX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`High: ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
