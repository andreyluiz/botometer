import BotometerError from "./BotometerError";

interface TwitterOptions {
  rateLimit: number;
  user: boolean;
  timeline: boolean;
  mentions: boolean;
}

interface BotometerOptions {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  mashapeKey: string;
  twitterOptions: TwitterOptions;
}

const defaultValues: BotometerOptions = {
  consumerKey: null,
  consumerSecret: null,
  accessToken: null,
  accessTokenSecret: null,
  mashapeKey: null,
  twitterOptions: {
    rateLimit: 0,
    user: true,
    timeline: false,
    mentions: false,
  },
};

export class Botometer {
  constructor(options: BotometerOptions = defaultValues) {
    if (
      !options.consumerKey ||
      !options.consumerSecret ||
      !options.accessToken ||
      !options.accessTokenSecret ||
      !options.mashapeKey
    ) {
      throw new BotometerError(
        1,
        'Required credentials options are missing.\nThe required credentials options are "consumerKey", "consumerKeySecret", "accessToken", "accessTokenSecret" and "mashapeKey".'
      );
    }
  }
}
