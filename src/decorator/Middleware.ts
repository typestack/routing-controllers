import {getMetadataArgsStorage} from '../index';

/**
 * Marks given class as a middleware.
 * Allows to create global middlewares and control order of middleware execution.
 */
export function Middleware(options: {priority?: number; type: 'after' | 'before'}): Function {
  return function(target: Function) {
    getMetadataArgsStorage().middlewares.push({
      target,
      type: options && options.type ? options.type : 'before',
      global: true,
      priority: options && options.priority !== undefined ? options.priority : 0,
    });
  };
}
