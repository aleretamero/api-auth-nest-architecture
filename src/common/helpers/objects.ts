export class Objects {
  static merge<T extends object>(target: T, source: Partial<T>): T {
    const filteredObj = Object.fromEntries(
      Object.entries(source).filter(
        ([key, value]) =>
          value !== undefined && Object.keys(target).includes(key),
      ),
    );

    Object.assign(target, filteredObj);

    return target;
  }
}
