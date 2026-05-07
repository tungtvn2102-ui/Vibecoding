interface ControlsProps {
  onNewHand: () => void;
  onDealFlop: () => void;
  onDealTurn: () => void;
  onDealRiver: () => void;
  onReset: () => void;
  onAnalyze: () => void;
}

const buttonStyle =
  'rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600';

export default function Controls(props: ControlsProps): JSX.Element {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <button className={buttonStyle} onClick={props.onNewHand}>New Hand</button>
      <button className={buttonStyle} onClick={props.onDealFlop}>Deal Flop</button>
      <button className={buttonStyle} onClick={props.onDealTurn}>Deal Turn</button>
      <button className={buttonStyle} onClick={props.onDealRiver}>Deal River</button>
      <button className={buttonStyle} onClick={props.onAnalyze}>Analyze Odds</button>
      <button className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white" onClick={props.onReset}>Reset</button>
    </div>
  );
}
