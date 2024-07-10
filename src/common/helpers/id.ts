import { randomUUID } from 'node:crypto';

export abstract class ID {
  public static generate(): string {
    return randomUUID();
  }
}
