import { useRecoilState } from 'recoil';
import { extractionInstancesState } from '../../hooks/instancesHook';
import { ExtractionInstance } from '../../types/extraction';

interface Props {
  onChange: (tab: string) => void;
  activeTab: string;
  tabs: string[];
}

const getTabCount = (instances: ExtractionInstance[], tab: string) => {
  if (tab === 'Processing') {
    return `${
      instances.filter((instance) => instance.status === 'processing').length
    }`;
  }

  if (tab === 'Review') {
    return `${
      instances.filter((instance) => instance.status === 'review').length
    }`;
  }

  if (tab === 'Approved') {
    return `${
      instances.filter((instance) => instance.status === 'approved').length
    }`;
  }

  if (tab === 'Rejected') {
    return `${
      instances.filter((instance) => instance.status === 'rejected').length
    }`;
  }

  if (tab === 'Errors') {
    return `${
      instances.filter((instance) => instance.status === 'error').length
    }`;
  }

  return '';
};

export const TabNavbar = ({ onChange, activeTab, tabs }: Props) => {
  const [instances] = useRecoilState(extractionInstancesState);

  return (
    <div className="w-full mx-auto mt-10 flex justify-center">
      <div className="flex w-fit space-x-2 border-b border-gray-300">
        {tabs.map((tab, index) => {
          const count = getTabCount(instances, tab);
          return (
            <button
              key={index}
              onClick={() => onChange(tab)}
              className={`px-4 py-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {`${tab} ${count && `(${count})`}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};
