import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import TodoService, { LogOut } from '../service/todo-service'
import { useAuth } from '../context/auth'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}))

const todoStyles = makeStyles(theme => ({
  paper: {
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2)
  },
  margin: {
    margin: theme.spacing(1)
  }
}))

const createTodoStyles = makeStyles(theme => ({
  paper: {
    maxWidth: 500,
    marginTop: theme.spacing(8),
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    margin: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

function formatDate (date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

function CreateTodo ({ createTodo }) {
  const classes = createTodoStyles()
  const [description, setDescription] = useState('')
  const defDate = formatDate(new Date())
  const [eta, setEta] = useState(defDate)

  function reset () {
    setDescription('')
    setEta(defDate)
  }

  function onSubmit (e) {
    console.log('Todo.js::onSubmit::54 >>>', description, eta)
    e.preventDefault()
    createTodo({ description, eta: new Date(eta) })
    reset()
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <form>
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={description}
              onChange={e => {
                setDescription(e.target.value)
              }}
              autoFocus
            />
            <TextField
              id="eta"
              name="eta"
              label="Eta"
              type="date"
              required
              fullWidth
              value={eta}
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              onChange={e => {
                setEta(e.target.value)
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={onSubmit}
              className={classes.submit}
            >
              Create
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

function TodoItem ({ item, removeTodo, doneTodo }) {
  const classes = todoStyles()

  function handleDone () {
    doneTodo(item.id, !item.done)
  }

  function handleRemove () {
    removeTodo(item.id)
  }

  return (
    <Paper className={classes.paper}>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={item.done} onChange={handleDone} value="done"/>}
            label="Done"
          />
          <Typography>{item.eta ? new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(new Date(item.eta)) : 'none'}</Typography>
        </Grid>
        <Grid item xs zeroMinWidth>
          <Typography>{item.description}</Typography>
        </Grid>
        <Grid item>
          <IconButton aria-label="delete"
                      onClick={handleRemove}
                      className={classes.margin}>
            <DeleteIcon/>
          </IconButton>

        </Grid>
      </Grid>
    </Paper>
  )
}

function Todo (props) {
  const classes = useStyles()

  const initialTodosState = {
    loading: true
  }
  const { authTokens, setAuthTokens } = useAuth()

  const [items, setItems] = useState(initialTodosState)
  const [isUnauthorized, setUnauthorized] = useState(false)

  const todoService = TodoService.service()

  const catchUnauthorized = (err) => {
    if (err instanceof LogOut) {
      setAuthTokens(null)
      setUnauthorized(true)
    }
    console.log(err)
  }

  useEffect(() => {
    const getItems = async () => {
      const data = await todoService.list()
      // Update state
      setItems(data)
    }

    // Invoke the async function
    getItems().catch(catchUnauthorized)
  }, [])

  const removeTodo = (id) => {
    todoService.remove(id)
      .then(res => {
        setItems(items.filter(i => i.id !== id))
      })
      .catch(catchUnauthorized)
  }

  const createTodo = (data) => {
    todoService.create(data)
      .then(item => {
        const _items = items.slice()
        _items.push(item)
        setItems(_items)
      })
      .catch(catchUnauthorized)
  }

  const doneTodo = (id, done) => {
    todoService.done(id, done)
      .then(res => {
        setItems(items.map(item => {
          if (item.id === id) {
            item.done = done
          }
          return item
        }))
      })
      .catch(catchUnauthorized)
  }

  if (isUnauthorized) {
    return <Redirect to="/login"/>
  }

  return (
    <Container component="main">
      <CssBaseline/>
      <CreateTodo createTodo={createTodo}/>
      <CssBaseline/>
      {items.loading ? (
        <div>Loading...</div>
      ) : items.map((item, key) => (<TodoItem key={key} item={item} removeTodo={removeTodo} doneTodo={doneTodo}/>))
      }
    </Container>
  )
}

export default Todo
