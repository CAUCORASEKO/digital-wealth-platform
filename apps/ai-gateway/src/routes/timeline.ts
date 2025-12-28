import { Router } from 'express';
import { z } from 'zod';
import { aiController } from '../controllers/aiController';
import type { ContextPortfolioData } from
  '@web3-ai-copilot/data-hooks/types-only';

const router = Router();

const timelineSchema = z.object({
  portfolioData: z.custom<ContextPortfolioData>(),
});

router.post('/', async (req, res, next) => {
  try {
    const { portfolioData } = timelineSchema.parse(req.body);
    const events = await aiController.timeline(portfolioData);
    res.json(events);
  } catch (error) {
    next(error);
  }
});

export default router;