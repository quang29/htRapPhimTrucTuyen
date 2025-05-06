import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Card = ({data,trending,index,media_type}) => {
    const imageURL = useSelector(state => state.movieData.imageURL)
    const mediaType = data.media_type ?? media_type ?? "movie"

  return (
    <Link to={`/${mediaType}/${data.id}`} className='w-full min-w-[230px] max-w-[230px] h-80 overflow-hidden block rounded relative hover:scale-110 transition-transform duration-300 ease-in-out'>
        
        {
          data?.poster_path ? (
            <img src={imageURL+data?.poster_path}/>
          ) : (
            <div className=' bg-gray-800 w-full h-full flex justify-center items-center '>
              <h1 className='text-white text-2xl font-semibold'>{data?.name || data?.title}</h1>
            </div> 
          )
        }

        <img src={imageURL+data?.poster_path}/>

        <div className='absolute top-4'>
            {trending && (
                <div className="text-white text-5xl font-black opacity-50"> {/*py-1 px-4 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden*/}
                    #{index}
                </div>
                        )
            }
        </div>

    </Link>
  )
}

export default Card