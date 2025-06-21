import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { GENRE_MAP } from '../constants/genreMap'

const Card = ({data,trending,index,media_type}) => {
    const imageURL = useSelector(state => state.movieData.imageURL)
    const mediaType = data.media_type ?? media_type ?? "movie"
    const title = data?.title || data?.name || data?.original_title || data?.original_name || "Untitled";

     // Lấy thể loại từ genre_ids nếu có
    const typeLabel = mediaType === "movie" ? "Movie" : "TV Show"
    const genreNames = (data.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean)
    const genreText = genreNames.slice(0, 2).join(", ") || (mediaType === "movie" ? "Movie" : "TV Show")

  return (
    <Link to={`/${mediaType}/${data.id}`} className='w-full min-w-[230px] max-w-[230px] h-80 overflow-hidden block rounded relative hover:scale-110 transition-transform duration-300 ease-in-out group'>
        
        {
          data?.poster_path ? (
            <img className='w-full h-full object-cover' src={imageURL+data?.poster_path} alt={data?.title || data?.name} loading="lazy"/>
          ) : (
            <div className=' bg-gray-800 w-full h-full flex justify-center items-center '>
              <h1 className='text-white text-2xl font-semibold'>{data?.name || data?.title}</h1>
            </div> 
          )
        }

        {/* Hiện số thứ tự trending nếu có */}
        <div className='absolute top-4'>
            {trending && (
                <div className="text-white text-5xl font-black opacity-50"> {/*py-1 px-4 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden*/}
                    #{index}
                </div>
                        )
            }
        </div>
      {/* Hover info */}
      <div
        className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black via-black/60 to-transparent
        text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <h3 className="text-base font-bold truncate">{title}</h3>
        <p className="text-xs opacity-80">{typeLabel} • {genreText}</p>
      </div>
    </Link>
  )
}

export default Card