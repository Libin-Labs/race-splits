import { planSplits } from '@lp-labs/race-splits';
const splits = planSplits(2.5, 750);
if (splits.length !== 3 || splits[2].segmentSeconds !== 150) throw new Error('Splits');
// @ts-expect-error invalid argument must be rejected by declarations
planSplits(5, '1500');
