const axios = require("axios");
const openid = require("openid");

// Class Principal
class SteamAuth {
  constructor({ realm, returnUrl, apiKey }) {
    if (!realm || !returnUrl || !apiKey)
      throw new Error(
        "Faltan los parámetros realm, returnURL y apiKey. Estos son necesarios."
      );

    this.realm = realm;
    this.returnUrl = returnUrl;
    this.apiKey = apiKey;
    this.relyingParty = new openid.RelyingParty(
      returnUrl,
      realm,
      true,
      true,
      []
    );
  }

  // Obtenemos la url de redireccionamiento de para steamID
  async getRedirectUrl() {
    return new Promise((resolve, reject) => {
      this.relyingParty.authenticate(
        "https://steamcommunity.com/openid",
        false,
        (error, authUrl) => {
          if (error) return reject("Error de autenticación: " + error);
          if (!authUrl) return reject("Error de autenticación.");

          resolve(authUrl);
        }
      );
    });
  }

  // Obtener el usuario
  async fetchIdentifier(steamOpenId) {
    return new Promise(async (resolve, reject) => {
      // Analizar la SteamID del url obtenido del OpenID
      const steamId = steamOpenId.replace(
        "https://steamcommunity.com/openid/id/",
        ""
      );

      try {
        const response = await axios.get(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${steamId}`
        );
        const players =
          response.data &&
          response.data.response &&
          response.data.response.players;

        if (players && players.length > 0) {
          // Obtenemos el usuario
          const player = players[0];

          // Retornamos los datos
          resolve({
            _json: player,
            steamid: steamId,
            username: player.personaname,
            name: player.realname,
            profile: player.profileurl,
            avatar: {
              small: player.avatar,
              medium: player.avatarmedium,
              large: player.avatarfull
            }
          });
        } else {
          reject("No se han encontrado jugadores para el SteamID dado.");
        }
      } catch (error) {
        reject("Error en el servidor de Steam: " + error.message);
      }
    });
  }

  // Atentificamos al usuario
  async authenticate(req) {
    return new Promise((resolve, reject) => {
      // Verificar sesion
      this.relyingParty.verifyAssertion(req, async (error, result) => {
        if (error) return reject(error.message);
        if (!result || !result.authenticated)
          return reject("Error al autenticar al usuario.");
        if (
          !/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(
            result.claimedIdentifier
          )
        )
          return reject("La identidad reclamada no es válida.");

        try {
          const user = await this.fetchIdentifier(result.claimedIdentifier);
          return resolve(user);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

// Exportamos la clase
module.exports = SteamAuth;
