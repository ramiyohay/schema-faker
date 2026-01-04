export class Random {
  private seed: number;

  constructor(seed = Date.now()) {
    this.seed = seed;
  }

  private next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  int(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  bool() {
    return this.next() > 0.5;
  }

  string(length: number) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    return Array.from(
      { length },
      () => chars[this.int(0, chars.length - 1)]
    ).join("");
  }
}
