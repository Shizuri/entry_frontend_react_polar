import React, { useContext } from 'react'
import './CardsPage.css'
import { Context } from './context'
import { Link } from 'react-router-dom'

const CardsPage = props => {
    // The global state of name, no need to import setName, it will not be used here
    const { name } = useContext(Context)

    return (
        <div className='CardsPage'>
            <h1>Hello, {name}</h1>

            <Link className='CardsPage-back-button' to='/'>Home</Link>
        </div>
    )
}

export default CardsPage
