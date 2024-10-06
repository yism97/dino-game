import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// import.meta.url은 현재 모듈의 URL을 나타내는 문자열
// fileURLToPath는 URL 문자열을 파일 시스템의 경로로 변환
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../public/assets'); // 우리 폴더의 위치, 최상위 경로+ assets 폴더
let gameAssets = {};

// 파일 읽는 함수
// 파일은 비동기 병렬로 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (error) {
    throw new Error('Failed to load game assets: ' + error.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
