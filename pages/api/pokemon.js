export default async function handler(req, res) {
  try {
    const { offset = 0, limit = 20 } = req.query;

    // Fetch Pokemon list with pagination
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();

    // Fetch details for each Pokemon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        const detail = await detailResponse.json();
        return {
          id: detail.id,
          name: detail.name,
          sprite:
            detail.sprites.other.showdown.front_default ||
            detail.sprites.other["official-artwork"].front_default ||
            detail.sprites.front_default,
          types: detail.types.map((t) => t.type.name),
        };
      })
    );

    res.status(200).json({
      pokemon: pokemonDetails,
      next: data.next ? parseInt(offset) + parseInt(limit) : null,
      total: data.count,
    });
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
