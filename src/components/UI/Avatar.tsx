import { MdEdit, MdPhoto } from 'react-icons/md';
import { getAuthedFileUrl } from '../../backend/storage';
import { useEffect, useState } from 'react';

interface Props {
  url: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Avatar = ({ url, handleChange }: Props) => {
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const getUrl = async () => {
      if (url.startsWith('https://')) {
        const res = await getAuthedFileUrl(url);
        setAuthUrl(res);
        return;
      }

      setAuthUrl(url);
    };

    getUrl();
  }, [url]);

  return (
    <div className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      {authUrl ? (
        <img
          src={authUrl}
          alt="Selected"
          className="object-cover w-full h-full rounded-lg shadow-md"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <MdPhoto className="text-4xl" />
          <span>No Image Selected</span>
        </div>
      )}
      <label className="absolute bottom-2 right-2 cursor-pointer bg-white p-2 rounded-full shadow-md">
        <MdEdit className="text-primary" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};
