import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetchDetails from '../hooks/useFetchDetails'
import { useSelector } from 'react-redux'
import Loading from '../components/Loading'
import moment from 'moment'
import useFetch from '../hooks/useFetch'
import HorizontalScroll from '../components/HorizontalScroll'
import Videoplay from '../components/Videoplay'



const DetailsPage = () => {
  const params = useParams()
  const imageURL = useSelector(state => state.movieData.imageURL)
  const {data} = useFetchDetails(`/${params?.explore}/${params?.id}`)
  const {data : castData} = useFetchDetails(`/${params?.explore}/${params?.id}/credits`)
  const {data : similarData} = useFetch(`/${params?.explore}/${params?.id}/similar`)
  const {data : recomendationData} = useFetch(`/${params?.explore}/${params?.id}/recommendations`)
  const [playVideo, setPlayVideo] = useState(false)
  const [playvideoId, setplayVideoId] = useState("")
  // const [videoData, setVideoData] = useState(null)

  console.log(data)
  console.log(castData)

  if (!data) {
    return <Loading />; 
  }

  const duration = (Number(data.runtime)/60).toFixed(1).split(".")

  return (
    <div>
        <div className='w-full h-[450px] relative hidden lg:block'>
            <div className='absolute top-0 w-full h-full bg-gradient-to-t from-black/90 to-transparent'></div>
            <div className='w-full h-full'>
              <img 
                src={imageURL + data?.backdrop_path} 
                alt="banner" 
                className='w-full h-full object-cover object-top' 
              />
            </div>
        </div>

        <div className='container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10'>
          <div className='relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60'>
          <img 
                src={imageURL + data?.poster_path} 
                alt="banner" 
                className='h-80 w-60 object-cover rounded' 
          />
          <button className='mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-tl from-white to-black hover:scale-105 transition-all cursor-pointer active:scale-95'>Play now</button>
          </div>

          <div className='flex flex-col justify-center gap-2'>
            <h2 className='text-2xl lg:text-4xl text-white font-bold'>{data.title || data.name}</h2>
            <p className='text-neutral-400'>{data.tagline}</p>
          

          <div className='flex items-center my-3 gap-3'>
            <p>
              Release Date : {moment(data.release_date).format("DD-MM-YYYY")}
            </p>
            <span> | </span>
            <p>
              Duration : {duration[0]}h {duration[1]}m
            </p>
          </div>
          <div>
            <h3 className='text-xl font-bold text-white mb-1'>Overview</h3>
            <p>{data.overview}</p>
          </div>

          <div>
            <p><span className='text-white'>Director</span> : {castData?.crew[0]?.name}</p>
          </div>

          <h2 className='font-bold text-lg'>Cast :</h2>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-5 my-4'>
            {
              castData?.cast?.filter(el => el?.profile_path).map((starCast, index) => {
                return(
                  <div>
                    <div>
                      <img
                        src={imageURL + starCast?.profile_path} 
                        className='w-24 h-24 object-cover rounded-full'
                        alt={starCast?.name}
                      />
                    </div>
                    <p className='font-bold text-center text-sm text-neutral-400'>{starCast?.name}</p>
                  </div>
                )
              })
            }
          </div>

          </div>
        </div>

        <div>
            <HorizontalScroll data={similarData} heading={"Similar " + params?.explore} media_type={params?.explore}/>
            <HorizontalScroll data={recomendationData} heading={"Recomendation " + params?.explore} media_type={params?.explore}/>
        </div>

        <Videoplay/>

    </div>
  )
}

export default DetailsPage