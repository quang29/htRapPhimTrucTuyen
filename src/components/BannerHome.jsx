import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from 'react-router-dom'
// du lieu bannerData va imageURL se duoc lay tu redux store va lay du lieu tu tmdb o trang app.jsx
const BannerHome = () => {
    const bannerData = useSelector(state => state.movieData.bannerData)// lay du lieu bannerData tu redux store
    const imageURL = useSelector(state => state.movieData.imageURL)
    const [currentImage, setCurrentImage] = useState(2)//anh dang hien thi la so 3

    // ham chuyen tiep hinh anh
    const handleNext = () => {
        if(currentImage < bannerData.length - 1) {
            setCurrentImage(currentImage + 1)
        }
    }

    // ham quay lai hinh anh
    const handlePrevious = () => {
        if(currentImage > 0) {
            setCurrentImage(currentImage - 1)
        }
    }

    // tu dong chuyen tiep hinh anh sau 5 giay
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
    <section className='w-full h-screen relative overflow-hidden'>
        <div className='flex h-full overflow-hidden'>
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
                            <div className='absolute top-0 left-0 w-full h-full items-center justify-between px-3 hidden lg:flex'> {/*absolute top-0 left-0 w-full h-full hidden items-center justify-between px-3 group-hover:lg:flex*/}
                                <button onClick={handlePrevious} className='text-2xl z-10 cursor-pointer opacity-50 hover:brightness-70'><FaAngleLeft /></button>
                                <button onClick={handleNext} className='text-2xl z-10 cursor-pointer opacity-50 hover:brightness-70'><FaAngleRight /></button>
                            </div>

                            {/*overlay*/}
                            <div className='absolute top-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent'></div>
                            {/*content*/}
                            <div className='container mx-auto'>
                            <div className='w-full px-3 absolute bottom-10 left-0 max-w-xl text-left lg:pl-16'>
                                <h2 className='text-2xl font-bold lg:text-4xl text-white drop-shadow-2xl'>{data?.title || data?.name}</h2>
                                <p className='text-ellipsis line-clamp-3 my-2'>{data.overview}</p>
                                {/* <div className='flex items-center gap-4'>
                                    <p>Rating : { Number(data.vote_average).toFixed(1) }+</p>
                                    <span>|</span>
                                    <p>
                                        {data.release_date || data.first_air_date? new Date(data.release_date || data.first_air_date).getMonth() + 1 + "/" + new Date(data.release_date || data.first_air_date).getFullYear() : "N/A"}
                                    </p>
                                    </div> */}
                                    <Link to={"/"+data?.media_type+"/"+data.id}>
                                        <button 
                                            className="bg-white px-4 py-2 text-black text-xl font-bold rounded mt-4 shadow-md transition-all hover:brightness-50 cursor-pointer hover:scale-105"
                                            >▶ Play
                                        </button>
                                    </Link>

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