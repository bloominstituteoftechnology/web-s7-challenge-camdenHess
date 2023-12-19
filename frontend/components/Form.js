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
const schema = yup.object().shape({
  fullName: yup.string().trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup.string().trim()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
})

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

  useEffect(() => {
    schema.isValid(formValues).then(isValid => setEnableSubmit(isValid))
  }, [formValues])

  const onChange = evt => {
    let { name, value } = evt.target
    setFormValues({...formValues, [name]: value})

    yup.reach(schema, name).validate(value)
      .then(() => setValidationError({ ...validationError, [name]: '' }))
      .catch((err) => setValidationError({ ...validationError, [name]: err.errors[0] }))
  }

  const onChangeToppings = evt => {
    let { name, checked } = evt.target

    if (!checked) {
      setFormValues({...formValues, toppings: formValues.toppings.filter(topping => topping !== name)})
    }
    if (checked) {
      setFormValues({...formValues, toppings: [...formValues.toppings, name]})
    }
  }

  const onSubmit = evt => {
    evt.preventDefault()
    axios.post('http://localhost:9009/api/order', formValues)
      .then(res => {
        setFormValues(getInitialValues())
        setServerSuccess(res.data.message)
        setServerFailure()
      })
      .catch(err => {
        setServerFailure(err.response.data.message)
        setServerSuccess()
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={formValues.fullName} onChange={onChange} name='fullName' placeholder="Type full name" id="fullName" type="text" />
        </div>
        {validationError.fullName && <div className='error'>{validationError.fullName}</div>}
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
        {validationError.size && <div className='error'>{validationError.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((top, idx) => {
          return (
          <label key={top.topping_id}>
            <input
            checked={!!formValues.toppings.find(topping => topping === top.topping_id)}
            onChange={onChangeToppings}
            name={top.topping_id}
            type='checkbox'
            />
            {top.text}<br />
          </label>)
        })}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enableSubmit} />
    </form>
  )
}
