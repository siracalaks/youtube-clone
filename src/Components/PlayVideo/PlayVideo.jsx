import "./PlayVideo.css";
import PropTypes from 'prop-types';

//import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
//import jack from "../../assets/jack.png";
//import user_profile from "../../assets/user_profile.jpg";
import { useEffect, useState } from "react";
import { API_KEY, value_converter } from "../../../data";
import moment from "moment";

const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [error, setError] = useState(null);

  const fetchVideoData = async () => {
    try {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setApiData(data.items[0]);
      } else {
        throw new Error('No video data found');
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
      setError(error.message);
    }
  };

  const fetchOtherData = async () => {
    if (!apiData) return;
    
    try {
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelResponse = await fetch(channelData_url);
      if (!channelResponse.ok) {
        throw new Error(`HTTP error! status: ${channelResponse.status}`);
      }
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        setChannelData(channelData.items[0]);
      }

      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
      const commentResponse = await fetch(comment_url);
      if (!commentResponse.ok) {
        throw new Error(`HTTP error! status: ${commentResponse.status}`);
      }
      const commentData = await commentResponse.json();
      if (commentData.items) {
        setCommentData(commentData.items);
      }
    } catch (error) {
      console.error("Error fetching channel/comment data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="play-video">
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <h3>{apiData?.snippet?.title || "Loading..."}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "0"} Views
          &bull;
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : "0"}
          </span>
          <span>
            <img src={dislike} alt="" />0
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || ""}
          alt=""
        />
        <div>
          <p>{apiData?.snippet?.channelTitle || ""}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : "0"}
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250)
            : "Loading description..."}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : "0"}{" "}
          Comments
        </h4>
        {commentData && commentData.length > 0 ? (
          commentData.map((item, index) => (
            <div key={index} className="comment">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt=""
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>
                    {moment(
                      item.snippet.topLevelComment.snippet.publishedAt
                    ).fromNow()}
                  </span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>
                    {value_converter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  );
};

PlayVideo.propTypes = {
  videoId: PropTypes.string.isRequired,
};

export default PlayVideo;
