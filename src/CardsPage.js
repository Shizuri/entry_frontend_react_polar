import React, { useContext, useState, useEffect } from 'react'
import './CardsPage.css'
import { Context } from './context'
import { Link } from 'react-router-dom'
import Card from './Card'

import cardsJson from './cards.json'

const CardsPage = props => {
    // The global state of name, no need to import setName, it will not be used here
    const { name, cards, setCards } = useContext(Context)

    // Card load state
    const [loaded, setLoaded] = useState(false)
    // Filtered cards
    const [filteredCards, setFilteredCards] = useState([])
    // Search term to filter cards by
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchTerm = event => {
        setSearchTerm(event.target.value)
    }

    // useEffect(() => {
    //     const getCards = () => {
    //         // GET Request.
    //         fetch('https://api.magicthegathering.io/v1/cards?random=true&pageSize=100&language=English/')
    //             // Handle success
    //             // Convert to json
    //             .then(response => response.json())
    //             .then(data => {
    //                 // Set global state cards
    //                 setCards(data.cards) // CHANGE TO data.cards
    //                 // Cards are loaded
    //                 setLoaded(true)
    //                 console.log(data)
    //             })
    //             // Catch errors
    //             .catch(error => console.log('Request Failed with error: ', error))
    //     }
    //     getCards()
    // }, [setCards])

    // Load cards
    useEffect(() => {
        setCards(cardsJson.cards)
        setFilteredCards(cardsJson.cards)
        setLoaded(true)
    }, [setCards])

    // Update cards
    useEffect(() => {
        setFilteredCards(prevCards => {
            const result = cards.filter(card => {
                if (card.name && card.text) {
                    // Sometimes there is no entry for text, check for it
                    return (
                        card.name.toLowerCase().includes(searchTerm.toLowerCase())
                        || card.text.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                } else {
                    return (card.name.toLowerCase().includes(searchTerm.toLowerCase()))
                }
            }
            )
            return (
                result
            )
        })
    }, [searchTerm, cards])

    // console.log('CARDS: ', cards)

    return (
        <div className='CardsPage'>
            <h1 className='CardsPage-greeting'>Hello, {name}</h1>

            <input type='text' value={searchTerm} onChange={handleSearchTerm} />

            <div className='CardsPage-cards'>
                {/* {loaded ? <p>DONE!</p> : <p>Loading...</p>} */}
                {loaded ? filteredCards.map(card =>
                    <Card
                        key={card.id}
                        name={card.name}
                        text={card.text}
                        type={card.type}
                        colors={card.colors}
                        imageUrl={card.imageUrl}
                    />)
                    : 'Loading cards ...'}
            </div>

            <Link className='CardsPage-back-button' to='/'>Home</Link>
        </div>
    )
}

export default CardsPage
