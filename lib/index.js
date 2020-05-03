"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var BotometerError_1 = require("./BotometerError");
var TwitterError_1 = require("./TwitterError");
var Twitter = require("twitter");
var request = require("superagent");
var FIFTEEN_MINUTES = 1000 * 60 * 15;
var delay = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};
var defaultValues = {
    consumerKey: null,
    consumerSecret: null,
    accessToken: null,
    accessTokenSecret: null,
    rapidApiKey: null,
    supressLogs: true,
    usePro: false,
    waitOnRateLimit: true
};
var Botometer = (function () {
    function Botometer(_options) {
        if (_options === void 0) { _options = defaultValues; }
        var options = Object.assign({}, defaultValues, _options);
        if (!options.consumerKey ||
            !options.consumerSecret ||
            !options.accessToken ||
            !options.accessTokenSecret ||
            !options.rapidApiKey) {
            throw new BotometerError_1["default"](1, 'Required credentials options are missing.\nThe required credentials options are "consumerKey", "consumerKeySecret", "accessToken", "accessTokenSecret" and "rapidApiKey".');
        }
        this.options = options;
        this.twitter = new Twitter({
            consumer_key: this.options.consumerKey,
            consumer_secret: this.options.consumerSecret,
            access_token_key: this.options.accessToken,
            access_token_secret: this.options.accessTokenSecret
        });
    }
    Botometer.prototype.log = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.options.supressLogs)
            console.log.apply(console, __spreadArrays([message], args));
    };
    Botometer.prototype.errorLog = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.options.supressLogs)
            console.error.apply(console, __spreadArrays([message], args));
    };
    Botometer.prototype.parseTwitterApiError = function (e) {
        var errorMessage = "Unknown error";
        var code = 3;
        if (e.length && e.length > 0) {
            var firstError = e[0];
            errorMessage = firstError.message;
            code = firstError.code;
        }
        return { code: code, errorMessage: errorMessage };
    };
    Botometer.prototype.getTwitterData = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var twitterData, timeline, mentions, e_1, _a, code, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        twitterData = {};
                        return [4, this.twitter.get("statuses/user_timeline", {
                                screen_name: name,
                                count: 100
                            })];
                    case 1:
                        timeline = _b.sent();
                        twitterData.user = timeline[0].user;
                        twitterData.timeline = timeline;
                        return [4, this.twitter.get("search/tweets", {
                                q: name,
                                count: 100
                            })];
                    case 2:
                        mentions = _b.sent();
                        twitterData.mentions = mentions;
                        return [2, twitterData];
                    case 3:
                        e_1 = _b.sent();
                        _a = this.parseTwitterApiError(e_1), code = _a.code, errorMessage = _a.errorMessage;
                        this.errorLog(e_1);
                        throw new TwitterError_1["default"](code, errorMessage);
                    case 4: return [2];
                }
            });
        });
    };
    Botometer.prototype.parseBotometerApiError = function (e) {
        var errorMessage = "Unknown error";
        var code = 2;
        try {
            if (e.response && e.response.error) {
                var error = e.response.error;
                code = error.status;
                errorMessage = error.message;
                if (error.text) {
                    var errorBody = JSON.parse(error.text);
                    errorMessage = errorBody.message || errorMessage;
                }
            }
        }
        catch (e) { }
        return { code: code, errorMessage: errorMessage };
    };
    Botometer.prototype.checkAccount = function (twitterData) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, res, e_2, _a, code, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        endpoint = this.options.usePro
                            ? "botometer-pro.p.rapidapi.com"
                            : "osome-botometer.p.rapidapi.com";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, request
                                .post("https://" + endpoint + "/2/check_account")
                                .send(twitterData)
                                .set("x-rapidapi-host", endpoint)
                                .set("x-rapidapi-key", this.options.rapidApiKey)
                                .set("content-type", "application/json")
                                .set("accept", "application/json")];
                    case 2:
                        res = _b.sent();
                        return [2, res.body];
                    case 3:
                        e_2 = _b.sent();
                        _a = this.parseBotometerApiError(e_2), code = _a.code, errorMessage = _a.errorMessage;
                        this.errorLog(e_2);
                        throw new BotometerError_1["default"](code, errorMessage);
                    case 4: return [2];
                }
            });
        });
    };
    Botometer.prototype.getScoreFor = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var twitterData, e_3, e_4, botometerData, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log("Getting bot score for \"" + name + "\"");
                        twitterData = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 11]);
                        return [4, this.getTwitterData(name)];
                    case 2:
                        twitterData = _a.sent();
                        return [3, 11];
                    case 3:
                        e_3 = _a.sent();
                        if (!(e_3.code === 88 && this.options.waitOnRateLimit)) return [3, 9];
                        this.log("Rate limit reached. Waiting 15 minutes...");
                        return [4, delay(FIFTEEN_MINUTES)];
                    case 4:
                        _a.sent();
                        this.log("Rate limit timeout ended. Continuing...");
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4, this.getTwitterData(name)];
                    case 6:
                        twitterData = _a.sent();
                        return [3, 8];
                    case 7:
                        e_4 = _a.sent();
                        this.errorLog(e_4);
                        return [3, 8];
                    case 8: return [3, 10];
                    case 9:
                        this.errorLog(e_3);
                        _a.label = 10;
                    case 10: return [3, 11];
                    case 11:
                        if (!twitterData) {
                            return [2, null];
                        }
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 14, , 15]);
                        return [4, this.checkAccount(twitterData)];
                    case 13:
                        botometerData = _a.sent();
                        return [2, botometerData];
                    case 14:
                        e_5 = _a.sent();
                        this.errorLog(e_5);
                        return [2, null];
                    case 15: return [2];
                }
            });
        });
    };
    Botometer.prototype.getScores = function (names) {
        return __awaiter(this, void 0, void 0, function () {
            var scores, _i, names_1, name_1, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scores = [];
                        _i = 0, names_1 = names;
                        _a.label = 1;
                    case 1:
                        if (!(_i < names_1.length)) return [3, 4];
                        name_1 = names_1[_i];
                        return [4, this.getScoreFor(name_1)];
                    case 2:
                        result = _a.sent();
                        scores.push(result);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, scores];
                }
            });
        });
    };
    Botometer.prototype.getScore = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getScoreFor(name)];
                    case 1:
                        result = _a.sent();
                        return [2, result];
                }
            });
        });
    };
    Botometer.prototype.getScoresGenerator = function (names) {
        return __asyncGenerator(this, arguments, function getScoresGenerator_1() {
            var _i, names_2, name_2, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, names_2 = names;
                        _a.label = 1;
                    case 1:
                        if (!(_i < names_2.length)) return [3, 6];
                        name_2 = names_2[_i];
                        return [4, __await(this.getScoreFor(name_2))];
                    case 2:
                        result = _a.sent();
                        return [4, __await(result)];
                    case 3: return [4, _a.sent()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3, 1];
                    case 6: return [2];
                }
            });
        });
    };
    return Botometer;
}());
exports.Botometer = Botometer;
