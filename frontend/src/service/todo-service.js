import axios from 'axios'

export class LogOut extends Error {

}

class TodoService {
  constructor () {
    this._api = axios.create({
      baseURL: '/api/todo',
    })
    window.api = this._api
  }

  async list () {
    return this._api.get('/').then(result => {
      if (result.status === 200) {
        return result.data
      }
      throw new Error('bad request')
    }).catch(this.badRequest)
  }

  async create (data) {
    return this._api.post('/', data).then(result => {
      if (result.status === 200) {
        return result.data
      }
      throw new Error('bad request')
    }).catch(this.badRequest)
  }

  async remove (id) {
    return this._api.delete('/' + id).then(result => {
      if (result.status === 200) {
        return result.data
      }
      throw new Error('bad request')
    }).catch(this.badRequest)
  }

  async done (id, done) {
    return this._api.put('/' + id, {done}).then(result => {
      if (result.status === 200) {
        return result.data
      }
      throw new Error('bad request')
    }).catch(this.badRequest)
  }

  badRequest (err) {
    if (err.response.status === 401) {
      throw new LogOut()
    }
    throw new Error('bad request')
  }

  setToken(token) {
    this._api.defaults.headers.common['Authorization'] ='Bearer ' + token
  }

  static service() {
    if (!this._instance) {
      this._instance = new TodoService();
    }
    return this._instance;
  }
}

export default TodoService
