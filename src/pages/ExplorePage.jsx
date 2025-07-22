import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import tmdbAxios from '../api/tmdbAxios'

const ExplorePage = () => {
  const params = useParams()// lay cac tham so nhu explore va id tu url
  console.log("params", params.explore)
  const [pageNo, setPageNo] = useState(1)// so trang hien tai
  const [data, setData] = useState([]) // mang chua danh sach phim da goi
  const [totalPages, setTotalPages] = useState(0) // tong so trang ma API tra ve

  // Ham fetchData de goi API va lay du lieu
  const fetchData = async () => {
    try {
      const response = await tmdbAxios.get(`/discover/${params.explore}`, { // /discover/movie or /tv 
        params: {
          page: pageNo
        }
      })
      setData((prev)=>{ // noi them du lieu moi vao mang data cu(dung khi load them trang)
        return [
          ...prev, 
          ...response.data.results
        ]
      })
      setTotalPages(response.data.total_pages) // luu tong so trang de biet khi nao dung scroll
    } catch (error) {
      console.log(error)
    }
  }

  // goi them du lieu khi cuon den cuoi trang
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return // kiem tra neu da den cuoi trang chua
    if (pageNo < totalPages) {
      setPageNo((prev) => prev + 1) // neu chua den trang cuoi cung, tang pageNo len 1 de goi API tiep
    }
  }

  // khi pageno thay doi, load them trang
  useEffect(() => {
    // if (params.explore === 'favorites') return;
    fetchData()
  }, [pageNo])

  // khi chuyen tu explore/tv sang explore/movie hoac nguoc lai, reset trang ve 1 va xoa data cu
  useEffect(() => {
    // if (params.explore === 'favorites') return;
    setPageNo(1)
    setData([])
    fetchData() 
  }, [params.explore])

  // lang nghe su kien cuon trang, neu den cuoi trang thi goi handleScroll
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