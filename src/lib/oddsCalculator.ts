import { cardToKey, createDeck, shuffleDeck } from './deck';
import { compareEvaluatedHands, evaluateSevenCardHand } from './handEvaluator';
import type { Player, PlayingCard } from './types';

export interface PlayerOdds {
  winChance: number;
  tieChance: number;
  handStrengthLabel: string;
}

/**
 * Monte Carlo approximation for Hold'em outcomes.
 * For each simulation we fill unknown board cards, evaluate all players,
 * and increment win/tie counters for best hands.
 */
export function calculateOdds(
  players: Player[],
  communityCards: PlayingCard[],
  simulations = 5000,
): Record<number, PlayerOdds> {
  const wins = new Map<number, number>();
  const ties = new Map<number, number>();
  const labels = new Map<number, string>();

  players.forEach((p) => {
    wins.set(p.id, 0);
    ties.set(p.id, 0);
  });

  for (let sim = 0; sim < simulations; sim += 1) {
    const used = new Set<string>([
      ...communityCards.map(cardToKey),
      ...players.flatMap((p) => p.holeCards.map(cardToKey)),
    ]);

    const remaining = shuffleDeck(createDeck().filter((c) => !used.has(cardToKey(c))));
    const board = [...communityCards];
    while (board.length < 5) {
      const next = remaining.shift();
      if (!next) break;
      board.push(next);
    }

    const evaluated = players.map((player) => {
      const hand = evaluateSevenCardHand([...player.holeCards, ...board]);
      labels.set(player.id, hand.label);
      return { id: player.id, hand };
    });

    let best = evaluated[0];
    let winners = [best.id];

    for (let i = 1; i < evaluated.length; i += 1) {
      const cmp = compareEvaluatedHands(evaluated[i].hand, best.hand);
      if (cmp > 0) {
        best = evaluated[i];
        winners = [evaluated[i].id];
      } else if (cmp === 0) {
        winners.push(evaluated[i].id);
      }
    }

    if (winners.length === 1) {
      wins.set(winners[0], (wins.get(winners[0]) ?? 0) + 1);
    } else {
      for (const id of winners) ties.set(id, (ties.get(id) ?? 0) + 1);
    }
  }

  const result: Record<number, PlayerOdds> = {};
  players.forEach((player) => {
    result[player.id] = {
      winChance: ((wins.get(player.id) ?? 0) / simulations) * 100,
      tieChance: ((ties.get(player.id) ?? 0) / simulations) * 100,
      handStrengthLabel: labels.get(player.id) ?? 'N/A',
    };
  });

  return result;
}
