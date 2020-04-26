import BotometerError from "./BotometerError";
import TwitterError from "./TwitterError";
import * as Twitter from "twitter";
import * as request from "superagent";

export interface BotometerOptions {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  rapidApiKey: string;
  supressLogs?: boolean;
}

interface TwitterData {
  user?: any;
  timeline?: any;
  mentions?: any;
}

const defaultValues: BotometerOptions = {
  consumerKey: null,
  consumerSecret: null,
  accessToken: null,
  accessTokenSecret: null,
  rapidApiKey: null,
  supressLogs: true,
};

export class Botometer {
  options: BotometerOptions;
  twitter: Twitter;

  constructor(_options: BotometerOptions = defaultValues) {
    const options = Object.assign({}, defaultValues, _options);
    if (
      !options.consumerKey ||
      !options.consumerSecret ||
      !options.accessToken ||
      !options.accessTokenSecret ||
      !options.rapidApiKey
    ) {
      throw new BotometerError(
        1,
        'Required credentials options are missing.\nThe required credentials options are "consumerKey", "consumerKeySecret", "accessToken", "accessTokenSecret" and "rapidApiKey".'
      );
    }

    this.options = options;

    this.twitter = new Twitter({
      consumer_key: this.options.consumerKey,
      consumer_secret: this.options.consumerSecret,
      access_token_key: this.options.accessToken,
      access_token_secret: this.options.accessTokenSecret,
    });
  }

  log(message?: any, ...args: any[]) {
    if (!this.options.supressLogs) console.log(message, ...args);
  }

  errorLog(message?: any, ...args: any[]) {
    if (!this.options.supressLogs) console.error(message, ...args);
  }

  parseTwitterApiError(e: any) {
    let errorMessage = "Unknown error";
    let code = 3;
    if (e.length && e.length > 0) {
      const firstError = e[0];
      errorMessage = firstError.message;
      code = firstError.code;
    }
    return { code, errorMessage };
  }

  async getTwitterData(name: string) {
    try {
      const twitterData: TwitterData = {};
      const timeline = await this.twitter.get("statuses/user_timeline", {
        screen_name: name,
        count: 100,
      });
      twitterData.user = timeline[0].user;
      twitterData.timeline = timeline;

      const mentions = await this.twitter.get("search/tweets", {
        q: name,
        count: 100,
      });
      twitterData.mentions = mentions;
      // console.log("Twitter data");
      // console.log(twitterData);
      return twitterData;
    } catch (e) {
      const { code, errorMessage } = this.parseTwitterApiError(e);
      this.errorLog(e);
      throw new TwitterError(code, errorMessage);
    }
  }

  parseBotometerApiError(e: any) {
    let errorMessage = "Unknown error";
    let code = 2;
    try {
      if (e.response && e.response.error) {
        const error = e.response.error;
        code = error.status;
        errorMessage = error.message;
        if (error.text) {
          const errorBody = JSON.parse(error.text);
          errorMessage = errorBody.message || errorMessage;
        }
      }
    } catch (e) {}
    return { code, errorMessage };
  }

  async checkAccount(twitterData: TwitterData) {
    try {
      const res = await request
        .post("https://osome-botometer.p.rapidapi.com/2/check_account")
        .send(twitterData)
        .set("x-rapidapi-host", "osome-botometer.p.rapidapi.com")
        .set("x-rapidapi-key", this.options.rapidApiKey)
        .set("content-type", "application/json")
        .set("accept", "application/json");
      return res.body;
    } catch (e) {
      const { code, errorMessage } = this.parseBotometerApiError(e);
      this.errorLog(e);
      throw new BotometerError(code, errorMessage);
    }
  }

  async getScoreFor(name: string): Promise<any> {
    try {
      const twitterData = await this.getTwitterData(name);

      if (!twitterData) {
        return null;
      }

      const botometerData = await this.checkAccount(twitterData);
      return botometerData;
    } catch (e) {
      this.errorLog(e);
      return null;
    }
  }

  async getScores(names: string[]) {
    const scores = [];
    for (const name of names) {
      this.log(`Getting bot score for "${name}"`);

      const result = await this.getScoreFor(name);
      scores.push(result);
    }
    return scores;
  }

  async getScore(name: string) {
    const result = await this.getScoreFor(name);
    return result;
  }

  async *getScoresGenerator(names: string[]) {
    for (const name of names) {
      this.log(`Getting bot score for "${name}"`);

      const result = await this.getScoreFor(name);
      yield result;
    }
  }
}
