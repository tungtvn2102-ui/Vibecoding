import { useMemo, useState } from 'react';
import Controls from './components/Controls';
import PokerTable from './components/PokerTable';
import { calculateOdds } from './lib/oddsCalculator';
import { cardToKey, createDeck, drawCards, shuffleDeck } from './lib/deck';
import type { Player, PlayingCard } from './lib/types';

const PLAYER_COUNT = 6;

function emptyPlayers(count: number): Player[] {
  return Array.from({ length: count }).map((_, idx) => ({
    id: idx + 1,
    name: `Player ${idx + 1}`,
    holeCards: [],
    winChance: 0,
    tieChance: 0,
    handStrengthLabel: 'N/A',
  }));
}

export default function App(): JSX.Element {
  const [players, setPlayers] = useState<Player[]>(() => emptyPlayers(PLAYER_COUNT));
  const [communityCards, setCommunityCards] = useState<PlayingCard[]>([]);

  const usedCards = useMemo(
    () => new Set([...players.flatMap((p) => p.holeCards.map(cardToKey)), ...communityCards.map(cardToKey)]),
    [players, communityCards],
  );

  function dealNewHand(): void {
    const deck = shuffleDeck(createDeck());
    const next = players.map((player) => ({
      ...player,
      holeCards: drawCards(deck, 2),
      winChance: 0,
      tieChance: 0,
      handStrengthLabel: 'N/A',
    }));
    setPlayers(next);
    setCommunityCards([]);
  }

  function dealStreet(targetCount: number): void {
    if (communityCards.length >= targetCount) return;
    const deck = shuffleDeck(createDeck().filter((c) => !usedCards.has(cardToKey(c))));
    const toAdd = targetCount - communityCards.length;
    setCommunityCards((prev) => [...prev, ...drawCards(deck, toAdd)]);
  }

  function reset(): void {
    setPlayers(emptyPlayers(PLAYER_COUNT));
    setCommunityCards([]);
  }

  function analyze(): void {
    if (players.some((p) => p.holeCards.length !== 2)) return;
    const odds = calculateOdds(players, communityCards, 5000);
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        winChance: odds[p.id].winChance,
        tieChance: odds[p.id].tieChance,
        handStrengthLabel: odds[p.id].handStrengthLabel,
      })),
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-4 py-8 text-white">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">PokerVision</h1>
      <p className="mb-6 text-center text-sm text-emerald-100/90">
        Educational Texas Hold&apos;em probability analyzer (no betting, no real-money gameplay).
      </p>
      <PokerTable players={players} communityCards={communityCards} />
      <Controls
        onNewHand={dealNewHand}
        onDealFlop={() => dealStreet(3)}
        onDealTurn={() => dealStreet(4)}
        onDealRiver={() => dealStreet(5)}
        onAnalyze={analyze}
        onReset={reset}
      />
    </main>
  );
}
