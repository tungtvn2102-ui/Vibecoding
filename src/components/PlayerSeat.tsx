import type { Player } from '../lib/types';
import Card from './Card';

export default function PlayerSeat({ player }: { player: Player }): JSX.Element {
  return (
    <div className="min-w-48 rounded-2xl bg-slate-900/70 p-4 text-slate-100 ring-1 ring-slate-500/40">
      <div className="mb-2 text-sm font-semibold">{player.name}</div>
      <div className="mb-3 flex gap-2">
        <Card card={player.holeCards[0]} />
        <Card card={player.holeCards[1]} />
      </div>
      <div className="space-y-1 text-xs text-slate-200">
        <div>Win: {player.winChance.toFixed(2)}%</div>
        <div>Tie: {player.tieChance.toFixed(2)}%</div>
        <div>Best Hand: {player.handStrengthLabel}</div>
      </div>
    </div>
  );
}
