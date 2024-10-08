
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

function convertPokeApiIdToPokemon(pokemonPokeApi) {
    const pokemon = new Pokemon();
    pokemon.number = pokemonPokeApi.id;
    pokemon.name = pokemonPokeApi.forms[0].name;
    pokemon.stats = pokemonPokeApi.stats.map((stat) => {return {name: stat.stat.name, value: stat.base_stat}});
    pokemon.photo = pokemonPokeApi.sprites.other.dream_world.front_default
    pokemon.types = pokemonPokeApi.types.map((typeSlot) => typeSlot.type.name)
    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemonId = (id) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json())
            .then(convertPokeApiIdToPokemon).then((result) => result);
            
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
