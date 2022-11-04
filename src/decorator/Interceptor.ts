import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Registers a global interceptor.
 */
export function Interceptor(options?: { priority?: number }): Callable {
  return function (target: Newable | Callable) {
    getMetadataArgsStorage().interceptors.push({
      target: target,
      global: true,
      priority: options && options.priority ? options.priority : 0,
    });
  };
}
