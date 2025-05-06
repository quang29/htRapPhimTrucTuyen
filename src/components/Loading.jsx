import { FaSpinner } from 'react-icons/fa';

function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <FaSpinner className="animate-spin text-6xl text-white mb-4" />
      <p className="text-xl text-white">Loading, please wait...</p>
    </div>
  );
}

export default Loading;
