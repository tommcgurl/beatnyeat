'use client'
import { ChangeEventHandler, use, useCallback, useEffect, useState } from "react";
import styles from './games.module.css';
import Game from '../../components/Game/Game'
import debounce from 'lodash.debounce';

async function searchGames(searchString: string) {
  const games = await fetch(`http://localhost:3000/api/twitch-games?name=${searchString}`);
  return games.json();
}

type GameResult = {
  name: string,
  summary?: string,
  cover?: {
    id: string,
    url: string,
  }
}
export default function Playthroughs() {
  const [searchString, setSearchString] = useState('');
  const [games, setGames] = useState<GameResult[]>([])

  useEffect(() => {
    if (!searchString) {
      return
    }
    const fetchGames = async () => {
      const games = await searchGames(searchString);
      setGames(games)
    }
    fetchGames();
  }, [searchString]) 

  const searchHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value);
  }

  const debouncedSearchHandler = useCallback(debounce(searchHandler, 500), [])

  return (
    <div>
      <main>
        <h1>Search Games</h1>
        <input onChange={debouncedSearchHandler} placeholder="search game by name"></input>
        <ul className={styles.list}>
          {games.map((game) => 
            <Game name={game.name} summary={game.summary} coverURL={game.cover?.url}/>
          )}
        </ul>
      </main>
    </div>
  );
}
