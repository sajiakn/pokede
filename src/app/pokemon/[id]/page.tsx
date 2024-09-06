"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PokemonDetails {
  id: number;
  name: string;
  types: string[];
  image: string;
  height: number;
  weight: number;
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export default function PokemonDetail() {
  const params = useParams();
  const id = params.id as string;
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    if (id) {
      fetchPokemonDetails(id);
    }
  }, [id]);

  const fetchPokemonDetails = async (pokemonId: string) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const data = await response.json();
      setPokemon({
        id: data.id,
        name: data.name,
        types: data.types.map(
          (type: { type: { name: string } }) => type.type.name
        ),
        image: data.sprites.front_default,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map(
          (ability: { ability: { name: string } }) => ability.ability.name
        ),
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          specialAttack: data.stats[3].base_stat,
          specialDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
        },
      });
    } catch (error) {
      console.error("Failed to fetch Pokemon details:", error);
    }
  };

  if (!pokemon) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Pokemon List
      </Link>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
            <div className="md:ml-6 mt-4 md:mt-0">
              <h1 className="text-4xl font-bold mb-2">{pokemon.name}</h1>
              <div className="flex gap-2 mb-2">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type}
                    className={`${
                      typeColors[type as keyof typeof typeColors]
                    } text-white`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-600">Height: {pokemon.height / 10}m</p>
              <p className="text-gray-600">Weight: {pokemon.weight / 10}kg</p>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Abilities</h2>
            <ul className="list-disc list-inside">
              {pokemon.abilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Stats</h2>
            <ul className="list-none">
              <li>HP: {pokemon.stats.hp}</li>
              <li>Attack: {pokemon.stats.attack}</li>
              <li>Defense: {pokemon.stats.defense}</li>
              <li>Special Attack: {pokemon.stats.specialAttack}</li>
              <li>Special Defense: {pokemon.stats.specialDefense}</li>
              <li>Speed: {pokemon.stats.speed}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
