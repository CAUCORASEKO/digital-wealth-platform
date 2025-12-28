import { Router } from 'express';
import { z } from 'zod';
import { aiController } from '../controllers/aiController';
import type { ContextPortfolioData } from
  '@web3-ai-copilot/data-hooks/types-only';

const router = Router();

const insightsSchema = z.object({
  portfolioData: z.custom<ContextPortfolioData>(),
});

router.post('/', async (req, res, next) => {
  try {
    const { portfolioData } = insightsSchema.parse(req.body);

    const insights = await aiController.insights(portfolioData);

    res.json(insights);
  } catch (error) {
    next(error);
  }
});

export default router;