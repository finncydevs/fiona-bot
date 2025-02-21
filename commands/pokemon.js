const caughtPokemons = new Map(); 

async function pokemon(sock, chatId) {
  try {
    const randomId = Math.floor(Math.random() * 898) + 1; 
    const link = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
    const response = await fetch(link);

    if (!response.ok) {
      throw new Error("Pokémon not found");
    }

    const data = await response.json();
    const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const sprite = data.sprites.front_default;
    const types = data.types.map((type) => type.type.name).join(", ");
    const weight = `${data.weight / 10} kg`;
    const height = `${data.height / 10} m`;
    const abilities = data.abilities.map((a) => a.ability.name).join(", ");
    const experience = data.base_experience;
    const image =
      data.sprites.other["official-artwork"].front_default || sprite;

    const catchSuccess = Math.random() < 0.5; 
    let catchMessage;

    if (catchSuccess) {
      if (!caughtPokemons.has(chatId)) {
        caughtPokemons.set(chatId, []);
      }
      caughtPokemons.get(chatId).push(pokemonName);
      catchMessage = `🎉 You caught ${pokemonName}! You now have ${
        caughtPokemons.get(chatId).length
      } Pokémon.`;
    } else {
      catchMessage = `❌ ${pokemonName} escaped!`;
    }

    const message = `*${pokemonName}*
Type: ${types}
Weight: ${weight}
Height: ${height}
Abilities: ${abilities}
Exp: ${experience}

${catchMessage}`;

    await sock.sendMessage(chatId, { image: { url: image }, caption: message });
  } catch (error) {
    await sock.sendMessage(chatId, { text: "Error fetching Pokémon data." });
  }
}

module.exports = { pokemon, caughtPokemons };
