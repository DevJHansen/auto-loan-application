interface Props {
  label: string;
  labelColor?: string;
  stat: string | number;
  classes?: string;
}

export const StatCard = ({
  label,
  labelColor = 'text-primary',
  stat,
  classes = '',
}: Props) => {
  return (
    <div className={`p-4 rounded-md shadow-xl bg-white min-w-32 ${classes}`}>
      <p className={`text-sm font-bold ${labelColor}`}>{label}</p>
      <h1 className="text-2xl">{stat}</h1>
    </div>
  );
};
