import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import tmdbAxios from '../api/tmdbAxios';
import { Switch } from '@headlessui/react';
import { toast } from 'react-hot-toast';

const SearchPage = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const navigate = useNavigate();

  const [data, setData] = useState([]); // ket qua phim hien thi khi tim kiem
  const [page, setPage] = useState(1); // so trang hien tai
  const [totalPages, setTotalPages] = useState(1); // tong so trang ket qua tim kiem
  const [useAISearch, setUseAISearch] = useState(false); // khi bat tim kiem bang AI thi true
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null); // cooldown 5 giay cho AI search

  // Lấy query từ URL, nếu không có thì là chuỗi rỗng
  const params = new URLSearchParams(location.search);
  const query = params.has('q') ? params.get('q') : '';

  // Normal search
  const fetchData = async () => {
    try {
      const response = await tmdbAxios.get(`search/multi`, { // goi tmdb API
        params: {
          query: query,
          page: page,
        },
      });

      setData((prev) => page === 1 ? response.data.results : [...prev, ...response.data.results]); // nếu là trang 1 thì set lại data, nếu không thì nối thêm kết quả mới
      setTotalPages(response.data.total_pages || 1); // nếu không có total_pages thì mặc định là 1
    } catch (error) {
      console.log('❌ Error fetching search results:', error);
    }
  };

  // AI search
  const fetchAIData = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/ai-search', { query }); // gui query sang ai-search 
      if (res.data.keywords && res.data.keywords.length > 0) { // nhan lai keywords tu AI, lay tu khoa dau tien
        const tmdbRes = await tmdbAxios.get('search/multi', { // goi tmdb API de tim phim voi tu khoa do
          params: {
            query: res.data.keywords[0],
            page: 1,
          },
        });
        setData(tmdbRes.data.results);// luu ket qua vao state
        setTotalPages(tmdbRes.data.total_pages || 1);
      } else {
        setData([]);
      }
    } catch (err) {
      setLoading(false);
      setData([]);
      toast.error("AI Search failed. Please try again or use normal search.");
    }
    setLoading(false);
  };

  // Handle search when query or AI toggle changes
  useEffect(() => {
    setPage(1);
    setData([]); // reset data when query changes
    if (!query) return;

    if (useAISearch) { // doi 5 giay truoc khi goi AI search
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fetchAIData();
      }, 5000);
    } else {
      fetchData();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, useAISearch]);

  // Load more for normal search
  useEffect(() => {
    if (page > 1 && query && !useAISearch) {
      fetchData();
    }
  }, [page]);

  // Infinite scroll chi danh cho tim kiem thuong
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        if (page < totalPages && !loading && !useAISearch) { // chỉ load thêm khi không dùng AI search, chua toi trang cuoi va khong dang loading
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);// Thêm sự kiện scroll để load thêm dữ liệu khi cuộn xuống
    return () => window.removeEventListener('scroll', handleScroll);// Xoá sự kiện khi component unmount
  }, [page, totalPages, loading, useAISearch]);

  return (
    <div className='py-16 relative'>
      {/* Toggle AI Search ở góc phải */}
      <div className="absolute top-4 right-4 flex flex-col items-end lg:mt-12 not-lg:mt-28 z-10">
        <div className='flex items-center gap-2'>
          <Switch
            checked={useAISearch}
            onChange={setUseAISearch}
            className={`${useAISearch ? 'bg-blue-600' : 'bg-gray-400'}
              relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span className="sr-only">Enable AI Search</span>
            <span
              className={`${
                useAISearch ? 'translate-x-7' : 'translate-x-1'
              } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className='text-white font-medium text-lg select-none'>
            AI Search
          </span>
        </div>
        {useAISearch && (
          <span className='text-blue-400 text-sm mt-2 text-right'>
            (Will search after 5 seconds to avoid API limit)
          </span>
        )}
      </div>
      {/* thanh tim kiem cho mobile */}
      <div className='lg:hidden my-2 px-3 sticky top-[70px] z-30'>
        <input
          type='text'
          className='w-full px-3 py-2 text-lg rounded-full bg-white text-neutral-900 outline-none shadow'
          placeholder='Search for movies, TV shows...'
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              navigate(`/search?q=${value}`);
            } else {
              navigate('/search');
            }
          }}
        />
      </div>
      {query && (
        <div className='px-3 mb-4'>
          <h2 className='text-xl font-semibold text-white not-lg:mt-17'>
            Search Results for: <span className='text-blue-400'>{query}</span>
          </h2>
        </div>
      )}
      {loading ? (
        <div className='flex flex-col items-center justify-center py-10'>
          <div className="relative flex items-center justify-center mb-3">
            <svg className="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            {useAISearch && (
              <span className="absolute left-full ml-3 text-blue-400 font-semibold flex items-center gap-2">
                <span className="bg-blue-900/80 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <svg width="16" height="16" fill="currentColor" className="inline-block mr-1"><circle cx="8" cy="8" r="8" fill="#1976D2"/></svg>
                  AI is thinking...
                </span>
              </span>
            )}
          </div>
          <div className='text-white text-lg'>
            {useAISearch ? "Searching with AI, please wait..." : "Searching..."}
          </div>
        </div>
      ) : (
        <div className={`flex flex-wrap gap-4 justify-center ${useAISearch ? "bg-gradient-to-br from-blue-900/60 to-black/80 p-6 rounded-xl" : ""}`}>
          {data.length === 0 && query ? (
            <div className='text-gray-400 text-lg py-10'>No results found.</div>
          ) : (
            data.map((item, idx) => (
              <div key={item.id || idx} className={useAISearch ? "relative" : ""}>
                {/* {useAISearch && (
                  <span className="absolute -top-3 -left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow">
                    <svg width="14" height="14" fill="currentColor"><circle cx="7" cy="7" r="7" fill="#fff"/><text x="7" y="11" textAnchor="middle" fontSize="10" fill="#1976D2" fontWeight="bold">AI</text></svg>
                    AI
                  </span>
                )} */}
                <Card data={item} index={idx + 1} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
