import { registerDecorator, ValidationArguments } from 'class-validator';

export function IsLength(property: number) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'IsLength',
      target: target.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: (args: ValidationArguments) => {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must be exactly ${relatedPropertyName} characters long`;
        },
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return (
            (typeof value === 'string' || Array.isArray(value)) &&
            value.length === relatedPropertyName
          );
        },
      },
    });
  };
}
