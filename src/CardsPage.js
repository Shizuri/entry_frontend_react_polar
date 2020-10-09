import React, { useContext, useState, useEffect } from 'react'
import './CardsPage.css'
import { Context } from './context'
import { Link } from 'react-router-dom'
import Card from './Card'

import cardsJson from './cards.json'

const CardsPage = props => {
    const allCardTypes = [
        "ALL TYPES",
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
        "instant",
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

    // The global state of name, no need to import setName, it will not be used here
    const { name, cards, setCards } = useContext(Context)

    const [loaded, setLoaded] = useState(false) // Card load state
    const [filteredCards, setFilteredCards] = useState([]) // Filtered cards

    const [searchTerm, setSearchTerm] = useState('') // Search term to filter cards by
    const [cardType, setCardType] = useState(['ALL TYPES']) // Card type value

    const handleSearchTerm = event => {
        setSearchTerm(event.target.value)
    }


    // PROBLEMS HERE, FIX IT!!!
    const handleTypeChange = event => {
        const val = event.target.value
        console.log('val: ', val)
        console.log('event.target.value: ', event.target.value)
        setCardType(prevVal => {
            if (prevVal.includes(val)) {
                return prevVal.filter(item => item !== val)
            } else {
                return [...prevVal, val]
            }
        })
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

        // First filter by search term
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

        // Filter by card type
        // If all types are included, just return the list
        if (cardType.includes('ALL TYPES')) {
            result = nameTextFilterResult
        } else {
            const cardTypeFilterResult = nameTextFilterResult.filter(card => {
                if (card.types) {
                    for (let i = 0; i < card.types.length; i++) {
                        for (let j = 0; j < cardType.length; j++) {
                            if (card.types[i].includes(cardType[j])) {
                                return true
                            }
                        }
                    }
                }
                return false
            })
            result = cardTypeFilterResult
        }



        // console.log('cardTypeFilterResult: ', cardTypeFilterResult)
        // // Set the filter only if any items were found
        // if (cardTypeFilterResult.length > 0) {
        //     result = cardTypeFilterResult
        // }
        setFilteredCards(result)

        if(cardType.length <= 0){
            setCardType('ALL TYPES')
        }
    }, [cards, searchTerm, cardType])

    // BACKUP
    // useEffect(() => {
    //     setFilteredCards(prevCards => {
    //         const result = cards.filter(card => {
    //             // Sometimes there is no entry for text, check for it
    //             if (card.name && card.text) {
    //                 return (
    //                     card.name.toLowerCase().includes(searchTerm.toLowerCase())
    //                     || card.text.toLowerCase().includes(searchTerm.toLowerCase())
    //                 )
    //             } else {
    //                 return (card.name.toLowerCase().includes(searchTerm.toLowerCase()))
    //             }
    //         }
    //         )
    //         return (
    //             result
    //         )
    //     })
    // }, [cards, searchTerm])

    // console.log('CARDS: ', cards)

    return (
        <div className='CardsPage'>
            <h1 className='CardsPage-greeting'>Hello, {name}</h1>

            {/* Filter search */}
            <input type='text' value={searchTerm} onChange={handleSearchTerm} />

            <strong>Select Card Type:</strong>
            <select className='CardsPage-card-type-selector' id='CardsPage-card-type-selector' multiple={true} value={cardType} onChange={handleTypeChange}>
                {allCardTypes.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <p>{cardType}</p>

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
