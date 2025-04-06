export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing Pokémon ID" });
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      return res.status(404).json({ error: "Pokémon not found" });
    }

    const data = await response.json();

    res.status(200).json({
      id: data.id,
      name: data.name,
      sprite:
        data.sprites.other.showdown.front_default ||
        data.sprites.other?.["official-artwork"]?.front_default ||
        data.sprites.front_default,
      types: data.types.map((t) => t.type.name),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
