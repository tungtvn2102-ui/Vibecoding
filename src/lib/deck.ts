import type { PlayingCard, Rank, Suit } from './types';

const suits: Suit[] = ['♠', '♥', '♦', '♣'];
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export function createDeck(): PlayingCard[] {
  return suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })));
}

export function cardToKey(card: PlayingCard): string {
  return `${card.rank}${card.suit}`;
}

export function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(deck: PlayingCard[], count: number): PlayingCard[] {
  return deck.splice(0, count);
}
