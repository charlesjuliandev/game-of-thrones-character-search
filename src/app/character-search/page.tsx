"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDebounce } from "@/app/utils/usedebounce";

const AutoComplete = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const debouncedQuery = useDebounce(query, 500);
  const cache = useRef({}); // Use useRef to store cache

  useEffect(() => {
    if (debouncedQuery) {
      searchCharacters(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const searchCharacters = async (searchQuery: string) => {
    if (cache.current[searchQuery]) {
      setResults(cache.current[searchQuery]);
      return;
    }

    try {
      const allResults = [];
      let page = 1;
      let moreResults = true;

      while (moreResults) {
        const response = await axios.get(
          `https://anapioficeandfire.com/api/characters`,
          {
            params: {
              page: page,
              pageSize: 50,
            },
          }
        );

        const data = response.data;
        console.log(`Fetched page ${page}`, data);

        if (data.length > 0) {
          allResults.push(...data);
          page += 1;
        } else {
          moreResults = false;
        }
      }

      const filteredResults = allResults.filter(
        (character) =>
          (character.name &&
            character.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          character.aliases.some((alias) =>
            alias.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );

      console.log("Filtered results", filteredResults);
      cache.current[searchQuery] = filteredResults; // Cache the results
      setResults(filteredResults);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  const fetchDetails = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data.name || "Unknown";
    } catch (error) {
      console.error("Error fetching details:", error);
      return "Unknown";
    }
  };

  const fetchBooks = async (bookUrls) => {
    try {
      const bookNames = await Promise.all(
        bookUrls.map(async (url) => {
          const response = await axios.get(url);
          return response.data.name;
        })
      );
      return bookNames;
    } catch (error) {
      console.error("Error fetching book names:", error);
      return ["Unknown"];
    }
  };

  const handleSelect = async (character) => {
    const selected = { ...character };

    if (selected.father && selected.father.startsWith("http")) {
      selected.father = await fetchDetails(selected.father);
    } else {
      selected.father = "Unknown";
    }

    if (selected.mother && selected.mother.startsWith("http")) {
      selected.mother = await fetchDetails(selected.mother);
    } else {
      selected.mother = "Unknown";
    }
    if (selected.spouse && selected.spouse.startsWith("http")) {
      selected.spouse = await fetchDetails(selected.spouse);
    } else {
      selected.spouse = "Unknown";
    }

    if (selected.books && selected.books.length > 0) {
      selected.books = await fetchBooks(selected.books);
    } else {
      selected.books = ["Unknown"];
    }

    setSelectedCharacter(selected);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search characters..."
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      {results.length > 0 && (
        <ul className="bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto">
          {results.map((character) => (
            <li
              key={character.url}
              onClick={() => handleSelect(character)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {character.name || character.aliases[0] || "Unknown Character"}
            </li>
          ))}
        </ul>
      )}
      {selectedCharacter && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md">
          <h2 className="text-xl font-bold mb-2">
            {selectedCharacter.name || "Unknown"}
          </h2>
          <p>
            <strong>Gender:</strong> {selectedCharacter.gender || "Unknown"}
          </p>
          <p>
            <strong>Born:</strong> {selectedCharacter.born || "Unknown"}
          </p>
          <p>
            <strong>Mother:</strong> {selectedCharacter.mother}
          </p>
          <p>
            <strong>Father:</strong> {selectedCharacter.father}
          </p>
          <p>
            <strong>Spouse:</strong> {selectedCharacter.spouse || "Unknown"}
          </p>
          <p>
            <strong>Aliases:</strong>{" "}
            {selectedCharacter.aliases.length > 0
              ? selectedCharacter.aliases.join(", ")
              : "Unknown"}
          </p>
          <p>
            <strong>Books:</strong>{" "}
            {selectedCharacter.books.length > 0
              ? selectedCharacter.books.join(", ")
              : "Unknown"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
