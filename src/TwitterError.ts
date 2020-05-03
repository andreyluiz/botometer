export default class TwitterError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = `TwitterError [${code}]`;
  }
}
