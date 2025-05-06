import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../components/Card'


const SearchPage = () => {
  const location = useLocation()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const navigate = useNavigate() 
  
  const query = location?.search?.slice(3)

  const fetchData = async () => {
    try {
      const response = await axios.get(`search/multi`, {
        params: {
          query: location?.search?.slice(3),
          page: page
        }
      })
      setData((prev)=>{
        return [
          ...prev, 
          ...response.data.results
        ]
      })

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(query) {
      setPage(1)
      setData([])
      fetchData()
    }
  }, [location?.search])

    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return
      if (pageNo < totalPages) {
        setPage((prev) => prev + 1)
      }
    }
  
    useEffect(() => {
      if(query) {
        fetchData()
      }
    }, [page])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }
  , [page])

  return (
    <div className='py-16'>

      <div className='lg:hidden my-2 px-3 sticky top-[70px] z-30'>
        <input 
          type="text" 
          className='w-full px-3 py-1 text-lg rounded-full bg-white text-neutral-900 outline-none'
          placeholder='Search...'
          onChange={(e)=>navigate(`/search?q=${e.target.value}`)}
          value={query?.split("%20").join(" ")}
          autoFocus
        />
      </div>
      <div className='container mx-auto'>
      <h3 className='capitalize text-lg font-semibold my-3'>Search Results</h3>

      <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
          {
            data.map((searchData, index) => {
              return(
                <Card data={searchData} key={searchData.id + "search"} media_type={searchData.media_type}/>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default SearchPage