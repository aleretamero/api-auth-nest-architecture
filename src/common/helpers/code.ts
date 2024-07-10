import { Objects } from '@/common/helpers/objects';
import { Random } from '@/common/helpers/random';
import { Shuffle } from '@/common/helpers/shuffle';

export namespace Code {
  export type GenerateOptions = {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    numbers: boolean;
    hasSpecialCharacters: boolean;
  };

  export type GenerateParams = number | GenerateOptions;
}

export abstract class Code {
  private static readonly DEFAULT_OPTIONS: Code.GenerateOptions = {
    length: 4,
    numbers: true,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialCharacters: false,
  } as const;

  private static getOptions(
    options?: Partial<Code.GenerateParams>,
  ): Code.GenerateOptions {
    const opts = { ...Code.DEFAULT_OPTIONS };

    if (typeof options === 'number') {
      opts.length = options;
    }

    if (typeof options === 'object') {
      Objects.merge(opts, options);
    }

    return opts;
  }

  public static generate(options?: Partial<Code.GenerateParams>): string {
    const opts = Code.getOptions(options);

    let length = opts.length;
    let code = '';

    for (let i = 0; i < opts.length; i++) {
      if (opts.numbers) {
        code += Random.generateNumberCharacter();
        length--;

        if (length === 0) break;
      }

      if (opts.hasUppercase) {
        code += Random.generateUppercaseCharacter();
        length--;

        if (length === 0) break;
      }

      if (opts.hasLowercase) {
        code += Random.generateLowercaseCharacter();
        length--;

        if (length === 0) break;
      }

      if (opts.hasSpecialCharacters) {
        code += Random.generateSpecialCharacter();
        length--;

        if (length === 0) break;
      }
    }

    return Shuffle.string(code);
  }
}
