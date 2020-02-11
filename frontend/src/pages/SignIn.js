import React, { useState } from 'react'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import { useAuth } from '../context/auth'
import axios from 'axios'
import { Link as RLink, Redirect } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import Typography from '@material-ui/core/Typography'

export default function SignIn () {

  const [isLoggedIn, setLoggedIn] = useState(false)
  const [isError, setIsError] = useState(false)
  const { setAuthTokens } = useAuth()

  function postLogin (username, password) {
    axios.post('/token', {
      username,
      password
    }).then(result => {
      if (result.status === 200) {
        setAuthTokens(result.data)
        setLoggedIn(true)
      } else {
        setIsError(true)
      }
    }).catch(e => {
      setIsError(true)
    })
  }

  if (isLoggedIn) {
    return <Redirect to="/"/>
  }

  return (
    <LoginForm name="Login" onSubmit={postLogin} submitTitle="Login">
      <Grid item>
        {isError && <Typography component="span">The username or password provided were incorrect!</Typography>}
      </Grid>
      <Grid item>
        <Link component={RLink} to="/signup" href="#" variant="body2">
          {'Don\'t have an account? Sign Up'}
        </Link>
      </Grid>
    </LoginForm>
  )
}
