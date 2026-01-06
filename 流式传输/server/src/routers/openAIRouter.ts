import { Router } from 'express';
import { getTextAIRes, getTextAIResStream } from '../controllers/doubaoController';

export const openAIdRouter = Router();

openAIdRouter.post('/unStream', getTextAIRes);

openAIdRouter.post('/stream', getTextAIResStream);
