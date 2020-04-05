export default class BotometerError extends Error {
  constructor(code: number, message: string) {
    super(message);
    this.name = `BotometerError [${code}]`;
  }
}
