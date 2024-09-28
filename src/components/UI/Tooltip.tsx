import type { ReactNode } from 'react';
import { useState } from 'react';

interface Props {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ content, children, position = 'top' }: Props) => {
  const [visible, setVisible] = useState(false);

  let baseTooltipClasses =
    'absolute p-2 bg-black text-white text-xs rounded shadow-md';

  switch (position) {
    case 'top':
      baseTooltipClasses +=
        ' -bottom-full left-1/2 transform -translate-x-1/2 mb-12 z-10';
      break;
    case 'right':
      baseTooltipClasses +=
        ' left-full top-1/2 transform -translate-y-1/2 ml-2 z-10';
      break;
    case 'bottom':
      baseTooltipClasses +=
        ' top-full left-1/2 transform -translate-x-1/2 mt-2 z-10';
      break;
    case 'left':
      baseTooltipClasses +=
        ' -right-full top-1/2 transform -translate-y-1/2 mr-2 z-10';
      break;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && <p className={baseTooltipClasses}>{content}</p>}
      {children}
    </div>
  );
};
