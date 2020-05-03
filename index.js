const { Botometer } = require("./lib");

const botometer = new Botometer({
  consumerKey: "ikNwHJe2PFBTBFdAi3NVnkwsM",
  consumerSecret: "C65EUhUh7crrSzk5D3p5ZH8NlfGjFjUEPGjmm0Pp2SYUmJTnkO",
  accessToken: "97265487-zw76B5hOJ49TIwvbeewqkkfjlu17irgzMkGa7j9jU",
  accessTokenSecret: "noo7JZGhVK1aXPPNfUT6RYUIqoDboe6c0K8iLQDtuKPvL",
  rapidApiKey: "ca486366b2msh479a946343e93efp1afb77jsn1c036326d5fb",
  supressLogs: false,
  usePro: true,
});

botometer.getScore("@aandreyluiz");
