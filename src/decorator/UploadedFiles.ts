import {UploadOptions} from '../decorator-options/UploadOptions';
import {getMetadataArgsStorage} from '../index';

/**
 * Injects all uploaded files to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function UploadedFiles(name: string, options?: UploadOptions): Function {
    return function(object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: 'files',
            object,
            method: methodName,
            index,
            name,
            parse: false,
            required: options ? options.required : undefined,
            extraOptions: options ? options.options : undefined,
        });
    };
}
