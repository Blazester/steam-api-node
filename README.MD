# BLAZ-STEAM-API
![GitHub top language](https://img.shields.io/github/languages/top/Blazester/steam-api-node?style=for-the-badge)
![GitHub all releases](https://img.shields.io/github/downloads/Blazester/steam-api-node/total?style=for-the-badge)
![GitHub package.json version](https://img.shields.io/github/package-json/v/Blazester/steam-api-node?style=for-the-badge)
## Sigueme en:
![GitHub followers](https://img.shields.io/github/followers/Blazester?label=S%C3%ADgueme&style=social)

![Twitter Follow](https://img.shields.io/twitter/follow/BlazesterGG?label=Sigueme&style=social)

Paquete ligero para autenticar al usuario con la Steam api, Utiliza promesas :)

## ¿Como se instala?

Instalamos el paquete utilizando `npm i blaz-steam-api` o `yarn add blaz-steam-api` en la carpeta del tu proyecto.

### Instalacion

```javascript
const SteamAuth = require("blaz-steam-api");

const steam = new SteamAuth({
  realm: "http://localhost:5000", // Sitio donde el usuario se quiere registrar, es decir, tu dominio de la pagina web
  returnUrl: "http://localhost:5000/auth/steam/authenticate", // La ruta donde quieres que redirija al usuario, Tiene que ser del mismo dominio de que el Realm 
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXX" // Tu Steam Api Key, se obtiene de https://steamcommunity.com/dev/apikey
});
```

### Rutas

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

## Funciones

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

![NPM](https://img.shields.io/npm/l/blaz-steam-api?style=for-the-badge)