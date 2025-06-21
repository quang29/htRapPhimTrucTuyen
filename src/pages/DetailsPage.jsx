// src/pages/DetailsPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import AddToFavorites from '../components/AddToFavorites';
import useFetchDetails from '../hooks/useFetchDetails';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import HorizontalScroll from '../components/HorizontalScroll';
import Videoplay from '../components/VideoPlay';
import RatingButton from '../components/RatingButton';
import { useSubscriptionStatus } from '../hooks/useSubscriptionStatus';
import { showLogin } from '../store/authSlice';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DetailsPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const user = useSelector((state) => state.auth.user);

  const { status: subscriptionStatus, loading: subLoading } = useSubscriptionStatus(user?.uid);
  console.log("👤 UID:", user?.uid);
  console.log("📦 Subscription status:", subscriptionStatus);

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [playvideoId, setPlayVideoId] = useState('');

  const { data } = useFetchDetails(`/${params?.explore}/${params?.id}`);
  const { data: castData } = useFetchDetails(`/${params?.explore}/${params?.id}/credits`);
  const { data: similarData } = useFetch(`/${params?.explore}/${params?.id}/similar`);
  const { data: recommendationData } = useFetch(`/${params?.explore}/${params?.id}/recommendations`);

  const handlePlayVideo = async (videoData) => {
    if (!user) return dispatch(showLogin());

    if (!subLoading && subscriptionStatus !== "success") {
      setShowSubscribeModal(true);
      return;
    }

    await setDoc(doc(db, "users", user.uid, "watchHistory", data.id.toString()), {
      ...data,
      watchedAt: new Date().toISOString(),
      media_type: params?.explore,
    });

    setPlayVideoId(videoData);
    setPlayVideo(true);
  };

  const handleAddFavorite = () => {
    if (!user) return dispatch(showLogin());
    alert('Added to favorite (placeholder)');
  };

  if (!data) return <Loading />;

  const duration = data?.runtime
    ? (Number(data.runtime) / 60).toFixed(1).split('.')
    : [0, 0];

  const director = castData?.crew?.find((person) => person.job === 'Director');

  return (
    <div>
      {/* Banner */}
      <div className='w-full h-[450px] relative hidden lg:block'>
        <div className='absolute top-0 w-full h-full bg-gradient-to-t from-black/90 to-transparent'></div>
        <img
          src={imageURL + data?.backdrop_path}
          alt='banner'
          className='w-full h-full object-cover object-center'
        />
      </div>

      {/* Main Info */}
      <div className='container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10'>
        <div className='relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60'>
          <img
            src={imageURL + data?.poster_path}
            alt='poster'
            className='h-80 w-60 object-cover rounded'
          />
          <button
            onClick={() => handlePlayVideo(data)}
            className='mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-tl from-white to-black hover:scale-105 transition-all cursor-pointer active:scale-95'>
            Play now
          </button>
          <AddToFavorites movie={data} />
        </div>

        <div className='flex flex-col justify-center gap-2'>
          <h2 className='text-2xl lg:text-4xl text-white font-bold'>
            {data.title || data.name}
          </h2>
          <p className='text-neutral-400'>{data.tagline}</p>
          <RatingButton movieId={data.id}/>
          <div className='flex items-center my-3 gap-3 text-neutral-300'>
            <p>Release Date: {moment(data.release_date).format('DD-MM-YYYY')}</p>
            <span>|</span>
            <p>Duration: {duration[0]}h {duration[1]}m</p>
          </div>

          <div>
            <h3 className='text-xl font-bold text-white mb-1'>Overview</h3>
            <p>{data.overview}</p>
          </div>

          {director && (
            <div>
              <p>
                <span className='text-white font-bold'>Director:</span> {director.name}
              </p>
            </div>
          )}

          <h2 className='text-white font-bold text-lg mt-4'>Cast:</h2>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-5 my-4'>
            {castData?.cast
              ?.filter((el) => el?.profile_path)
              .slice(0, 16)
              .map((starCast) => (
                <div key={starCast.id}>
                  <img
                    src={imageURL + starCast.profile_path}
                    className='w-24 h-24 object-cover rounded-full'
                    alt={starCast.name}
                  />
                  <p className='font-bold text-center text-sm text-neutral-400'>
                    {starCast.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <HorizontalScroll
          data={similarData}
          heading={`Similar ${params?.explore}`}
          media_type={params?.explore}
        />
        <HorizontalScroll
          data={recommendationData}
          heading={`Recommendations ${params?.explore}`}
          media_type={params?.explore}
        />
      </div>

      {/* Video Modal */}
      {playVideo && (
        <Videoplay
          data={playvideoId}
          close={() => setPlayVideo(false)}
          media_type={params?.explore}
        />
      )}

      {/* Subscription Prompt */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg max-w-sm text-center space-y-4">
            <h2 className="text-xl font-bold">Bạn cần mua gói để xem phim</h2>
            <p>Hãy chọn một gói để tiếp tục xem nội dung này.</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                  navigate("/subscription");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
