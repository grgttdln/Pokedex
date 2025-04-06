import { useState, useEffect } from "react";
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
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch("/api/pokemon?id=17"); // Fetch Steelix
        if (!response.ok) throw new Error("Failed to fetch Pokémon");
        const data = await response.json();
        console.log("Fetched Pokémon:", data);
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, []);

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

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* {pokemon && (
          <div>
            <h2>{pokemon.name.toUpperCase()}</h2>
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              width="150"
              height="150"
            />
            <p>Types: {pokemon.types.join(", ")}</p>
          </div>
        )} */}
      </main>
    </div>
  );
}
