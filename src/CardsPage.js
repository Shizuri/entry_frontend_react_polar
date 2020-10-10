import React, { useContext, useState, useEffect } from 'react'
import './CardsPage.css'
import { Context } from './context'
import { Link } from 'react-router-dom'
import Card from './Card'

import cardsJson from './cards.json' // JSON extracted from the MtG API for faster use

// Constant values that are frozen so that they can't be mutated in any way
const ALL_CARD_TYPES = ['Artifact', 'Autobot', 'Card', 'Character', 'Conspiracy', 'Creature', 'Dragon', 'Elemental',
    'Enchantment', 'Goblin', 'Hero', 'Instant', 'Jaguar', 'Knights', 'Land', 'Phenomenon', 'Plane', 'Planeswalker',
    'Scheme', 'Sorcery', 'Specter', 'Summon', 'Tribal', 'Vanguard', 'Wolf', 'You’ll']
Object.freeze(ALL_CARD_TYPES)
const ALL_CARD_COLORS = ['White', 'Blue', 'Black', 'Red', 'Green']
Object.freeze(ALL_CARD_COLORS)

const CardsPage = props => {
    // The global state of name, no need to import setName, it will not be used here
    const { name, cards, setCards } = useContext(Context)

    const [loaded, setLoaded] = useState(false) // Card load state
    const [filteredCards, setFilteredCards] = useState([]) // Filtered cards

    const [searchTerm, setSearchTerm] = useState('') // Search term to filter cards by
    const [cardTypeSelectedValues, setCardTypeSelectedValues] = useState([]) // Card type value
    const [cardColorSelectedValues, setCardColorSelectedValues] = useState([]) // Card color value
    const [cardOrder, setCardOrder] = useState('')

    const handleSearchTerm = event => {
        setSearchTerm(event.target.value)
    }

    const handleTypeChange = event => {
        const selected = []
        let selectedOption = (event.target.selectedOptions)
        for (let i = 0; i < selectedOption.length; i++) {
            selected.push(selectedOption.item(i).value)
        }
        setCardTypeSelectedValues(selected)
    }

    const handleColorChange = event => {
        const selected = []
        let selectedOption = (event.target.selectedOptions)
        for (let i = 0; i < selectedOption.length; i++) {
            selected.push(selectedOption.item(i).value)
        }
        setCardColorSelectedValues(selected)
    }

    const sortByAscending = () => {
        cards.sort((a, b) => a.name.localeCompare(b.name))
        // The state exists and is updated only for the purpose of component reloading    
        setCardOrder('Ascending')
    }

    const sortByDescending = () => {
        cards.sort((a, b) => b.name.localeCompare(a.name))
        // The state exists and is updated only for the purpose of component reloading   
        setCardOrder('Descending')
    }

    console.log('Cards: ', cards)

    // Load cards
    // useEffect(() => {
    //     const getCards = () => {
    //         // GET Request.
    //         fetch('https://api.magicthegathering.io/v1/cards?random=true&pageSize=100&language=English/')
    //             // Handle success
    //             // Convert to json
    //             .then(response => response.json())
    //             .then(data => {

    //                 setCards(data.cards) // Set global state cards
    //                 setFilteredCards(data.cards) // Set filtered cards that will be displayed
    //                 setLoaded(true) // Cards are loaded
    //                 console.log(data)
    //             })
    //             // Catch errors
    //             .catch(error => console.log('Request Failed with error: ', error))
    //     }
    //     getCards()
    // }, [setCards])

    // Load cards dummy effect with local Json for faster loading
    useEffect(() => {
        setCards(cardsJson.cards)
        setFilteredCards(cardsJson.cards)
        setLoaded(true)
    }, [setCards])

    // Update cards on filter change
    useEffect(() => {
        let result = cards // Start with all the cards

        // Filter by search term
        const nameTextFilterResult = cards.filter(card => {
            // Sometimes there is no entry for text, check for it
            if (card.name && card.text) {
                return (
                    card.name.toLowerCase().includes(searchTerm.toLowerCase())
                    || card.text.toLowerCase().includes(searchTerm.toLowerCase())
                )
            } else {
                // If there is no entry for text, filter just by name
                return (card.name.toLowerCase().includes(searchTerm.toLowerCase()))
            }
        })
        // Update the result to be the new filtered by term results
        result = nameTextFilterResult

        // Filter by card type
        const cardTypeSelectedValuesFilterResult = result.filter(card => {
            // Check if the card has a type provided by the API
            if (card.types) {
                for (let i = 0; i < card.types.length; i++) {
                    for (let j = 0; j < cardTypeSelectedValues.length; j++) {
                        // If any member of the card types array is found in the array of selected types, filter it in
                        // This will make sure that if the card has more than one type it will still be shown
                        if (card.types[i].toLowerCase().includes(cardTypeSelectedValues[j].toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        })
        // If no values of the card type MultiSelect menu were selected, show all previously filtered results
        if (cardTypeSelectedValues.length > 0) {
            result = cardTypeSelectedValuesFilterResult
        }

        // Filter by card color
        const cardColorSelectedValuesFilterResult = result.filter(card => {
            // Check if the card has a color provided by the API
            if (card.colors) {
                for (let i = 0; i < card.colors.length; i++) {
                    for (let j = 0; j < cardColorSelectedValues.length; j++) {
                        if (card.colors[i].toLowerCase().includes(cardColorSelectedValues[j].toLowerCase())) {
                            // If any member of the card types array is found in the array of selected types, filter it in
                            // This will make sure that if the card has more than one type it will still be shown
                            return true
                        }
                    }
                }
            }
            return false
        })
        if (cardColorSelectedValues.length > 0) {
            result = cardColorSelectedValuesFilterResult
        }

        setFilteredCards(result)
    }, [cards, searchTerm, cardTypeSelectedValues, cardColorSelectedValues, cardOrder])

    return (
        <div className='CardsPage'>
            <h3 className='CardsPage-greeting'>Hello, {name}</h3>

            <div className='CardsPage-controls'>
                {/* Filter search */}
                <input type='text' value={searchTerm} onChange={handleSearchTerm} />

                <select className='CardsPage-card-type-selector' id='CardsPage-card-type-selector' multiple={true} value={cardTypeSelectedValues} onChange={handleTypeChange}>
                    {ALL_CARD_TYPES.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <select className='CardsPage-card-color-selector' id='CardsPage-card-color-selector' multiple={true} value={cardColorSelectedValues} onChange={handleColorChange}>
                    {ALL_CARD_COLORS.map(item => <option key={item} value={item}>{item}</option>)}
                </select>

                <button onClick={sortByAscending}>Sort by name Ascending</button>
                <button onClick={sortByDescending}>Sort by name Descending</button>

                <p>Card Type: {cardTypeSelectedValues}</p>
                <p>Card Color: {cardColorSelectedValues}</p>
                <p>Number of shown cards: {filteredCards.length}</p>
            </div>

            <div className='CardsPage-cards'>
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
