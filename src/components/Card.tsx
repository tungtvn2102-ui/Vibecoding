import type { PlayingCard } from '../lib/types';

interface CardProps {
  card?: PlayingCard;
}

export default function Card({ card }: CardProps): JSX.Element {
  if (!card) {
    return <div className="h-16 w-12 rounded-lg border border-dashed border-slate-500 bg-slate-800/60" />;
  }

  const isRed = card.suit === '♥' || card.suit === '♦';

  return (
    <div className="h-16 w-12 rounded-lg bg-slate-100 p-1 text-sm font-bold shadow-md">
      <div className={isRed ? 'text-red-600' : 'text-slate-900'}>
        {card.rank}
        {card.suit}
      </div>
    </div>
  );
}
