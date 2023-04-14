'use strict'

const limparFormulario = endereco => {
  document.getElementById('endereco').value = ''
  document.getElementById('bairro').value = ''
  document.getElementById('cidade').value = ''
  document.getElementById('estado').value = ''
}

const preencherFormulario = endereco => {
  document.getElementById('endereco').value = endereco.logradouro
  document.getElementById('bairro').value = endereco.bairro
  document.getElementById('cidade').value = endereco.localidade
  document.getElementById('estado').value = endereco.uf
}

const eNumero = numero => /^[0-9]+$/.test(numero)

const cepValido = cep => cep.length == 8 && eNumero(cep)

const pesquisarCep = async () => {
  limparFormulario()

  const cep = document.getElementById('cep').value
  const url = `https://viacep.com.br/ws/${cep}/json/`
  if (cepValido(cep)) {
    const dados = await fetch(url)
    const endereco = await dados.json()
    if (endereco.hasOwnProperty('erro')) {
      document.getElementById('endereco').value = 'CEP não encontrado!'
    } else {
      preencherFormulario(endereco)
    }
  } else {
    if (cep == null || cep == '') {
      document.getElementById('endereco').value = 'Informe um CEP!'
    } else document.getElementById('endereco').value = 'CEP incorreto!'
  }
}

document.getElementById('cep').addEventListener('focusout', pesquisarCep)

//

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = dbClient =>
  localStorage.setItem('db_client', JSON.stringify(dbClient))

const createClient = client => {
  const dbClient = getLocalStorage()
  dbClient.push(client)
  setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const updateClient = (index, client) => {
  const dbClient = readClient()
  dbClient[index] = client
  setLocalStorage(dbClient)
}

const deleteClient = index => {
  const dbClient = readClient()
  dbClient.splice(index, 1)
  setLocalStorage(dbClient)
}

const clearFields = () => {
  ;(document.getElementById('nome').value = ''),
    (document.getElementById('email').value = ''),
    (document.getElementById('cep').value = ''),
    (document.getElementById('endereco').value = ''),
    (document.getElementById('numero').value = ''),
    (document.getElementById('bairro').value = ''),
    (document.getElementById('cidade').value = ''),
    (document.getElementById('estado').value = '')
}

const saveClient = () => {
  const client = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    cep: document.getElementById('cep').value,
    endereco: document.getElementById('endereco').value,
    numero: document.getElementById('numero').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    estado: document.getElementById('estado').value
  }

  const index = document.getElementById('nome').dataset.index
  if (index == 'new') {
    createClient(client)
    updateTable()
    clearFields()
  } else {
    updateClient(index, client)
    updateTable()
    clearFields()
  }
}

const createRow = (client, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.cep}</td>
        <td>${client.endereco}</td>
        <td>${client.numero}</td>
        <td>${client.bairro}</td>
        <td>${client.cidade}</td>
        <td>${client.estado}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
  document.querySelector('#tbClient>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tbClient>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbClient = readClient()
  clearTable()
  dbClient.forEach(createRow)
}

const fillFields = client => {
  document.getElementById('nome').value = client.nome
  document.getElementById('email').value = client.email
  document.getElementById('cep').value = client.cep
  document.getElementById('endereco').value = client.endereco
  document.getElementById('numero').value = client.numero
  document.getElementById('bairro').value = client.bairro
  document.getElementById('cidade').value = client.cidade
  document.getElementById('estado').value = client.estado
  document.getElementById('nome').dataset.index = client.index
}

const editClient = index => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
}

const editDelete = event => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const response = confirm(
        `Deseja realmente excluir o cliente ${client.nome}`
      )
      if (response) {
        deleteClient(index)
        updateTable()
      }
    }
  }
}

updateTable()

document.getElementById('btn').addEventListener('click', saveClient)

document.querySelector('#tbClient>tbody').addEventListener('click', editDelete)
