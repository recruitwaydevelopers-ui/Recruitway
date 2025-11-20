import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "./context/auth-context";

const RecordingVideo = () => {
  const { encodedKey } = useParams();
  const { server, token } = useAuthContext();
  const videoRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fileInfo, setFileInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (encodedKey && token) {
      getVideoUrl(encodedKey);
    }
  }, [encodedKey, token]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  const getVideoUrl = async (key) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(
        `${server}/api/upload/getVideoUrl?encodedKey=${key}`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
      );

      console.log(data);

      if (data?.success && data?.url) {
        setVideoUrl(data.url);
        setFileInfo(data.info || null);
      } else {
        throw new Error(data?.error || "Failed to fetch video URL");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Unable to fetch video. Check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
    setIsPlaying(!video.paused);
  };

  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (video && video.duration) {
      const seekPercent = parseFloat(e.target.value);
      const seekTime = (seekPercent / 100) * video.duration;
      video.currentTime = seekTime;
      setProgress(seekPercent);
      setCurrentTime(seekTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container-fluid d-flex flex-column">
      <div className="container">
        <div className="card shadow flex-grow-1 d-flex flex-column">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Recording Video</h4>
            <span className="text-monospace bg-dark bg-opacity-25 px-2 py-1 rounded small">
              {decodeURIComponent(encodedKey)}
            </span>
          </div>
          <div className="m-3">
            <button className="btn btn-sm btn-dark" onClick={() => navigate(-1)} >
              <i className="bi bi-arrow-left me-1 me-md-2"></i>
              <span className="d-none d-sm-inline">Back to list</span>
            </button>
          </div>

          <div className="card-body p-0 d-flex flex-column flex-grow-1">
            {loading && (
              <div className="d-flex justify-content-center align-items-center p-3">
                <div className="spinner-border text-primary" role="status"></div>
                <span className="ms-2">Loading video...</span>
              </div>
            )}

            {error && (
              <div className="alert alert-danger m-3">{error}</div>
            )}

            {videoUrl && (
              <>
                {fileInfo && (
                  <div className="px-3 border-bottom bg-light">
                    <div className="row g-2">
                      <div className="col-md-4">
                        <strong>Type:</strong> {fileInfo.contentType}
                      </div>
                      <div className="col-md-4">
                        <strong>Size:</strong> {formatFileSize(fileInfo.contentLength)}
                      </div>
                      <div className="col-md-4">
                        <strong>Modified:</strong> {formatDate(fileInfo.lastModified)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Video container - flexible height */}
                <div className="flex-grow-1 bg-black position-relative" style={{ minHeight: '500px' }}>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    preload="metadata"
                    className="position-absolute top-0 left-0 w-100 h-100"
                    style={{ objectFit: 'contain' }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleProgress}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls={false}
                  />
                </div>

                <div className="bg-dark text-white p-3 d-flex align-items-center ">
                  <button className="btn btn-primary me-3" onClick={handlePlayPause}>
                    {isPlaying ? "Pause" : "Play"}
                  </button>

                  <span className="me-2">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    className="form-range flex-grow-1 me-2"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                  />

                  <div className="d-flex align-items-center ms-3">
                    <i className="bi bi-volume-up me-2"></i>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      style={{ width: "100px" }}
                    />
                  </div>

                  <div className="dropdown ms-3">
                    <button
                      className="btn btn-outline-light dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      {playbackRate}x
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <li key={rate}>
                          <button
                            className={`dropdown-item ${playbackRate === rate ? 'active' : ''}`}
                            onClick={() => handlePlaybackRateChange(rate)}
                          >
                            {rate}x
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      <style jsx>{`
        .card {
          border-radius: 0;
          border: none;
        }
        .card-header {
          border-radius: 0 !important;
        }
        .form-range::-webkit-slider-thumb {
          background-color: #0d6efd;
        }
        .form-range::-moz-range-thumb {
          background-color: #0d6efd;
        }
        .form-range::-ms-thumb {
          background-color: #0d6efd;
        }
        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            text-align: center;
          }
          .card-header h4 {
            margin-bottom: 10px;
          }
          .bg-dark.text-white.p-3 {
            flex-direction: column;
            align-items: stretch !important;
          }
          .bg-dark.text-white.p-3 > * {
            margin-bottom: 10px;
          }
          .form-range.flex-grow-1 {
            margin: 0 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default RecordingVideo;

