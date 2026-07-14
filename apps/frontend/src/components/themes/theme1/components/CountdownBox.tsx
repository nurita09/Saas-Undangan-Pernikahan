interface CountdownBoxProps {
  value: number;
  label: string;
}

export default function CountdownBox({ value, label }: CountdownBoxProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-semibold text-neutral-800 tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-neutral-500 mt-1">{label}</span>
    </div>
  );
}
