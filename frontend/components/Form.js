import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const getInitialValues = () => ({
  fullName: '',
  size: '',
  toppings: []
})

const getInitialErrors = () => ({
  fullName: '',
  size: '',
})


export default function Form() {
  const [formValues, setFormValues] = useState(getInitialValues())
  const [validationError, setValidationError] = useState(getInitialErrors())
  const [serverSuccess, setServerSuccess] = useState('')
  const [serverFailure, setServerFailure] = useState('')
  const [enableSubmit, setEnableSubmit] = useState(false)

  const onChange = evt => {
    let { type, name, value, checked } = evt.target
    value = type == 'checkbox' ? checked : value
  }

  const onSubmit = evt => {
    evt.preventDefault()
  }

  return (
    <form>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>Thank you for your order!</div>}
      {serverFailure && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={formValues.fullName} onChange={onChange} name='fullName' placeholder="Type full name" id="fullName" type="text" />
        </div>
        {validationError.fullName && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={formValues.size} onChange={onChange} name='size' id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {validationError.size && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map(top => {
          return (
          <label key={top.topping_id}>
            <input
            checked={false}
            onChange={onChange}
            name={top.topping_id}
            type='checkbox'
            />
            {top.text}<br />
          </label>)
        })}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" />
    </form>
  )
}
