import React from 'react';
import './PopupSlide.module.scss';

type PopupSlideProps = {
  visible?: boolean
}

const PopupSlide: React.FC<PopupSlideProps> = (props) => {
  return (
    <div className={`slide ${props.visible ? ' visible' : ''}`}>
      {props.children}
    </div>
  )
}

export default PopupSlide;