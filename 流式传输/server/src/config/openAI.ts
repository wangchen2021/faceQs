import OpenAI from 'openai';

/**
 * @link https://console.volcengine.com/ark/region:ark+cn-beijing/model/detail?Id=doubao-seed-1-6
 */
export const openai = new OpenAI({
  apiKey: "781ffd2a-1d82-46d7-96cf-f0709a6ccf9d",
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});