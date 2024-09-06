"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// ポケモンのタイプに応じた色を定義
const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-700",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
};

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
}

export function PokeDex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const data = await response.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name,
              types: details.types.map(
                (type: { type: { name: string } }) => type.type.name
              ),
              image: details.sprites.front_default,
            };
          })
        );
        setPokemonData(pokemonDetails);
      } catch (error) {
        console.error("ポケモンデータの取得に失敗しました:", error);
      }
    };

    fetchPokemon();
  }, []);

  const allTypes = Array.from(
    new Set(pokemonData.flatMap((pokemon) => pokemon.types))
  );

  const filteredPokemon = pokemonData.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "" || selectedType === "all" || pokemon.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white">Pokédex</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div className="flex gap-4 mb-8">
          <Input
            type="search"
            placeholder="ポケモンを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="タイプで絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのタイプ</SelectItem>
              {allTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPokemon.map((pokemon) => (
            <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-2">
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {pokemon.name}
                  </h2>
                  <div className="flex gap-2">
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
