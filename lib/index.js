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
var defaultValues = {
    consumerKey: null,
    consumerSecret: null,
    accessToken: null,
    accessTokenSecret: null,
    rapidApiKey: null,
    supressLogs: true
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
            var res, e_2, _a, code, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4, request
                                .post("https://osome-botometer.p.rapidapi.com/2/check_account")
                                .send(twitterData)
                                .set("x-rapidapi-host", "osome-botometer.p.rapidapi.com")
                                .set("x-rapidapi-key", this.options.rapidApiKey)
                                .set("content-type", "application/json")
                                .set("accept", "application/json")];
                    case 1:
                        res = _b.sent();
                        return [2, res.body];
                    case 2:
                        e_2 = _b.sent();
                        _a = this.parseBotometerApiError(e_2), code = _a.code, errorMessage = _a.errorMessage;
                        throw new BotometerError_1["default"](code, errorMessage);
                    case 3: return [2];
                }
            });
        });
    };
    Botometer.prototype.getScoreFor = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var twitterData, botometerData, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.getTwitterData(name)];
                    case 1:
                        twitterData = _a.sent();
                        if (!twitterData) {
                            return [2, null];
                        }
                        return [4, this.checkAccount(twitterData)];
                    case 2:
                        botometerData = _a.sent();
                        return [2, botometerData];
                    case 3:
                        e_3 = _a.sent();
                        this.errorLog(e_3);
                        return [2, null];
                    case 4: return [2];
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
                        this.log("Getting bot score for \"" + name_1 + "\"");
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
    return Botometer;
}());
exports.Botometer = Botometer;