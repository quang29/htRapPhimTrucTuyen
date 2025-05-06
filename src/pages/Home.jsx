import React from 'react'
import BannerHome from '../components/BannerHome'
import { useSelector } from 'react-redux'
import Card from '../components/Card'
import HorizontalScroll from '../components/HorizontalScroll'
import axios from 'axios'
import { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'

const Home = () => {
  const trendingData = useSelector(state => state.movieData.bannerData)
  const { data : nowPlayingData } = useFetch('/movie/now_playing')
  const { data : topRatedData } = useFetch('/movie/top_rated')
  const { data : popularTvShowData } = useFetch('/tv/popular')
  const { data : onTheAirShowData } = useFetch('/tv/on_the_air')

  return (
    <div>
        <BannerHome/>
        <HorizontalScroll data={trendingData} heading='Trending Now' trending={true}/>
        <HorizontalScroll data={nowPlayingData} heading='Now Playing Movies' media_type={"movie"}/>
        <HorizontalScroll data={topRatedData} heading='Top Rated Movies' media_type={"movie"}/>
        <HorizontalScroll data={popularTvShowData} heading='Popular TV Shows' media_type={"tv"}/>
        <HorizontalScroll data={onTheAirShowData} heading='New TV Shows' media_type={"tv"}/>

    </div>
  )
}

export default Home