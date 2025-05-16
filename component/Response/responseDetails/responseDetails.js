import React from 'react';
import Styles from './responseDetails.module.css'
import { formatDate } from '../../../helperFunction/dateTimeFormat.js';

const ResponseDetails = ({ field, index }) => {
  const { responseType, answer, question } = field
  const commonResponseType = ['text', 'number', 'date', 'password', 'email', 'select']

  const dateRange = (answer) => {
    const formattedDates = Array.isArray(answer) && answer.map(dateString => {
      const date = formatDate(dateString);
      return `${date.day}/${date.month}/${date.year}`
    });
    const dateRange = `${formattedDates[0]} - ${formattedDates[1]}`;
    return dateRange
  }

  const dateTimeRange = (answer) => {
    const formattedDates = Array.isArray(answer) && answer.map(dateString => {
      const date = formatDate(dateString);
      return `${date.day}/${date.month}/${date.year} || ${date.hours}:${date.minutes} ${date.ampm} `
    });
    const dateRange = `${formattedDates[0]} - ${formattedDates[1]}`;
    return dateRange
  }
  
  return (
    <>
      {responseType === 'radio' && (<div>
        <div className={Styles.question}>{question}</div>
        {answer && <input type="radio" value={answer} checked readOnly />}
        <label style={{ marginLeft: '3px' }} className={Styles.answer}>{answer ? answer : 'N/A'}</label>
      </div>)
      }
      {responseType === 'profileImage' && (<div className={Styles.body}>
        <img
          src={answer}
          style={{ height: 100, width: 100 }}
          alt="logo"
        />
      </div>)
      }
      {responseType === 'inspection' && (<div className={Styles.inspectionContainer}>
        <div className={Styles.question} style={{ width: '80%' }}>{`${index + 1}. ${question}`}</div>
        <div className={Styles.inspection} style={{ width: '10%' }}>
          {answer && <input type="radio" id={index} style={{ width: '10px', height: '9px', margin: '3px', color: 'blue' }} value={index} checked readOnly />}
          <label className={Styles.question}>{answer ? answer : 'N/A'}</label>
        </div>
      </div>)
      }

      {responseType === 'dateRange' && (<div>
        <div className={Styles.question}>{question}</div>
        <div className={Styles.answer}>{answer ? dateRange(answer) : 'N/A'}</div>
      </div>)
      }
      {responseType === 'dateTimeRange' && (<div>
        <div className={Styles.question}>{question}</div>
        <div className={Styles.answer}>{answer ? dateTimeRange(answer) : 'N/A'}</div>
      </div>)
      }
      {responseType === 'dateAndTime' && (<div>
        <div className={Styles.question}>{question}</div>
        <div className={Styles.answer}>{answer ? formatDate(answer,true) : 'N/A'}</div>
      </div>)
      }
      {responseType === 'image' && (<div className={Styles.image}>
        <div className={Styles.image}>
          <img
            alt="Plant Layout"
            src={answer ? answer : ''}
            width="100%"
            height="100%"
          />
        </div>
      </div>)
      }
      {commonResponseType.includes(responseType) && (<div>
        <div className={Styles.question}>{question}</div>
        <div className={Styles.answer}>{answer ? answer : 'N/A'}</div>
      </div>)
      }
      {responseType === 'multiSelect' && (<div>
        <div className={Styles.question}>{question}</div>
        <div className={Styles.answer}>{answer ? (Array.isArray(answer) && answer?.map((item, index) => (<div key={index}>{item}</div>))) : 'N/A'}</div>
      </div>)
      }

    </>
  )
}

export default ResponseDetails