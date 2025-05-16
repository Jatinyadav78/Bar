import React from 'react';
import Styles from './stepper.module.css'

const Stepper = ({ titles, activeStep }) => {

  return (
    <div className={Styles.stepperContainer}>
      <div className={Styles.stepper}>
        {titles.map((title, index) => (
          <div className={Styles.stepperBlock} key={index}>
            {index > 0 && index !== titles.length &&
              <div className={Styles.smallDot}>
                <div className={Styles.dot} />
                <div className={Styles.dot} />
                <div className={Styles.dot} />
              </div>}
            <div className={Styles.step}>
              <div className={`${Styles.title} ${activeStep === index && Styles.titleActive}`}>{title}</div>
              <div className={`${Styles.bigDot} ${activeStep === index && Styles.active}`} />
            </div>
          </div>
        ))}
      </div>

      <div className={Styles.stepperResp}>
        {titles.map((title, index) => {
          if (index === activeStep  ||  index === (activeStep + 1)) {
            return (
              <div className={Styles.stepperBlock} key={index}>
                {index > activeStep && index !== titles.length &&
                  <div className={Styles.smallDot}>
                    <div className={Styles.dot} />
                    <div className={Styles.dot} />
                    <div className={Styles.dot} />
                  </div>}
                <div className={Styles.step}>
                  <div className={`${Styles.title} ${activeStep === index && Styles.titleActive}`}>{title}</div>
                  <div className={`${Styles.bigDot} ${activeStep === index && Styles.active}`} />
                </div>
              </div>)
          }
        })
        }
      </div>
    </div> 

  )
}

export default Stepper