// src/pages/DetailsPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import AddToFavorites from "../components/AddToFavorites";
import useFetchDetails from "../hooks/useFetchDetails";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Loading";
import HorizontalScroll from "../components/HorizontalScroll";
import Videoplay from "../components/VideoPlay";
import RatingButton from "../components/RatingButton";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";
import { showLogin } from "../store/authSlice";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const DetailsPage = () => {
  const params = useParams();// lay cac tham so nhu explore va id tu url
  const dispatch = useDispatch(); // dung de dispatch cac action
  const navigate = useNavigate();
  const imageURL = useSelector((state) => state.movieData.imageURL);// lay URL hinh anh tu redux store
  const user = useSelector((state) => state.auth.user); // lay thong tin nguoi dung tu redux store(authSlice)

  const { status: subscriptionStatus, loading: subLoading } = useSubscriptionStatus(user?.uid);// lay trang thai dang ky cua nguoi dung tu hook useSubscriptionStatus
  console.log("👤 UID:", user?.uid);
  console.log("📦 Subscription status:", subscriptionStatus);

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);// hien thi modal mua goi neu nguoi dung chua mua goi
  const [playVideo, setPlayVideo] = useState(false); // hien thi modal video
  const [playvideoId, setPlayVideoId] = useState(""); // ID video dang chay

  const { data } = useFetchDetails(`/${params?.explore}/${params?.id}`);// truyen endpoint(explore/id) vao hook useFetchDetails de lay thong tin chi tiet phim
  const { data: castData } = useFetchDetails(
    `/${params?.explore}/${params?.id}/credits`
  );// lay thong tin dien vien va dao dien tu hook useFetchDetails
  const { data: similarData } = useFetch(
    `/${params?.explore}/${params?.id}/similar`
  );// lay danh sach phim tuong tu tu hook useFetch
  const { data: recommendationData } = useFetch(
    `/${params?.explore}/${params?.id}/recommendations`
  );// lay danh sach phim gợi ý tu hook useFetch

  // Ham xu ly khi nguoi dung click vao nut Play
  const handlePlayVideo = async (videoData) => {
    if (!user) return dispatch(showLogin());// neu chua dang nhap, hien thi modal dang nhap

    if (!subLoading && subscriptionStatus !== "success") {// chua dang ky, hien modal mua goi
      setShowSubscribeModal(true);
      return;
    }
    // Neu da dang nhap va da dang ky, luu lich su xem vao Firestore
    await setDoc(
      doc(db, "users", user.uid, "watchHistory", data.id.toString()),
      {
        ...data,
        watchedAt: new Date().toISOString(),
        media_type: params?.explore,
      }
    );

    setPlayVideoId(videoData);// luu ID video dang chay
    setPlayVideo(true);// hien thi modal video
  };

  if (!data) return <Loading />;// neu khong co du lieu, hien thi loading

  // format thoi gian phim
  const duration = data?.runtime
    ? (Number(data.runtime) / 60).toFixed(1).split(".")
    : [0, 0];

  // Tim dao dien trong danh sach cast
  const director = castData?.crew?.find((person) => person.job === "Director");

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-[450px] relative hidden lg:block">
        <div className="absolute top-0 w-full h-full bg-gradient-to-t from-black/90 to-transparent"></div>
        <img
          src={imageURL + data?.backdrop_path}
          alt="banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Info */}
      <div className="container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10">
        <div className="relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60">
          <img
            src={imageURL + data?.poster_path}
            alt="poster"
            className="h-80 w-full object-cover rounded"
          />
          <button
            onClick={() => handlePlayVideo(data)}
            className="mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-tl from-white to-black hover:scale-105 transition-all cursor-pointer active:scale-95"
          >
            Play now
          </button>
          <AddToFavorites movie={data} />
        </div>

        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-2xl lg:text-4xl text-white font-bold">
            {data.title || data.name}
          </h2>
          <p className="text-neutral-400">{data.tagline}</p>
          <RatingButton movieId={data.id} />
          <div className="flex items-center my-3 gap-3 text-neutral-300">
            <p>
              Release Date: {moment(data.release_date).format("DD-MM-YYYY")}
            </p>
            <span>|</span>
            <p>
              Duration: {duration[0]}h {duration[1]}m
            </p>
          </div>

          <div>
            <div className="flex gap-2 flex-wrap mb-5">
              {data.genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-white/10 text-sm text-white px-2 py-1 rounded"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Overview</h3>
            <p>{data.overview}</p>
          </div>

          {director && (
            <div>
              <p>
                <span className="text-white font-bold">Director:</span>{" "}
                {director.name}
              </p>
            </div>
          )}

          <h2 className="text-white font-bold text-lg mt-4">Cast:</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-5 my-4">
            {castData?.cast
              ?.filter((el) => el?.profile_path)
              .slice(0, 16)
              .map((starCast) => (
                <div key={starCast.id}>
                  <img
                    src={imageURL + starCast.profile_path}
                    className="w-24 h-24 object-cover rounded-full"
                    alt={starCast.name}
                  />
                  <p className="font-bold text-center text-sm text-neutral-400">
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

      {/* Subscription Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-5 border border-white/10 relative animate-fadeIn">
            <div className="flex flex-col items-center gap-2">
              <span className="text-yellow-400 text-5xl mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-14 h-14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="#facc15"
                  />
                  <path
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01"
                  />
                </svg>
              </span>
              <h2 className="text-2xl font-extrabold">Premium Required</h2>
              <p className="text-neutral-300">
                You need a subscription plan to watch this movie.
                <br />
                Please choose a plan to continue enjoying premium content.
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="px-5 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                  navigate("/subscription");
                }}
                className="px-5 py-2 rounded-lg bg-gradient-to-tr from-yellow-400 to-red-500 text-black font-bold shadow hover:scale-105 transition"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
