export type Suit = '♠' | '♥' | '♦' | '♣';

export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'T'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface PlayingCard {
  rank: Rank;
  suit: Suit;
}

export interface Player {
  id: number;
  name: string;
  holeCards: PlayingCard[];
  winChance: number;
  tieChance: number;
  handStrengthLabel: string;
}

export type Street = 'preflop' | 'flop' | 'turn' | 'river';
