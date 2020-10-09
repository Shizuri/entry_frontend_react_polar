// This component provides global state management for the app
import React, { useState } from 'react'
const Context = React.createContext()

const ContextProvider = props => {
    const [name, setName] = useState('Zdravko')

    return (
        <Context.Provider value={{
            name,
            setName
        }}>
            {props.children}
        </Context.Provider>
    )
}

export { ContextProvider, Context }