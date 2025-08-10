import React from 'react';
import { useTheme } from '../../hooks/useTheme';

function TagChip({ tags = [], color = 'bg-gray-200', textColor = 'text-gray-800' }) {
  // tags: array of objects {id: string, name: string}
  // color: Tailwind background color class (fallback if theme not used)
  // textColor: Tailwind text color class (fallback if theme not used)
  
  const { getColor } = useTheme();
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={tag.id || tag.name || index}
          className="inline-flex items-center rounded-full font-medium"
          style={{
            fontSize: '0.9em',
            padding: '0.3em 0.9em',
            lineHeight: 1.2,
            backgroundColor: getColor('background.tertiary'),
            color: getColor('text.secondary'),
          }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}

export default TagChip;



