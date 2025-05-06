import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Card from '../components/Card'

const ExplorePage = () => {
  const params = useParams()
  console.log("params", params.explore)
  const [pageNo, setPageNo] = useState(1)
  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  const fetchData = async () => {
    try {
      const response = await axios.get(`/discover/${params.explore}`, {
        params: {
          page: pageNo
        }
      })
      setData((prev)=>{
        return [
          ...prev, 
          ...response.data.results
        ]
      })
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.log(error)
    }
  }

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return
    if (pageNo < totalPages) {
      setPageNo((prev) => prev + 1)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pageNo])

  useEffect(() => {
    setPageNo(1)
    setData([])
    fetchData() 
  }, [params.explore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }
  , [pageNo])

  return (
    <div className='pt-16'>
      <div className='container mx-auto'>
        <h3 className='capitalize text-lg font-semibold my-3'>Popular {params.explore} Show</h3>

        <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
          {
            data.map((exploreData, index) => {
              return(
                <Card data={exploreData} key={exploreData.id + "exploreSection"} media_type={params.explore}/>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default ExplorePage