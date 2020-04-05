![Build status](https://github.com/andreyluiz/botometer/workflows/Node.js%20CI/badge.svg)

# Botometer

> A simple and tiny library to get botometer scores.

## Installing

```
npm install botometer
```

## Using

```js
const { Botometer } = require("botometer");

const botometer = new Botometer({
  consumerKey: "<consumerKey>",
  consumerSecret: "<consumerSecret>",
  accessToken: "<accessToken>",
  accessTokenSecret: "<accessTokenSecret>",
  rapidApiKey: "<rapidApiKey>",
  supressLogs: false, // Not required. Defaults to true
});

async function run() {
  const results = await botometer.getScores(["@aandreyluiz"]);

  console.log(results);
}

run();
```

The `console.log` will yield something like:

```js
[
  {
    cap: { english: 0.22851217352302083, universal: 0.22121616027906205 },
    categories: {
      content: 0.6044735474026068,
      friend: 0.27037007428252813,
      network: 0.2350108345196892,
      sentiment: 0.7640015609838375,
      temporal: 0.47574717852253456,
      user: 0.8819524564335114,
    },
    display_scores: {
      content: 3,
      english: 3.3,
      friend: 1.4,
      network: 1.2,
      sentiment: 3.8,
      temporal: 2.4,
      universal: 3.3,
      user: 4.4,
    },
    scores: { english: 0.6506901031179089, universal: 0.6545596461071505 },
    user: {
      // ...
      name: "Andrey Luiz",
      screen_name: "aandreyluiz",
      // ...
    },
  },
];
```

If you get `null` results in your array, set `supressLogs` to false so you can see the errors along the process.

## Credits

### Botometer
My deep thanks to the guys from the [Botometer project](http://botometer.iuni.iu.edu/) from the Observatory on Social Media at Indiana University.
