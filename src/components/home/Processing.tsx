import { useRecoilState } from 'recoil';
import { extractionInstancesState } from '../../hooks/instancesHook';
import { Ping } from '../UI/Ping';

export const Processing = () => {
  const [instances] = useRecoilState(extractionInstancesState);

  const processingInstances = instances.filter(
    (instance) => instance.status === 'processing'
  );

  if (!processingInstances.length) {
    return (
      <div className="text-center text-white mt-8">No processing instances</div>
    );
  }

  return (
    <div className="mt-4">
      {processingInstances.map((instance) => (
        <div className="rounded border-2 p-6 bg-background text-white shadow-lg flex items-center justify-between mb-4">
          <div>{instance.name}</div>
          <Ping />
        </div>
      ))}
    </div>
  );
};
