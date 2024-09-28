import { useRecoilState } from 'recoil';
import { extractionInstancesState } from '../../hooks/instancesHook';
import { Link } from 'react-router-dom';

export const Approved = () => {
  const [instances] = useRecoilState(extractionInstancesState);

  const approvedInstances = instances.filter(
    (instance) => instance.status === 'approved'
  );

  if (!approvedInstances.length) {
    return (
      <div className="text-center text-white mt-8">No approved instances</div>
    );
  }

  return (
    <div className="mt-4">
      {approvedInstances.map((instance) => (
        <div
          className="rounded border-2 p-6 bg-background text-white shadow-lg flex items-center justify-between mb-4"
          key={instance.uid}
        >
          <div>{instance.name}</div>
          <Link to={`/${instance.uid}`}>
            <p className="text-accent">
              <u>View</u>
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
};
