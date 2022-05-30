var express = require("express");
var router = express.Router();
const axios = require("axios").default;

const instance = axios.create({
  baseURL: "https://pokeapi.co/api/v2/pokemon/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

/* GET pokemon. */
router.get("/pokemon/:name", async function (req, res, next) {
  // name param
  const pokeParam = req.params.name;
  let pokeResponse = null;
  let pokeError = null;

  await instance
    .get(`/${pokeParam}`)
    .then(function (response) {
      // console.log(response)
      const hisAbilities = response.data.abilities;

      // map names
      hisAbilitesMapped = hisAbilities.map((ability) => {
        return ability.ability.name;
      });

      // sorting
      hisAbilitesMapped = hisAbilitesMapped.sort(function (a, b) {
        return +(a > b) || +(a === b) - 1;
      });

      pokeResponse = hisAbilitesMapped;

      return false;
    })
    .catch(function (error) {
      console.log("error status", error);
      if (error.statusCode === 404) {
        res.status(404);
        console.log(error.response.data);
        pokeError = error.response.data;
      } else if (error.statusCode >= 500) {
        res.status(500);
        console.log("PokeAPI Error", error.message);
      } else {
        console.log("error", error.message);
      }
    });

  console.log(pokeError, pokeResponse);
  res.send(pokeResponse || { error: pokeError });
});

module.exports = router;
