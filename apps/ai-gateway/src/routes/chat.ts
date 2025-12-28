
// apps/ai-gateway/src/routes/chat.ts

import { Router } from 'express';
import { z } from 'zod';
import { aiController } from '../controllers/aiController';
import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks';

export const chatRoutes = Router();

/* ============================================================================
   HELPERS
   ============================================================================ */

const numberOrUndefined = z
  .number()
  .nullable()
  .optional()
  .transform((v) => (v == null ? undefined : v));

const chainIdSchema = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 1;
  });

/* ============================================================================
   ZOD SCHEMA (FRONTEND-SAFE)
   ============================================================================ */

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']), // system ONLY server-side
      content: z.string(),
    })
  ),

  portfolioData: z
    .object({
      address: z.string(),

      portfolio: z
        .object({
          positions_distribution_by_type: z
            .object({
              wallet: z.number(),
              deposited: z.number(),
              borrowed: z.number(),
              locked: z.number(),
              staked: z.number(),
            })
            .optional(),

          positions_distribution_by_chain: z
            .record(z.string(), z.number())
            .optional(),

          total: z
            .object({
              positions: z.number(),
            })
            .optional(),

          changes: z
            .object({
              absolute_1d: numberOrUndefined,
              percent_1d: numberOrUndefined,
            })
            .optional(),
        })
        .optional(),

      tokens: z
        .array(
          z.object({
            id: z.string(),
            symbol: z.string(),
            name: z.string(),
            balance: z.string(),
            value: z.number(),
            price: numberOrUndefined,
            priceChange24h: numberOrUndefined,
            logo: z.string().optional(),
            chainId: chainIdSchema,
          })
        )
        .default([]),

      nfts: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            collection: z.string(),
            chainId: chainIdSchema,
            value: numberOrUndefined,
            price: numberOrUndefined,
            image: z.string().optional(),
          })
        )
        .optional(),

      defiPositions: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            protocol: z.string(),
            type: z.string(),
            value: z.number(),
            price: numberOrUndefined,
            apy: numberOrUndefined,
            chainId: chainIdSchema,
            tokenName: z.string().optional(),
            tokenSymbol: z.string().optional(),
          })
        )
        .optional(),

      recentTransactions: z
        .array(
          z.object({
            id: z.string(),
            hash: z.string(),
            operation_type: z.string(),
            mined_at: z.union([z.number(), z.string()]),
            sent_from: z.string(),
            sent_to: z.string(),
            fee: z.number(),
            transfers: z.array(
              z.object({
                fungible_info: z
                  .object({
                    name: z.string(),
                    symbol: z.string(),
                    icon: z.object({ url: z.string() }).optional(),
                  })
                  .optional(),
                quantity: z.string(),
                value: numberOrUndefined,
                price: numberOrUndefined,
              })
            ),
          })
        )
        .optional(),
    })
    .optional(),

  provider: z.enum(['openai', 'anthropic', 'llama']).optional(),
});

/* ============================================================================
   ROUTE
   ============================================================================ */

chatRoutes.post('/', async (req, res, next) => {
  try {
    const data = chatSchema.parse(req.body);

    let portfolioData: ContextPortfolioData | undefined;

    if (data.portfolioData) {
      const p = data.portfolioData;

      portfolioData = {
        address: p.address,

        portfolio:
          p.portfolio &&
          p.portfolio.positions_distribution_by_type &&
          p.portfolio.positions_distribution_by_chain &&
          p.portfolio.total &&
          p.portfolio.changes?.absolute_1d != null &&
          p.portfolio.changes?.percent_1d != null
            ? {
                positions_distribution_by_type:
                  p.portfolio.positions_distribution_by_type,
                positions_distribution_by_chain:
                  p.portfolio.positions_distribution_by_chain,
                total: p.portfolio.total,
                changes: {
                  absolute_1d: p.portfolio.changes.absolute_1d,
                  percent_1d: p.portfolio.changes.percent_1d,
                },
              }
            : undefined,

        tokens: p.tokens.map((t) => ({
          ...t,
          price: t.price ?? 0,
          priceChange24h: t.priceChange24h ?? 0,
          chainId: t.chainId ?? 1,
        })),

        nfts: p.nfts?.map((n) => ({
          ...n,
          chainId: n.chainId ?? 1,
        })),

        defiPositions: p.defiPositions
          ?.filter(
            (d): d is Required<typeof d> =>
              Boolean(d.tokenName && d.tokenSymbol)
          )
          .map((d) => ({
            id: d.id,
            name: d.name,
            protocol: d.protocol,
            type: d.type,
            value: d.value,
            tokenName: d.tokenName,
            tokenSymbol: d.tokenSymbol,
            chainId: d.chainId ?? 1,
            price: d.price ?? 0,
            apy: d.apy ?? 0,
          })),

        recentTransactions: p.recentTransactions?.map((tx) => ({
          id: tx.id,
          hash: tx.hash,
          operation_type: tx.operation_type,
          mined_at:
            typeof tx.mined_at === 'number'
              ? tx.mined_at
              : new Date(tx.mined_at).getTime(),
          sent_from: tx.sent_from,
          sent_to: tx.sent_to,
          fee: tx.fee,
          transfers: tx.transfers
            .filter(
              (t): t is Required<typeof t> =>
                Boolean(t.fungible_info)
            )
            .map((t) => ({
              fungible_info: {
                name: t.fungible_info.name,
                symbol: t.fungible_info.symbol,
                icon: t.fungible_info.icon,
              },
              quantity: t.quantity,
              value: t.value,
              price: t.price,
            })),
        })),
      };
    }

    const response = await aiController.chat(
      data.messages,
      data.provider,
      portfolioData
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
});