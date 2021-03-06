import { Telemetry, UseTelemetryResult } from './types';
import useComposeOptions from '../compose/useComposeOptions';

export const getTelemetry = (displayName: string, telemetry: Telemetry | undefined): UseTelemetryResult => {
  let start: number = -1;
  let end: number = -1;

  const setStart = () => {
    start = telemetry && telemetry.enabled ? performance.now() : -1;
  };

  const setEnd = () => {
    if (telemetry && telemetry.enabled && start !== -1) {
      end = performance.now();
      const duration = end - start;
      if (telemetry.performance[displayName]) {
        telemetry.performance[displayName].count++;
        telemetry.performance[displayName].msTotal += duration;
        telemetry.performance[displayName].msMin = Math.min(duration, telemetry.performance[displayName].msMin);
        telemetry.performance[displayName].msMax = Math.max(duration, telemetry.performance[displayName].msMax);
      } else {
        telemetry.performance[displayName] = {
          count: 1,
          msTotal: duration,
          msMin: duration,
          msMax: duration,
        };
      }
    }
  };

  return { setStart, setEnd };
};

const useTelemetry = (displayName: string, telemetry: Telemetry | undefined): UseTelemetryResult => {
  const composeOptions = useComposeOptions();
  const telemetryName = composeOptions?.displayNames[composeOptions?.displayNames.length - 1] || displayName;

  return getTelemetry(telemetryName, telemetry);
};

export default useTelemetry;
