import React from 'react'

interface Props {
  value: string
  setValue: (value: string) => void
}

const Input = ({ value, setValue }: Props) => {
  return (
    <>
      <label htmlFor='input'>Fetch on input</label>
      <input
        type='text'
        name='input'
        id='input'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Piper@linwood.us'
      />
    </>
  )
}

export default Input
