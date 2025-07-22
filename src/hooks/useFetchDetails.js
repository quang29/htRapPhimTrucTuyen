import { useState, useEffect } from "react";
import tmdbAxios from "../api/tmdbAxios";
// cung nhu useFetch nhung file nay dung de goi du lieu chi tiet cua 1 phim tu tmdb
const useFetchDetails = (endpoint) => {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
          const response = await tmdbAxios.get(endpoint)// endpoint la đuôi của url trên tmdb
            setLoading(false)
          setData(response.data)
    
        } catch (error) {
          console.error("error", error)
        }
      }

    useEffect(() => {
        fetchData()
    }, [endpoint])

    return { data, loading }
}

export default useFetchDetails