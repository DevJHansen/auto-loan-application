import { Link } from 'react-router-dom';

interface InfoCardProps {
  title: string;
  description: string;
  link: string;
}

export const InfoCard = ({ title, description, link }: InfoCardProps) => (
  <Link to={link}>
    <div className="p-4 border-gray-300 border-[1px] rounded-lg hover:shadow-md hover:shadow-accent hover:border-accent overflow-hidden">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 whitespace-nowrap">{description}</p>
    </div>
  </Link>
);
