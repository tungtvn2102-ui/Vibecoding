import type { PlayingCard, Rank } from './types';

const rankValue: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

export interface EvaluatedHand {
  category: number;
  tiebreakers: number[];
  label: string;
}

function findStraight(values: number[]): number | null {
  const unique = [...new Set(values)].sort((a, b) => b - a);
  if (unique.includes(14)) unique.push(1);

  let run = 1;
  for (let i = 0; i < unique.length - 1; i += 1) {
    if (unique[i] - 1 === unique[i + 1]) {
      run += 1;
      if (run >= 5) return unique[i - 3];
    } else {
      run = 1;
    }
  }
  return null;
}

export function evaluateSevenCardHand(cards: PlayingCard[]): EvaluatedHand {
  const values = cards.map((c) => rankValue[c.rank]).sort((a, b) => b - a);

  const countByValue = new Map<number, number>();
  for (const value of values) countByValue.set(value, (countByValue.get(value) ?? 0) + 1);

  const valueGroups = [...countByValue.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return b[0] - a[0];
  });

  const bySuit = new Map<string, number[]>();
  for (const card of cards) {
    const v = rankValue[card.rank];
    bySuit.set(card.suit, [...(bySuit.get(card.suit) ?? []), v]);
  }

  const flushSuit = [...bySuit.entries()].find(([, suitValues]) => suitValues.length >= 5);
  if (flushSuit) {
    const flushValues = flushSuit[1].sort((a, b) => b - a);
    const sfHigh = findStraight(flushValues);
    if (sfHigh) {
      const royal = sfHigh === 14;
      return {
        category: 9,
        tiebreakers: [sfHigh],
        label: royal ? 'Royal Flush' : 'Straight Flush',
      };
    }
  }

  const fourKind = valueGroups.find(([, c]) => c === 4);
  if (fourKind) {
    const kicker = values.find((v) => v !== fourKind[0]) ?? 0;
    return { category: 8, tiebreakers: [fourKind[0], kicker], label: 'Four of a Kind' };
  }

  const triples = valueGroups.filter(([, c]) => c === 3).map(([v]) => v);
  const pairs = valueGroups.filter(([, c]) => c === 2).map(([v]) => v);
  if (triples.length >= 1 && (pairs.length >= 1 || triples.length >= 2)) {
    const trip = triples[0];
    const pair = pairs[0] ?? triples[1];
    return { category: 7, tiebreakers: [trip, pair], label: 'Full House' };
  }

  if (flushSuit) {
    const topFive = flushSuit[1].sort((a, b) => b - a).slice(0, 5);
    return { category: 6, tiebreakers: topFive, label: 'Flush' };
  }

  const straightHigh = findStraight(values);
  if (straightHigh) return { category: 5, tiebreakers: [straightHigh], label: 'Straight' };

  if (triples.length >= 1) {
    const trip = triples[0];
    const kickers = values.filter((v) => v !== trip).slice(0, 2);
    return { category: 4, tiebreakers: [trip, ...kickers], label: 'Three of a Kind' };
  }

  if (pairs.length >= 2) {
    const [highPair, lowPair] = pairs.slice(0, 2);
    const kicker = values.find((v) => v !== highPair && v !== lowPair) ?? 0;
    return { category: 3, tiebreakers: [highPair, lowPair, kicker], label: 'Two Pair' };
  }

  if (pairs.length === 1) {
    const pair = pairs[0];
    const kickers = values.filter((v) => v !== pair).slice(0, 3);
    return { category: 2, tiebreakers: [pair, ...kickers], label: 'One Pair' };
  }

  return { category: 1, tiebreakers: values.slice(0, 5), label: 'High Card' };
}

export function compareEvaluatedHands(a: EvaluatedHand, b: EvaluatedHand): number {
  if (a.category !== b.category) return a.category - b.category;
  for (let i = 0; i < Math.max(a.tiebreakers.length, b.tiebreakers.length); i += 1) {
    const diff = (a.tiebreakers[i] ?? 0) - (b.tiebreakers[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
