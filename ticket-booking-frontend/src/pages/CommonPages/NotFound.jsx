import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-icon-box">
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.66553 11.9951C3.72595 11.9951 4.74294 12.4163 5.49278 13.1661C6.24261 13.916 6.66386 14.933 6.66386 15.9934C6.66386 17.0538 6.24261 18.0708 5.49278 18.8206C4.74294 19.5705 3.72595 19.9917 2.66553 19.9917V22.6573C2.66553 23.3642 2.94636 24.0422 3.44625 24.5421C3.94614 25.042 4.62413 25.3228 5.33108 25.3228H26.6555C27.3625 25.3228 28.0405 25.042 28.5404 24.5421C29.0403 24.0422 29.3211 23.3642 29.3211 22.6573V19.9917C28.2607 19.9917 27.2437 19.5705 26.4938 18.8206C25.744 18.0708 25.3228 17.0538 25.3228 15.9934C25.3228 14.933 25.744 13.916 26.4938 13.1661C27.2437 12.4163 28.2607 11.9951 29.3211 11.9951V9.3295C29.3211 8.62255 29.0403 7.94455 28.5404 7.44466C28.0405 6.94477 27.3625 6.66394 26.6555 6.66394H5.33108C4.62413 6.66394 3.94614 6.94477 3.44625 7.44466C2.94636 7.94455 2.66553 8.62255 2.66553 9.3295V11.9951Z"
            stroke="white"
            strokeWidth="2.66556"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.3261 6.66394V9.3295"
            stroke="white"
            strokeWidth="2.66556"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.3261 22.6572V25.3228"
            stroke="white"
            strokeWidth="2.66556"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.3261 14.6605V17.3261"
            stroke="white"
            strokeWidth="2.66556"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="notfound-text">404 Page Not Found</p>
    </div>
  );
};

export default NotFound;
