# node-steam-openid

[![npm version](https://badge.fury.io/js/node-steam-openid.svg)](https://badge.fury.io/js/node-steam-openid)
[![dependencies](https://david-dm.org/leevihalme/node-steam-openid.svg)](https://david-dm.org/leevihalme/node-steam-openid.svg)

A lightweight wrapper package around Steam's Authentication API, which supports promises :)

## Usage

Install the package by typing `npm i node-steam-openid` in your project folder.

### Setup

```javascript
const SteamAuth = require("node-steam-openid");

const steam = new SteamAuth({
  realm: "http://localhost:5000", // Sitio donde el usuario se quiere registrar, es decir, tu dominio de la pagina web
  returnUrl: "http://localhost:5000/auth/steam/authenticate", // La ruta donde quieres que redirija al usuario, Tiene que ser del mismo dominio de que el Realm 
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXX" // Tu Steam Api Key, se obtiene de https://steamcommunity.com/dev/apikey
});
```

### Routes

```javascript
app.get("/auth/steam", async (req, res) => {
  const redirectUrl = await steam.getRedirectUrl();
  return res.redirect(redirectUrl);
});

app.get("/auth/steam/authenticate", async (req, res) => {
  try {
    const user = await steam.authenticate(req);

    //...Haces lo que quieras con los datos obtenidos en la solicitud (req)
  } catch (error) {
    console.error(error);
  }
});
```

## Metodos

### getRedirectUrl

Obtiene la URL de redirección a steam.

#### Parametros

No tiene parametros

#### Returns

- Promesa (String)

#### Example

```javascript
steam.getRedirectUrl().then(url => {
  //...Haces lo que quieras con la variable URL
});
```

### authenticate

Autenticar al usuario con oAuth.

#### Parametros

- Solicitud (ExpressJsRequest, Object)

#### Returns

- Promesa (UserObject)

#### Example

```javascript
steam.authenticate(req).then(user => {
  //...La variable User te devuelve un Json
});
```

## Objetos

### Objeto de usuario

Objeto que contiene todos los datos del usuario. La clave '_json' contiene la respuesta de la API de Steam.

#### Ejemplo

```javascript
{
  _json: { ... },
  steamid: "12345678912345678",
  username: "Example Username",
  name: "Example Name",
  profile: "https://steamcommunity.com/id/Example",
  avatar: {
    small: "...",
    medium: "...",
    large: "..."
  }
}
```

## License

MIT 