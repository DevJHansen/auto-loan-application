import { MdArrowLeft } from 'react-icons/md';

interface PageHeadingProps {
  title: string;
  description: string;
  backIconClick?: () => void;
  children?: React.ReactNode;
}

export const PageHeading = ({
  title,
  description,
  backIconClick,
  children,
}: PageHeadingProps) => (
  <section className="pb-8 border-b-gray-300 border-b-[1px]">
    <div className="flex items-center">
      {backIconClick && (
        <MdArrowLeft
          className="clickable-icon mr-8 border-[1px] border-primary rounded-full text-gray- hover:bg-black hover:shadow-accent hover:text-accent hover:border-accent hover:shadow-md"
          size={48}
          onClick={backIconClick}
        />
      )}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-gray-400">{description}</p>
        {children}
      </div>
    </div>
  </section>
);
