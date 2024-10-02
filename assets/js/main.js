const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('modal');

const maxRecords = 151
const limit = 10
let offset = 0;

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const button = document.getElementById('close');
            // Agora você pode acessar o botão
            button.addEventListener('click', () => {
                modal.classList.add('hide');
            });
        }
    });
});

observer.observe(modal, { childList: true });


function convertPokemonToLi(pokemon) {
    return `
        <li id="pokemon-${pokemon.number}" class="pokemon ${pokemon.types[0]}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertPokemonToContentModal(pokemon) {
    return `
        <div class="modal-content ${pokemon.types[0]}">
            <header>
                <section>
                    <h2>${pokemon.name}</h2>
                    <span>${pokemon.number}</span>
                </section>
                <button id="close">
                    <span class="close">X</span>
                </button>
            </header>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <h3>Stats</h3>
            <ul class="stats">
                ${pokemon.stats.map((stat) => `<li> ${stat.name}: ${stat.value}</li>`).join('')}
            </ul>
        </div>
    `
}

function openModalWithPokemonChosen(arrayPokemons) {
    arrayPokemons.forEach((element) => {
        element.addEventListener('click', () => {
            modal.classList.remove('hide');
            pokeApi.getPokemonId(element.getAttribute('id').split('-')[1]).then((pokemonResult) => {
                modal.innerHTML = convertPokemonToContentModal(pokemonResult);
            }
            );
        })
    })
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        const pokemonsArray = Array.from(document.getElementsByClassName("pokemon"));
        openModalWithPokemonChosen(pokemonsArray);

    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})








