// apps/ai-gateway/src/routes/portfolio-analysis.ts


import { Router } from 'express';
import { z } from 'zod';

import { aiController } from '../controllers/aiController';
import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks/types-only';

/* =========================================================
   ROUTER
   ========================================================= */

export const portfolioAnalysisRoutes = Router();

/* =========================================================
   SCHEMA
   ========================================================= */

const toOptionalChainId = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((val) => {
    if (val === null || val === undefined) return undefined;
    return typeof val === 'string' ? parseInt(val, 10) || undefined : val;
  });

const toChainIdDefault1 = z
  .union([z.number(), z.string(), z.null()])
  .transform((val) => {
    if (val === null || val === undefined) return 1;
    return typeof val === 'string' ? parseInt(val, 10) || 1 : val;
  });

const nullToUndefinedNumber = z
  .number()
  .nullable()
  .optional()
  .transform((val) => (val === null ? undefined : val));

const portfolioAnalysisSchema = z.object({
  portfolioData: z.object({
    address: z.string(),

    portfolio: z
      .object({
        positions_distribution_by_type: z.object({
          wallet: z.number(),
          deposited: z.number(),
          borrowed: z.number(),
          locked: z.number(),
          staked: z.number(),
        }),
        positions_distribution_by_chain: z.record(z.string(), z.number()),
        total: z.object({
          positions: z.number(),
        }),
        changes: z.object({
          absolute_1d: z.number(),
          percent_1d: z.number(),
        }),
      })
      .optional(),

    tokens: z.array(
      z.object({
        id: z.string(),
        symbol: z.string(),
        name: z.string(),
        balance: z.string(),
        value: z.number(),
        price: z.number(),
        priceChange24h: z.number(),
        logo: z.string().optional(),
        chainId: toOptionalChainId,
      })
    ),

    nfts: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        previewImage: z.string().optional(),
        collection: z.string(),
        chainId: toChainIdDefault1,
        value: nullToUndefinedNumber,
        price: nullToUndefinedNumber,
        contractAddress: z.string().optional(),
        tokenId: z.string().optional(),
        interface: z.string().optional(),
      })
    ),

    defiPositions: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        tokenName: z.string(),
        tokenSymbol: z.string(),
        protocol: z.string(),
        type: z.string(),
        chainId: toChainIdDefault1,
        value: z.number(),
        price: z.number(),
        apy: nullToUndefinedNumber,
        poolAddress: z.string().optional(),
        priceChange24h: nullToUndefinedNumber,
      })
    ),

    recentTransactions: z.array(
      z.object({
        id: z.string(),
        hash: z.string(),
        operation_type: z.string(),
        mined_at: z.union([z.number(), z.string()]), // timestamp OR ISO
        sent_from: z.string(),
        sent_to: z.string(),
        fee: z.number(),
        transfers: z.array(
          z.object({
            fungible_info: z
              .object({
                name: z.string(),
                symbol: z.string(),
                icon: z
                  .object({
                    url: z.string(),
                  })
                  .nullable()
                  .optional()
                  .transform((val) => (val === null ? undefined : val)),
              })
              .optional(),
            quantity: z.string(),
            value: nullToUndefinedNumber,
            price: nullToUndefinedNumber,
          })
        ),
      })
    ),
  }),
});

/* =========================================================
   ROUTE
   ========================================================= */

portfolioAnalysisRoutes.post('/', async (req, res, next) => {
  try {
    const validated = portfolioAnalysisSchema.parse(req.body);

    // ✅ Build ContextPortfolioData exactly as expected by the project
    const portfolioData: ContextPortfolioData = {
      address: validated.portfolioData.address,
      portfolio: validated.portfolioData.portfolio ?? undefined,
      tokens: validated.portfolioData.tokens,
      nfts: validated.portfolioData.nfts,
      defiPositions: validated.portfolioData.defiPositions,
      recentTransactions: validated.portfolioData.recentTransactions.map((tx) => ({
        id: tx.id,
        hash: tx.hash,
        operation_type: tx.operation_type,
        mined_at:
          typeof tx.mined_at === 'number' ? tx.mined_at : new Date(tx.mined_at).getTime(),
        sent_from: tx.sent_from,
        sent_to: tx.sent_to,
        fee: tx.fee,
        transfers: tx.transfers
          .filter((t) => t.fungible_info)
          .map((t) => ({
            fungible_info: {
              name: t.fungible_info!.name,
              symbol: t.fungible_info!.symbol,
              icon: t.fungible_info!.icon,
            },
            quantity: t.quantity,
            value: t.value,
            price: t.price,
          })),
      })),
    };

    // ✅ FIX: analyzePortfolio NO existe. Esto sí existe:
    const insights = aiController.insights(portfolioData);

    res.json({ insights });
  } catch (error) {
    next(error);
  }
});