import { useRecoilState } from 'recoil';
import { extractionInstancesState } from '../../hooks/instancesHook';
import { Link } from 'react-router-dom';

export const Errors = () => {
  const [instances] = useRecoilState(extractionInstancesState);

  const errorInstances = instances.filter(
    (instance) => instance.status === 'error'
  );

  if (!errorInstances.length) {
    return (
      <div className="text-center text-white mt-8">No error instances</div>
    );
  }

  return (
    <div className="mt-4">
      {errorInstances.map((instance) => (
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
