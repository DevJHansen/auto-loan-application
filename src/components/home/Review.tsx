import { useRecoilState } from 'recoil';
import { extractionInstancesState } from '../../hooks/instancesHook';
import { Link } from 'react-router-dom';

export const Review = () => {
  const [instances] = useRecoilState(extractionInstancesState);

  const reviewInstances = instances.filter(
    (instance) => instance.status === 'review'
  );

  if (!reviewInstances.length) {
    return (
      <div className="text-center text-white mt-8">
        No instances ready for review
      </div>
    );
  }

  return (
    <div className="mt-4">
      {reviewInstances.map((instance) => (
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
