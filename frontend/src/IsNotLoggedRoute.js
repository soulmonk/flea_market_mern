import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from './context/auth'

function IsNotLoggedRoute ({ component: Component, ...rest }) {
  const { authTokens } = useAuth()

  return (
    <Route
      {...rest}
      render={props =>
        authTokens ? (
          <Redirect
            to={{ pathname: '/' }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

export default IsNotLoggedRoute
