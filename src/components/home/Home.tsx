import { NewInstance } from './NewInstance';
import { PageHeading } from '../UI/PageHeading';
import { TabNavbar } from '../UI/TabNavBar';
import { useInstances } from '../../hooks/instancesHook';
import { Processing } from './Processing';
import { Review } from './Review';
import { atom, useRecoilState } from 'recoil';
import { Approved } from './Approved';
import { Rejected } from './Rejetcted';
import { Errors } from './Errors';

const tabs = [
  'New Instance',
  'Processing',
  'Review',
  'Approved',
  'Rejected',
  'Errors',
];

const navState = atom({
  key: 'navState',
  default: 'New Instance',
});

export const Home = () => {
  const [display, setDisplay] = useRecoilState(navState);
  useInstances();

  return (
    <>
      <div className="sidebar-spacing py-8 min-h-screen">
        <main className="flex-1 p-6 overflow-auto">
          <PageHeading
            title={`Welcome`}
            description="Manage your extraction instances"
          />
          <div className="flex items-center justify-center w-full">
            <div className="w-fit">
              <TabNavbar
                onChange={setDisplay}
                activeTab={display}
                tabs={tabs}
              />
              {display === 'New Instance' && <NewInstance />}
              {display === 'Processing' && <Processing />}
              {display === 'Review' && <Review />}
              {display === 'Approved' && <Approved />}
              {display === 'Rejected' && <Rejected />}
              {display === 'Errors' && <Errors />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
