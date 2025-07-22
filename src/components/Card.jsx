import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { GENRE_MAP } from '../constants/genreMap'

const Card = ({data,trending,index,media_type}) => { // nhan cac props tu component cha do la Home.jsx, HorizontalScroll.jsx
    const imageURL = useSelector(state => state.movieData.imageURL) // lay URL anh tu redux store(duoc fetch o App.jsx)
    const mediaType = data.media_type ?? media_type ?? "movie" // lay media_type tu data, neu khong co thi lay tu props media_type, neu khong co thi mac dinh la "movie"
    const title = data?.title || data?.name || data?.original_title || data?.original_name || "Untitled";

    const typeLabel = mediaType === "movie" ? "Movie" : "TV Show"
    const genreNames = (data.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean)// chuyen doi id the loai sang ten the loai
    const genreText = genreNames.slice(0, 2).join(", ") || (mediaType === "movie" ? "Movie" : "TV Show") // lay 2 the loai dau tien, neu khong co the loai nao thi hien thi "Movie" hoac "TV Show" tuong ung voi mediaType

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