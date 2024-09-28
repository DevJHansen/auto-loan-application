import { MdBlock, MdReport } from 'react-icons/md';

interface Props {
  type: 'error' | 'empty';
  message: string;
}

export const UnfavorableFetchResult = ({ type, message }: Props) => {
  return (
    <div className="w-full mt-[20vh] flex flex-col items-center justify-center">
      {type === 'error' ? (
        <MdReport className="text-accent" size={64} />
      ) : (
        <MdBlock className="text-accent" size={64} />
      )}
      <p className="mt-4  text-xl font-bold">{message}</p>
    </div>
  );
};
