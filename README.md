# @lp-labs/race-splits

Equal-distance pacing splits with exact final remainder handling.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/race-splits
```

## Working example

```js
import { planSplits } from '@lp-labs/race-splits';
const splits = planSplits(2.5, 750);
if (splits.length !== 3 || splits[2].segmentSeconds !== 150) throw new Error('Splits');
```

CommonJS: `const api = require('@lp-labs/race-splits')`.

## Behavior, customization and limits

planSplits(distanceKm,totalSeconds,splitKm=1) generates at most10000 segments with index1-based,distanceKm,elapsedSeconds,segmentSeconds. Distances/times positive finite <=1e9, splitKm positive finite; constant pace, final shorter split ends at exact total time/distance. splitVariance(actualSeconds,targetSeconds) returns per-segment actual-target and totalDelta; equal nonempty lengths<=10000, positive finite times<=1e9. O(segments); no pacing recommendations.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface RaceSplit {
  index: number;
  distanceKm: number;
  elapsedSeconds: number;
  segmentSeconds: number;
}
export declare function planSplits(
  distanceKm: number,
  totalSeconds: number,
  splitKm?: number,
): RaceSplit[];
export declare function splitVariance(
  actualSeconds: readonly number[],
  targetSeconds: readonly number[],
): {
  deltas: number[];
  totalDelta: number;
};
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
