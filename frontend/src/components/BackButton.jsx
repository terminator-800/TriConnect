import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ to = "/", className = ""}) => {

    const navigate = useNavigate()

  return (
    
        <button className={`${className}`}
        onClick={() => {
            navigate(to)
        }}>back</button>
    
  )
}

export default BackButton