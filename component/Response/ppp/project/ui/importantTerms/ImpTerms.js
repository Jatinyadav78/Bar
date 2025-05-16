import React from 'react'
const data = [
  "Safety training & instructions had been given",
  "Work area had been properly barricaded & necessary safety equipment such as safety belt & helmet etc. had been already inspected",
  "Copy of work permit submit to Security ,Concerned Dept. & Safety Dept"
]

const ImpTerms = () => {
  return (<>
    {data.map((items,index) => (<div key={index} style={{gridColumn:'1/-1',lineHeight:'25px', fontSize:'15px',color: "#595A5B99",display:'flex',gap:'5px'}}>
      <div>&bull; </div><div>{items}</div>
    </div>))}
  </>
  )
}

export default ImpTerms