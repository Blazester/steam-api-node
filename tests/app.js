const SteamAuth = require('../src/index')
const express = require('express')
const axios = require('axios')
const app = express()
const myID = 'https://steamcommunity.com/openid/id/76561198326119849'

const steam = new SteamAuth({
  realm: "http://localhost:4000", // Sitio donde el usuario se quiere registrar, es decir, tu dominio de la pagina web
  returnUrl: "http://localhost:4000/auth/steam/authenticate", // La ruta donde quieres que redirija al usuario, Tiene que ser del mismo dominio de que el Realm 
  apiKey: "8B11683ACB746BA332A9F5B1FA98FEAB" // Tu Steam Api Key, se obtiene de https://steamcommunity.com/dev/apikey
});


app.get("/auth/steam", async (req, res) => {
    const redirectUrl = await steam.getRedirectUrl();
    return res.redirect(redirectUrl);
  });
  
  app.get("/auth/steam/authenticate", async (req, res) => {
    try {
      const user = await steam.authenticate(req);
  
      res.send(`<img src="${user.avatar.large}"/>`)
    } catch (error) {
      console.error(error);
    }
  });

app.listen(4000)
