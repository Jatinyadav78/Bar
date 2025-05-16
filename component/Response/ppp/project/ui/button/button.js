import React from 'react';
// import './Button.scss';
 
const Button = (props) => {
  const {onClick,heading,className,id,disabled,style,textStyle,image,icon} = props;
  return (
    <button id={id} style={style} className={className} onClick={onClick} disabled={disabled}>
        <div className="text-center m-auto flex flex-row gap-2" style={textStyle}>
          {image ? <span className='btn-icon'>{image} </span> : '' }
          {heading ? <span>{heading} </span> : '' }
          {icon ? <span className='btn-icon'> {icon} </span> : '' }
        </div>
    </button>
  );
};
 
export default Button;