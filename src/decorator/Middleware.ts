import { getMetadataArgsStorage } from '../index';
import { Callable } from '../types/Types';

/**
 * Marks given class as a middleware.
 * Allows to create global middlewares and control order of middleware execution.
 */
export function Middleware(options: { type: 'after' | 'before'; priority?: number }): Callable {
  return function (target: any) {
    getMetadataArgsStorage().middlewares.push({
      target: target,
      type: options && options.type ? options.type : 'before',
      global: true,
      priority: options && options.priority !== undefined ? options.priority : 0,
    });
  };
}
