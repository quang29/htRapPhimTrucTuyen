import React from 'react'
import Card from './Card'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useRef } from 'react'

const HorizontalScroll = ({data = [], heading, trending, media_type}) => {
    const containerRef = useRef(null)


  return (
    <div className='container mx-auto px-3 my-10'>

    <h2 className='text-xl lg:text-2xl font-bold mb-3 text-white capitalize'>{heading}</h2>

    <div className='relative'>
        {/*horizontal scroll container*/}
        <div ref={containerRef} className='grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-hidden overflow-x-scroll relative z-10 scroll-smooth trasaction-all scroll-bar-none'>
    {
      data.map((data, index) => {
        return (
          <Card key={data.id+'heading'+index} data={data} index={index+1} trending={trending} media_type={media_type}/>
        )
      })
    }
        </div>
        {/*scroll buttons*/}
        <div className='absolute top-0 left-0 w-full h-full hidden items-center justify-between px-3 lg:flex'>
            <button className='text-2xl z-10 cursor-pointer opacity-50 hover:brightness-70'>
                <FaAngleLeft onClick={() => containerRef.current.scrollLeft -= 250}/>
            </button>
            <button className='text-2xl z-10 cursor-pointer opacity-50 hover:brightness-70'>
                <FaAngleRight onClick={() => containerRef.current.scrollLeft += 250}/>
            </button>
        </div>
    </div>

  </div>
  )
}

export default HorizontalScroll