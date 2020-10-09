import React, { useState, useRef, useEffect } from 'react'
import './HomePage.css'
import './normalize.css'

const App = () => {
	const [name, setName] = useState('Zdravko')

	const handleChange = event => {
		setName(event.target.value)
	}

	const userNameRef = useRef(null)
	
	useEffect(() => {
		// Custom validation for a better user experience
		const currentUserNameRef = userNameRef.current
		const handleUppercaseValidation = () => {
			if (currentUserNameRef.validity.patternMismatch) {
				currentUserNameRef.setCustomValidity('The first character should be an Uppercase Letter')
			} else {
				currentUserNameRef.setCustomValidity('')
			}
		}

		if (userNameRef && currentUserNameRef) {
			currentUserNameRef.addEventListener('uppercaseInputValidation', handleUppercaseValidation)
			return () => {
				currentUserNameRef.removeEventListener('uppercaseInputValidation', handleUppercaseValidation)
			}
		}
	}, [])

	return (
		<div className='HomePage'>
			<form action='/welcome-page.html' method='get'>
				<label className='HomePage-name-label' htmlFor='name'>Name:</label>
				<input className='HomePage-name-input' type='text' id='HomePage-name-input' name='name' value={name}
					onChange={handleChange} placeholder='Your name here' ref={userNameRef} required minLength='3' pattern='^[A-Z].*' />
				<input className='HomePage-submit-button' type='submit' value='Submit' />
			</form>
		</div>
	)
}

export default App
