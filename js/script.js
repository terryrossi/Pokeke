//
//
// Initialize list of Pokemons using IIFE to protect variables

// DATA...
const pokemonRepository = (function () {
	const pokemonList = [];
	// let pokemon = {};
	let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

	// FUNCTIONS...

	function add(pokemon) {
		pokemonList.push(pokemon);
	}
	///////////////////////////////////////////////
	function getAll() {
		return pokemonList;
	}
	////////////////////////////////////////////////
	function loadPokeListFromApi() {
		// Fetch Pokemons from API
		showLoadingMessage();

		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					add(pokemon);
					hideLoadingMessage();
				});
			})
			.catch(function (e) {
				console.error(e);
				hideLoadingMessage();
			});
	}

	////////////////////////////////////////////////
	function loadDetails(pokemon) {
		// fetch pokemon detail from API
		showLoadingMessage();
		let url = pokemon.detailsUrl;
		return fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (pokemonDetails) {
				// Pokemon details received from API
				pokemon.imageUrl = pokemonDetails.sprites.other.home.front_default;
				pokemon.height = pokemonDetails.height;
				pokemon.types = pokemonDetails.types;
				hideLoadingMessage();
			})
			.catch(function (e) {
				console.error(e);
				hideLoadingMessage();
			});
	}
	////////////////////////////////////////////////
	function addListItem(pokemon) {
		// Variables from DOM Elements:
		const pokemonHtmlList = document.querySelector(".pokemon-list");
		const li = document.createElement("li");
		const button = document.createElement("button");
		// add CSS Class to button
		button.classList.add("pokemon-button");

		// add Pokemon name to button text
		button.innerText = pokemon.name;

		// add eventListener to the Button
		addEventListenerToButton(button, "click", pokemon);

		// insert the button into the line element
		li.appendChild(button);

		// add Class to line element
		li.classList.add("pokemon-list__item");

		// add the line element into the list element
		pokemonHtmlList.appendChild(li);
	}

	function addEventListenerToButton(button, type, pokemon) {
		button.addEventListener(type, function (event) {
			showDetails(pokemon);
		});
	}
	///////////////////////////////////////////////////////////////
	function showDetails(pokemon) {
		// shows details when Pokemon clicked on
		loadDetails(pokemon).then(function () {
			console.log(pokemon);
		});
	}
	///////////////////////////////////////////////////////////////
	function search(searchName) {
		// Find Pokemon
		const foundPokemon = pokemonRepository.getAll().filter(function (pokemon) {
			if (pokemon.name.toLowerCase() === searchName.toLowerCase()) {
				return pokemon;
			}
		});
		return foundPokemon;
	}
	////////////////////////////////////////////////////////////////
	function showLoadingMessage() {
		const messageLoading = document.querySelector(".message-loading");
		messageLoading.classList.remove("hidden");
	}
	////////////////////////////////////////////////////////////////
	function hideLoadingMessage() {
		const messageLoading = document.querySelector(".message-loading");
		messageLoading.classList.add("hidden");
	}
	////////////////////////////////////////////////////////////////

	return {
		add,
		getAll,
		loadPokeListFromApi,
		loadDetails,
		addListItem,
		search,
	};
})();
//
///////////////////////   END OF IIFE POKEMON INITIALIZATION FUNCTIONS  ////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////// PROGRAM FLOW... ///////////////////////////////
//
//
//  FETCH ALL POKEMONS FROM API then SHOW ALL POKEMONS
pokemonRepository.loadPokeListFromApi().then(function () {
	pokemonRepository.getAll().forEach(function (pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
