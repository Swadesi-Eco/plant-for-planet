import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import { getCachedKey } from '../../../src/utils/getCachedKey';
import { ISpeciesPlanted } from '../../../src/features/common/types/dataExplorer';
import redisClient from '../../../src/redis-client';
import { cacheKeyPrefix } from '../../../src/utils/constants/cacheKeyPrefix';

const ONE_HOUR_IN_SEC = 60 * 60;
const TWO_HOURS = ONE_HOUR_IN_SEC * 2;

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  if (!redisClient) {
    throw new Error(
      'Redis client not initialized. If this is not a Storybook environment, please ensure Redis is properly configured and connected.'
    );
  }

  const { projectId, startDate, endDate } = req.body;

  const CACHE_KEY = `${cacheKeyPrefix}_SPECIES_PLANTED__${getCachedKey(
    projectId,
    startDate,
    endDate
  )}`;

  const cacheHit = await redisClient.get(CACHE_KEY);

  if (cacheHit) {
    return response.status(200).json({ data: cacheHit });
  }

  try {
    const query = `
			SELECT 
					ps.other_species,
					COALESCE(iv.scientific_species_id,
									ps.scientific_species_id) AS scientific_species_id,
					COALESCE(ss.name,
									ps.other_species,
									iv.other_species, 'Unknown') AS name,
					SUM(COALESCE(ps.tree_count, iv.trees_planted, 0)) AS total_tree_count
				FROM intervention iv
				LEFT JOIN planted_species ps ON iv.id = ps.intervention_id
				LEFT JOIN scientific_species ss ON COALESCE(iv.scientific_species_id, ps.scientific_species_id) = ss.id
				JOIN project pp ON iv.plant_project_id = pp.id
				WHERE
						iv.deleted_at IS NULL
						AND iv.type IN ('single-tree-registration', 'multi-tree-registration')
						AND pp.guid = ? 
						AND iv.intervention_start_date BETWEEN ? AND ?
				GROUP BY 
						COALESCE(iv.scientific_species_id, ps.scientific_species_id), 
						COALESCE(ss.name, ps.other_species, iv.other_species, 'Unknown')
				ORDER BY total_tree_count DESC`;

    const res = await db.query<ISpeciesPlanted[]>(query, [
      projectId,
      startDate,
      `${endDate} 23:59:59.999`,
    ]);

    await redisClient.set(CACHE_KEY, JSON.stringify(res), {
      ex: TWO_HOURS,
    });

    response.status(200).json({ data: res });
  } catch (err) {
    console.error('Error fetching species planted:', err);
  } finally {
    await db.quit();
  }
});

export default handler;
