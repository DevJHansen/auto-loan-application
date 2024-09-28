import { TIMEOUT_DURATION } from '../constants/timeout';

export const handleTimeout = (fn: () => void, duration?: number) => {
  const dur = duration ? duration : TIMEOUT_DURATION;
  setTimeout(fn, dur);
};
