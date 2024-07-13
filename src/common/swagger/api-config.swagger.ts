import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiResponseOptions,
  ApiTags,
  ApiHeaders,
  ApiBodyOptions,
  ApiHeaderOptions,
  ApiOperationOptions,
  ApiBody,
  ApiOperation,
  ApiConsumes,
  ApiHeader,
} from '@nestjs/swagger';
import { ApiError } from '@/common/swagger/api-response-error.swagger';

type ApiDocsOptions = {
  tags?: string | string[];
  options?: ApiOperationOptions;
  consumes?: string | string[];
  headers?: ApiHeaderOptions[];
  body?: ApiBodyOptions;
  isPublic?: boolean;
  deviceIdentifier?: boolean;
  acceptLanguage?: boolean;
  response?: (ApiResponseOptions | number)[];
};

export function ApiDocs(options?: ApiDocsOptions) {
  const decorators: (MethodDecorator | ClassDecorator)[] = [];

  if (options?.tags) {
    decorators.push(
      ApiTags(...(Array.isArray(options.tags) ? options.tags : [options.tags])),
    );
  }

  if (options?.options) {
    decorators.push(ApiOperation(options.options));
  }

  if (options?.consumes) {
    decorators.push(
      ApiConsumes(...(Array.isArray(options.consumes) ? options.consumes : [options.consumes])), // prettier-ignore
    );
  }

  if (options?.headers) {
    decorators.push(ApiHeaders(options.headers));
  }

  if (options?.body) {
    decorators.push(ApiBody(options.body));
  }

  if (options?.isPublic === undefined || !options?.isPublic) {
    decorators.push(ApiBearerAuth());
  }

  if (options?.deviceIdentifier === undefined || options?.deviceIdentifier) {
    decorators.push(ApiHeader({ name: 'X-Device-Identifier', required: true }));
  }

  if (options?.acceptLanguage) {
    decorators.push(
      ApiHeader({ name: 'Accept-Language', required: false, enum: ['en'] }),
    );
  }

  if (!options?.response) {
    options = { response: [500] };
  } else {
    options.response.push(500);
  }

  for (const response of Array.from(new Set(options.response))) {
    if (typeof response === 'number') {
      decorators.push(ApiResponse({ status: response, type: ApiError }));
    } else {
      decorators.push(ApiResponse(response));
    }
  }

  return applyDecorators(...decorators);
}
