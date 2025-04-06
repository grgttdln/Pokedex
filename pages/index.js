import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemon = async (offset = 0) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pokemon?offset=${offset}&limit=20`);
      if (!response.ok) throw new Error("Failed to fetch Pokémon");
      const data = await response.json();

      setPokemon((prev) =>
        offset === 0 ? data.pokemon : [...prev, ...data.pokemon]
      );
      setNextOffset(data.next);
      setHasMore(data.next !== null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(0);
  }, []);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 800; // Load more when 800px from bottom

    if (scrollPosition > threshold) {
      fetchPokemon(nextOffset);
    }
  }, [loading, hasMore, nextOffset]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredPokemon = pokemon.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.types.some((type) =>
        type.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokédex</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{geistSans}</style>
        <style>{geistMono}</style>
      </Head>

      <nav className={styles.navbar}>
        <p className={styles.title}>Pokédex</p>
      </nav>

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <p className={styles.subtitle}>
            Catch &apos;Em All, Know &apos;Em All
          </p>
          <h2 className={styles.findText}>Find Your Pokemon</h2>
          <div className={styles.catSprite}></div>
        </div>

        <div className={styles.pokemonSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search Pokemon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.titlePokemonList}>Pokemon List</div>

          <div className={styles.pokemonGrid}>
            {filteredPokemon.map((p) => (
              <div key={p.id} className={styles.pokemonCard}>
                <div className={styles.pokemonCardContent}>
                  <div className={styles.pokemonCardImage}>
                    <div className={styles.pokemonCardImageBorder}>
                      <div className={styles.pokemonCardImageContent}>
                        <img
                          src={p.sprite}
                          alt={p.name}
                          className={styles.pokemonSprite}
                        />
                        <h3 className={styles.pokemonName}>{p.name}</h3>
                        <div className={styles.pokemonTypes}>
                          {p.types.map((type) => (
                            <span
                              key={type}
                              className={`${styles.type} ${styles[type]}`}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className={styles.loadingContainer}>
              <div className={styles.loading}>Loading more Pokémon...</div>
            </div>
          )}

          {error && (
            <div className={styles.errorContainer}>
              <div className={styles.error}>{error}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
