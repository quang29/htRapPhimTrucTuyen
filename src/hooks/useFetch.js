import { useState, useEffect } from "react";
import tmdbAxios from "../api/tmdbAxios";
//file nay dung de lam 1 ham tai su dung de goi du lieu la 1 danh sach phim tu tmdb 1 cach gon gang
// endpoint(duoi url): /movie/popular, /movie/top_rated,...
const useFetch = (endpoint) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
          const response = await tmdbAxios.get(endpoint)
            setLoading(false)
            // luu thong tin tra ve vao data
          setData(response.data.results)
    
        } catch (error) {
          console.error("error", error)
        }
      }

    useEffect(() => {
        fetchData()
    }, [endpoint])

    return { data, loading }
}

export default useFetch