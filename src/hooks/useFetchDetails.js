import { useState, useEffect } from "react";
import axios from 'axios'
import tmdbAxios from "../api/tmdbAxios";

const useFetchDetails = (endpoint) => {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
          const response = await tmdbAxios.get(endpoint)
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