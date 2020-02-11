import React, { useState } from 'react'
import { Link as RLink, Redirect } from 'react-router-dom'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import LoginForm from '../components/LoginForm'
import Grid from '@material-ui/core/Grid'

function Signup () {
  const [isCreated, setIsCreated] = useState(false)
  const [isError, setIsError] = useState(false)

  function postSignUp (username, password) {
    axios.post('/sign-up', {
      username,
      password
    }).then(result => {
      if (result.status === 200) {
        setIsCreated(true)
      } else {
        setIsError(true)
      }
    }).catch(e => {
      setIsError(true)
    })
  }

  if (isCreated) {
    return <Redirect to="/login"/>
  }
  return (
    <LoginForm name="Sign Up" submitTitle="Sign Up" onSubmit={postSignUp}>
      <Grid item>
        {isError && <Typography component="span">The username or password provided were incorrect!</Typography>}
      </Grid>
      <Grid item>
        <Link component={RLink} to="/login" href="#" variant="body2">
          {'Already have an account?'}
        </Link>
      </Grid>
    </LoginForm>
  )
}

export default Signup

