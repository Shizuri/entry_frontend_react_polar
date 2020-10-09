import React, { useContext, useState, useEffect } from 'react'
import './CardsPage.css'
import { Context } from './context'
import { Link } from 'react-router-dom'
import Card from './Card'

import cardsJson from './cards.json'

const CardsPage = props => {
    const allCardTypes = [
        // "ALL TYPES",
        "Artifact",
        "Autobot",
        "Card",
        "Character",
        "Conspiracy",
        "Creature",
        "Dragon",
        "Elemental",
        "Enchantment",
        "Goblin",
        "Hero",
        "Instant",
        "Jaguar",
        "Knights",
        "Land",
        "Phenomenon",
        "Plane",
        "Planeswalker",
        "Scheme",
        "Sorcery",
        "Specter",
        "Summon",
        "Tribal",
        "Vanguard",
        "Wolf",
        "You’ll"
    ]

    const allCardColors = ['White', 'Blue', 'Black', 'Red', 'Green']

    // The global state of name, no need to import setName, it will not be used here
    const { name, cards, setCards } = useContext(Context)

    const [loaded, setLoaded] = useState(false) // Card load state
    const [filteredCards, setFilteredCards] = useState([]) // Filtered cards

    const [searchTerm, setSearchTerm] = useState('') // Search term to filter cards by
    const [cardType, setCardType] = useState([]) // Card type value
    const [cardColor, setCardColor] = useState([]) // Card color value

    const handleSearchTerm = event => {
        setSearchTerm(event.target.value)
    }

    const handleTypeChange = event => {
        const selected = []
        let selectedOption = (event.target.selectedOptions)
        for (let i = 0; i < selectedOption.length; i++) {
            selected.push(selectedOption.item(i).value)
        }
        setCardType(selected)
    }

    const handleColorChange = event => {
        const selected = []
        let selectedOption = (event.target.selectedOptions)
        for (let i = 0; i < selectedOption.length; i++) {
            selected.push(selectedOption.item(i).value)
        }
        setCardColor(selected)
    }

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
        let result = cards

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
        result = nameTextFilterResult

        // Filter by card type
        const cardTypeFilterResult = result.filter(card => {
            if (card.types) {
                for (let i = 0; i < card.types.length; i++) {
                    for (let j = 0; j < cardType.length; j++) {
                        if (card.types[i].toLowerCase().includes(cardType[j].toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        })
        console.log('cardTypeFilterResult: ', cardTypeFilterResult)
        if (cardType.length > 0) {
            result = cardTypeFilterResult
        }

        // Filter by card color
        const cardColorFilterResult = result.filter(card => {
            if (card.colors) {
                for (let i = 0; i < card.colors.length; i++) {
                    for (let j = 0; j < cardColor.length; j++) {
                        if (card.colors[i].toLowerCase().includes(cardColor[j].toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        })
        if (cardColor.length > 0) {
            result = cardColorFilterResult
        }

        setFilteredCards(result)
    }, [cards, searchTerm, cardType, cardColor])

    return (
        <div className='CardsPage'>
            <h3 className='CardsPage-greeting'>Hello, {name}</h3>

            <div className='CardsPage-controls'>
                {/* Filter search */}
                <input type='text' value={searchTerm} onChange={handleSearchTerm} />

                <select className='CardsPage-card-type-selector' id='CardsPage-card-type-selector' multiple={true} value={cardType} onChange={handleTypeChange}>
                    {allCardTypes.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <select className='CardsPage-card-color-selector' id='CardsPage-card-color-selector' multiple={true} value={cardColor} onChange={handleColorChange}>
                    {allCardColors.map(item => <option key={item} value={item}>{item}</option>)}
                </select>

                <p>Card Type: {cardType}</p>
                <p>Card Color: {cardColor}</p>
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
