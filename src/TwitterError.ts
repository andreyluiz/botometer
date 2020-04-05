export default class TwitterError extends Error {
  constructor(code: number, message: string) {
    super(message);
    this.name = `TwitterError [${code}]`;
  }
}
