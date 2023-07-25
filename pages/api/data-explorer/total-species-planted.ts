import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../src/utils/connectDB';
import nc from 'next-connect';
import {
  rateLimiter,
  speedLimiter,
} from '../../../src/middlewares/rate-limiter';
import NodeCache from 'node-cache';
import { getCachedKey } from '../../../src/utils/getCachedKey';
import { TotalSpeciesPlanted } from '../../../src/features/common/types/dataExplorer';

const ONE_HOUR_IN_SEC = 60 * 60;
const ONE_DAY = ONE_HOUR_IN_SEC * 24;

const cache = new NodeCache({ stdTTL: ONE_DAY, checkperiod: ONE_HOUR_IN_SEC });

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(rateLimiter);
handler.use(speedLimiter);

handler.post(async (req, response) => {
  const { projectId, startDate, endDate } = req.body;

  const CACHE_KEY = `TOTAL_SPECIES_PLANTED__${getCachedKey(
    projectId,
    startDate,
    endDate
  )}`;

  const cacheHit = cache.get(CACHE_KEY);

  if (cacheHit) {
    response.status(200).json({ data: cacheHit });
    return;
  }

  try {
    const query =
      "SELECT \
            COUNT(DISTINCT COALESCE(ss.name, CASE WHEN ps.other_species='Unknown' THEN null ELSE ps.other_species END, \
            CASE WHEN pl.other_species='Unknown' THEN null ELSE pl.other_species END)) as totalSpeciesPlanted \
            FROM planted_species ps \
        INNER JOIN plant_location pl ON ps.plant_location_id = pl.id \
        LEFT JOIN scientific_species ss ON ps.scientific_species_id = ss.id \
        JOIN project pp ON pl.plant_project_id = pp.id \
        WHERE pp.guid = ? AND pl.plant_date BETWEEN ? AND ?";

    const res = await db.query<TotalSpeciesPlanted[]>(query, [
      projectId,
      startDate,
      `${endDate} 23:59:59.999`,
    ]);

    await db.end();

    cache.set(CACHE_KEY, res[0]);
    response.status(200).json({ data: res[0] });
  } catch (err) {
    console.log(err);
  } finally {
    await db.quit();
  }
});

export default handler;
