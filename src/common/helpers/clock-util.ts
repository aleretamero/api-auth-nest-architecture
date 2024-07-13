export namespace ClockUtil {
  export type OffsetUnit = 's' | 'm' | 'h' | 'd';
  export type OffsetString = `${number}${OffsetUnit}`;
  export type Offset = number | OffsetString;
}

export abstract class ClockUtil {
  static getNow(): Date {
    return new Date();
  }

  static getMilliseconds(offset: ClockUtil.OffsetString): number {
    const match = offset.match(/(\d+)([smhd])/);

    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      switch (unit) {
        case 's':
          return value * 1000;

        case 'm':
          return value * 60 * 1000;

        case 'h':
          return value * 60 * 60 * 1000;

        case 'd':
          return value * 24 * 60 * 60 * 1000;

        default:
          throw new Error(
            'Invalid offset format. Use formats like "1d", "2h", "30m", "15s", etc.',
          );
      }
    } else {
      throw new Error(
        'Invalid offset format. Use formats like "1d", "2h", "30m", "15s", etc.',
      );
    }
  }

  static getSeconds(offset: ClockUtil.OffsetString): number {
    return ClockUtil.getMilliseconds(offset) / 1000;
  }

  static getTimestamp(offset?: ClockUtil.Offset): number {
    let timestamp = new Date().getTime();

    if (offset !== undefined) {
      if (typeof offset === 'number') {
        timestamp += offset;
      }

      if (typeof offset === 'string') {
        timestamp += ClockUtil.getMilliseconds(offset);
      }
    }

    return timestamp;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static format(format?: string): string {
    return new Date().toISOString();
  }
}
