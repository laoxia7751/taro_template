/* eslint-disable import/prefer-default-export */
import HTTPREQUEST from "./http";
import { uploadFile, uploadFiles } from './upload';

/* 首页-页面信息 */
export function getIndexInfo() {
  return HTTPREQUEST.get('/api/home/home');
}
