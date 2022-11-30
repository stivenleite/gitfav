import { GithubUser } from "./GithubUser.js"


export class Favorites {
  constructor (root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load () {
    this.entries = JSON.parse(localStorage.getItem('gitfav:')) || []
  }

  save () {
    localStorage.setItem('gitfav:', JSON.stringify(this.entries))
  }

  async add (username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error ('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error ('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]

      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  deleteUser (user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    this.entries = filteredEntries

    this.update()
    this.save()
  }
}


export class FavoritesView extends Favorites {
  constructor (root) {
    super (root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onFavClick()
  }

  onFavClick () {
    const inputBtn = document.querySelector('#inputBtn')
    inputBtn.onclick = () => {
      const { value } = document.querySelector('#inputSearch')
      this.add(value)
    }
  }

  update () {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('img').src = `https://github.com/${user.login}.png`
      row.querySelector('img').alt = `Imagem de ${user.name}`
      row.querySelector('a').href = `https://github.com/${user.login}`
      row.querySelector('a p').textContent = user.name
      row.querySelector('a span').textContent = user.login
      row.querySelector('.public_repos').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover este usuário?')
        if(isOk) {
          this.deleteUser(user)
        }
      }
      
      this.tbody.append(row)
    })

  }

  removeAllTr () {
    this.tbody.querySelectorAll('tr').forEach(tr => tr.remove())
  }

  createRow () {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
    <img
      src="https://github.com/maykbrito.png"
      alt="Imagem de Mayk Brito"
    />
    <a href="https://github.com/maykbrito" target="_blank">
      <p>Mayk Brito</p>
      <span>maykbrito</span>
    </a>
    </td>
    <td class="public_repos">123</td>
    <td class="followers">1234</td>
    <td>
      <button class="remove">Remover</button>
    </td>`

    return tr
  }
  
}