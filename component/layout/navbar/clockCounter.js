import React, { useEffect, useState } from "react";
import Styles from "./navbar.module.css";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";

const ClockCounter = () => {
  const [isClient, setIsClient] = useState(false); // Store initial date
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setIsClient(true)
    const timerID = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = currentDate.toLocaleString("en-US", options);

  return (
    <>
      {isClient && (<div className={Styles.calenderDate}>
        <div className={Styles.calenderIcon}>
          <CalendarMonthSharpIcon />
        </div>
        <div className={Styles.date}>{formattedDate}</div>
        <div className={Styles.bigDot}></div>
      </div>)}
    </>
  );
};

export default ClockCounter;
