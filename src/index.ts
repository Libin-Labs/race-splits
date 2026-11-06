function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
export interface RaceSplit {
  index: number;
  distanceKm: number;
  elapsedSeconds: number;
  segmentSeconds: number;
}
export function planSplits(distanceKm: number, totalSeconds: number, splitKm = 1): RaceSplit[] {
  finite(distanceKm, Number.MIN_VALUE, 1e9);
  finite(totalSeconds, Number.MIN_VALUE, 1e9);
  finite(splitKm, Number.MIN_VALUE, 1e9);
  const count = integer(Math.ceil(distanceKm / splitKm), 1, 10000),
    out: RaceSplit[] = [];
  let prev = 0;
  for (let i = 0; i < count; i++) {
    const distance = i === count - 1 ? distanceKm : Math.min(distanceKm, (i + 1) * splitKm),
      elapsed =
        i === count - 1
          ? totalSeconds
          : finite(totalSeconds * (distance / distanceKm), 0, totalSeconds);
    if (distance <= i * splitKm || elapsed <= prev)
      throw new RangeError('Split interval is below numerical resolution');
    out.push({
      index: i + 1,
      distanceKm: distance - i * splitKm,
      elapsedSeconds: elapsed,
      segmentSeconds: elapsed - prev,
    });
    prev = elapsed;
  }
  return out;
}
export function splitVariance(
  actualSeconds: readonly number[],
  targetSeconds: readonly number[],
): { deltas: number[]; totalDelta: number } {
  if (
    !Array.isArray(actualSeconds) ||
    !Array.isArray(targetSeconds) ||
    !actualSeconds.length ||
    actualSeconds.length !== targetSeconds.length ||
    actualSeconds.length > 10000
  )
    throw new RangeError('Matching split lengths required');
  const deltas: number[] = [];
  for (let i = 0; i < actualSeconds.length; i++)
    deltas.push(
      finite(actualSeconds[i]!, Number.MIN_VALUE, 1e9) -
        finite(targetSeconds[i]!, Number.MIN_VALUE, 1e9),
    );
  return { deltas, totalDelta: deltas.reduce((a, b) => a + b, 0) };
}
