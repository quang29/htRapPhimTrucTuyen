import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { data } from 'react-router-dom'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const BannerHome = () => {
    const bannerData = useSelector(state => state.movieData.bannerData)
    const imageURL = useSelector(state => state.movieData.imageURL)
    const [currentImage, setCurrentImage] = useState(2)

    const handleNext = () => {
        if(currentImage < bannerData.length - 1) {
            setCurrentImage(currentImage + 1)
        }
    }

    const handlePrevious = () => {
        if(currentImage > 0) {
            setCurrentImage(currentImage - 1)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(currentImage < bannerData.length - 1) {
                setCurrentImage(currentImage + 1)
            } else {
                setCurrentImage(0)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [currentImage])


  return (
    <section className='w-full h-full'>
        <div className='flex min-h-full max-h-[95vh] overflow-hidden'>
            {
                bannerData.map((data, index) => {
                    return (
                        <div key={data.id+'bannerHome'+index} className='min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all' style={{transform: `translateX(-${currentImage * 100}%)`}}>
                            <div className='w-full h-full'>
                                <img 
                                    src={imageURL + data.backdrop_path} alt="banner"
                                    className='w-full h-full object-cover object-top'
                                />
                            </div>

                            {/*next&previous button*/}
                            <div className='absolute top-0 left-0 w-full h-full hidden items-center justify-between px-3 group-hover:lg:flex'>
                                <button onClick={handlePrevious} className='text-2xl z-10 cursor-pointer opacity-50 hover:brightness-70'><FaAngleLeft /></button>
                                <button onClick={handleNext} className='text-2xl z-10 cursor-pointer opacity-50 hover:brightness-70'><FaAngleRight /></button>
                            </div>

                            <div className='absolute top-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent'></div>

                            <div className='container mx-auto'>
                            <div className='w-full px-3 absolute bottom-0 max-w-md'>
                                <h2 className='text-2xl font-bold lg:text-4xl text-white drop-shadow-2xl'>{data?.title || data?.name}</h2>
                                <p className='text-ellipsis line-clamp-3 my-2'>{data.overview}</p>
                                <div className='flex items-center gap-4'>
                                    <p>Rating : { Number(data.vote_average).toFixed(1) }+</p>
                                    <span>|</span>
                                    <p>
                                        {data.release_date || data.first_air_date? new Date(data.release_date || data.first_air_date).getMonth() + 1 + "/" + new Date(data.release_date || data.first_air_date).getFullYear() : "N/A"}
                                    </p>

                                    </div>
                                    <button className="bg-white px-4 py-2 text-black font-bold rounded mt-4 shadow-md transition-all hover:brightness-50 cursor-pointer hover:scale-105">Play</button>

                            </div>
                            </div>

                        </div>
                    )
        })
            }
        </div>
        </section>
  )
}

export default BannerHome