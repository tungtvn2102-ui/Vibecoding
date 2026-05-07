import type { Player, PlayingCard } from '../lib/types';
import Card from './Card';
import PlayerSeat from './PlayerSeat';

interface PokerTableProps {
  players: Player[];
  communityCards: PlayingCard[];
}

export default function PokerTable({ players, communityCards }: PokerTableProps): JSX.Element {
  return (
    <div className="w-full max-w-6xl rounded-[2rem] border border-emerald-400/30 bg-emerald-900/60 p-6 shadow-2xl">
      <div className="mb-6 flex justify-center gap-2">
        {[0, 1, 2, 3, 4].map((idx) => (
          <Card key={idx} card={communityCards[idx]} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <PlayerSeat key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
