import React from 'react'
import { FaDoorClosed } from "react-icons/fa";
import useFetchDetails from '../hooks/useFetchDetails'

const Videoplay = ({data, close, media_type}) => { // nhan cac props tu component cha do la DetailsPage.jsx
  const { data : videoData } = useFetchDetails(`/${media_type}/${data?.id}/videos`) // goi hook useFetchDetails de lay du lieu video tu API
  return (
    <section className='fixed bg-black top-0 right-0 left-0 bottom-0 z-50 flex items-center justify-center'>
      <div className='bg-black w-full max-h-[80vh] max-w-screen-lg aspect-video rounded relative'>
        <button onClick={close} className='absolute -top-10 right-0 text-3xl cursor-pointer z-50'>
          <FaDoorClosed/>
        </button>

        <iframe 
          src={`https://www.youtube.com/embed/${videoData?.results[0]?.key}`}
          className='w-full h-full rounded'
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen="true"
        />
        
      </div>

    </section>
  )
}

export default Videoplay