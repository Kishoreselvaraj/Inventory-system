import React from 'react'
import './Cards.scss'
function Cards({title,content}) {
  return (
    <div className='card'>
        <h1 className='card-title'>{title}</h1>
        <p className="classContent">{content}</p>
    </div>
  )
}

export default Cards