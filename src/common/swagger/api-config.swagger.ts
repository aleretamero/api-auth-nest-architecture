import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse as SwaggerApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiError } from '@/common/swagger/api-response-error.swagger';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

type StatusCode = 400 | 401 | 403 | 404 | 500;
type ApiResponseOptions = {
  status?: StatusCode | StatusCode[];
  isPublic?: boolean;
};

export function ApiResponse(options?: ApiResponseOptions) {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const decorators: any[] = [];

    // TODO: not working
    // const isPublicClass = Reflect.getMetadata(
    //   IS_PUBLIC_KEY,
    //   target.constructor,
    // );

    const isPublicMethod =
      Reflect.getMetadata(IS_PUBLIC_KEY, descriptor?.value) ?? false;

    options = !!options ? options : {};
    options.isPublic =
      options.isPublic !== undefined ? options.isPublic : isPublicMethod;

    if (!options.isPublic) {
      decorators.push(ApiBearerAuth());
    }

    if (!Array.isArray(options.status)) {
      options.status = !!options.status ? [options.status] : [];
    }

    options.status.push(500);

    Array.from(new Set(options.status)).forEach((statusCode) => {
      decorators.push(
        SwaggerApiResponse({
          status: statusCode,
          type: ApiError,
        }),
      );
    });

    applyDecorators(...decorators)(target, key, descriptor);
  };
}

// export const AccessPublicMetadata = (target: any, key?: string | symbol) => {
//   const isPublic = Reflect.getMetadata('isPublic', target[key] ?? target);
//   console.log(
//     `Metadata for ${key ? 'method' : 'class'} ${key || target.name}: ${isPublic}`,
//   );
// };

// // Method decorator
// export const LogMethodMetadata =
//   () => (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
//     AccessPublicMetadata(target, key);
//   };

// // Class decorator
// export const LogClassMetadata = () => (target: any) => {
//   AccessPublicMetadata(target);
// };

// export function ApiConfig(options?: ApiResponseOptions) {
//   const decorators: any[] = [];
//   options = options ?? DEFAULT_OPTIONS;

//   if (!options.isPublic) {
//     decorators.push(ApiBearerAuth());
//   }

//   if (!Array.isArray(options.status)) {
//     options.status = !!options.status ? [options.status] : [];
//   }

//   Array.from(new Set([...options.status, ...DEFAULT_STATUS_CODES])).forEach(
//     (statusCode) => {
//       decorators.push(
//         ApiResponse({
//           status: statusCode,
//           type: ApiError,
//         }),
//       );
//     },
//   );

//   return applyDecorators(...decorators);
// }

// @Injectable({ scope: Scope.DEFAULT })
// export class ApiConfig {
//   static reflector: Reflector;

//   // constructor(reflector: Reflector) {
//   //   console.log('ApiConfig.reflector', reflector);
//   //   ApiConfig.reflector = reflector;

//   //   console.log('ApiConfig.reflector', !!ApiConfig.reflector, Date.now());
//   // }

//   static apply(options?: ApiResponseOptions) {
//     return (
//       target: any,
//       key?: string | symbol,
//       descriptor?: TypedPropertyDescriptor<any>,
//     ) => {
//       const decorators: any[] = [];
//       options = options ?? DEFAULT_OPTIONS;

//       const reflector = new Reflector();

//       console.log('ApiConfig.reflector', reflector, Date.now());

//       console.log('ApiConfig.reflector', ApiConfig.reflector, Date.now());

//       const isClassPublic = reflector.getAllAndOverride<boolean>(
//         IS_PUBLIC_KEY,
//         [target.constructor],
//       );

//       console.log('isClassPublic', isClassPublic);
//       // const isMethodPublic = key
//       //   ? ApiConfig.reflector.get<boolean>(IS_PUBLIC_KEY, descriptor?.value)
//       //   : false;

//       // console.log('isClassPublic', isClassPublic);
//       // console.log('isMethodPublic', isMethodPublic);

//       if (!options.isPublic) {
//         decorators.push(ApiBearerAuth());
//       }

//       if (!Array.isArray(options.status)) {
//         options.status = !!options.status ? [options.status] : [];
//       }

//       Array.from(new Set([...options.status, ...DEFAULT_STATUS_CODES])).forEach(
//         (statusCode) => {
//           decorators.push(
//             ApiResponse({
//               status: statusCode,
//               type: ApiError,
//             }),
//           );
//         },
//       );

//       applyDecorators(...decorators);

//       return descriptor;
//     };
//   }
// }
