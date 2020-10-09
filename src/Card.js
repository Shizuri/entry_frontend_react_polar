import React from 'react'
import './Card.css'

const Card = props => {
    return (
        <div className='Card'>
            <div>Name: {props.name}</div>
            <div>Text: {props.text}</div>
            <div>Type: {props.type}</div>
            <div>Colors: {props.colors}</div>
        </div>
    )
}

export default Card
