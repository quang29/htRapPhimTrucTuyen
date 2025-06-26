import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import tmdbAxios from '../api/tmdbAxios';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = new URLSearchParams(location.search).get('q');

  const fetchData = async () => {
    try {
      const response = await tmdbAxios.get(`search/multi`, {
        params: {
          query: query,
          page: page,
        },
      });

      setData((prev) => [...prev, ...response.data.results]);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.log('❌ Error fetching search results:', error);
    }
  };

  useEffect(() => {
    if (query) {
      setPage(1);
      setData([]);
      fetchData();
    }
  }, [query]);

  useEffect(() => {
    if (page > 1 && query) {
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        if (page < totalPages) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, totalPages]);

  return (
    <div className='py-16'>
      <div className='lg:hidden my-2 px-3 sticky top-[70px] z-30'>
        <input
          type='text'
          className='w-full px-3 py-1 text-lg rounded-full bg-white text-neutral-900 outline-none'
          placeholder='Search...'
          onChange={(e) => navigate(`/search?q=${e.target.value}`)}
          value={query || ''}
          autoFocus
        />
      </div>

      <div className='container mx-auto'>
        <h3 className='capitalize text-lg font-semibold my-3'>Search Results</h3>

        <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
          {data.map((searchData) => (
            <Card
              data={searchData}
              key={searchData.id + 'search'}
              media_type={searchData.media_type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
