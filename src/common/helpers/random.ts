export class Random {
  public static generateNumber(min: number = 0, max: number = 100): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    if (min > max) throw new Error('min must be less than or equal to max');

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static generateNumberCharacter(): string {
    return String.fromCharCode(Random.generateNumber(48, 57));
  }

  public static generateUppercaseCharacter(): string {
    return String.fromCharCode(Random.generateNumber(65, 90));
  }

  public static generateLowercaseCharacter(): string {
    return String.fromCharCode(Random.generateNumber(97, 122));
  }

  public static generateSpecialCharacter(): string {
    return [
      String.fromCharCode(Random.generateNumber(33, 47)),
      String.fromCharCode(Random.generateNumber(58, 64)),
      String.fromCharCode(Random.generateNumber(91, 96)),
      String.fromCharCode(Random.generateNumber(123, 126)),
    ][Random.generateNumber(0, 3)];
  }
}
