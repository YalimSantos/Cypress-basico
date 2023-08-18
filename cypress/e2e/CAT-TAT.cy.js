/// <referenceFile = Cypress/>

describe('Central de atendimento ao cliente TAT', () => {
  beforeEach('Visitando a página', () => {
    cy.visit('./src/index.html')
  })

  // Executa o teste 3 vezes
  Cypress._.times(3, () => {
    it('Verifica o título da aplicação', () => {
      cy.title().should('equal', 'Central de Atendimento ao Cliente TAT')
    })
  })

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, ' + 
    'abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, ' +
    'abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, ' +
    'abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, ' +
    'abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, ' +
    'abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, abc, ' +
    'abc,'

    cy.clock()

    cy.get('#firstName').type('Yalim')
    cy.get('#lastName').type('Santos')
    cy.get('#email').type('yalim@gmail.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')

    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('Exibe mensagem de erro ao digitar email com formatação incorreta', () => {
    cy.get('#firstName').type('Yalim')
    cy.get('#lastName').type('Santos')
    cy.get('#email').type('yalimgmail.com')
    cy.get('#open-text-area').type('comentário', { delay: 0 })
    cy.get('button[type="submit"]').click()
    
    cy.get('.error').should('be.visible')
  })

  it('Não deve deixar digitar palavras no campo "Telefone"', () => {
    cy.get('#phone').type('abc').should('be.empty')
  })

  it('Exibe mensagem de erro quando telefone vira obrigatório e não é preenchido', () => {
    cy.get('#phone-checkbox').check()

    cy.get('#firstName').type('Yalim')
    cy.get('#lastName').type('Santos')
    cy.get('#email').type('yalim@gmail.com')
    cy.get('#open-text-area').type('abc', { delay: 0 })
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })

  it('Exibe mensagem de erro ao enviar formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })

  it('Envia formulário usando comando personalizado', () => {
    cy.fillAllMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
  })

  it('Clicando no botão usando o "Contains"', () => {
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
  })

  it('Seleciona um produto pelo texto "YouTube"', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })

  it('Seleciona um produto pelo seu valor "mentoria"', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })

  it('Seleciona um produto pelo seu indice "Blog"', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('Marca o atendimento "Feedback"', () => {
    cy.get('input[value=feedback]').check().should('be.checked')
  })

  it('Marca todos os radio buttons', () => {
    cy.get('input[type=radio]').should('have.length', 3).each($input => {
      cy.wrap($input).check().should('be.checked')
    })
  })

  it('Marca ambos os checkbox e depois desmarca o último', () => {
    cy.get('input[type="checkbox"]').check().should('be.checked')
      .last().uncheck().should('not.be.checked')
  })

  it('Seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload').should('not.have.value')
    cy.get('#file-upload').selectFile('./cypress/fixtures/example.json')
      .should(($input) => {
        // console.log($input)
        expect($input[0].files[0].name).to.be.equal('example.json')
      })
  })

  it('Seleciona um arquivo usando drag and drop', () => {
    cy.get('#file-upload').should('not.have.value')
    cy.get('#file-upload').selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(($input) => {
        // console.log($input)
        expect($input[0].files[0].name).to.be.equal('example.json')
      })
  })

  it('Seleciona um arquivo usando uma fixture q foi dado um alias', () => {
    cy.fixture('example.json').as('exampleFile')

    cy.get('#file-upload').should('not.have.value')
    cy.get('#file-upload').selectFile('@exampleFile', { action: 'drag-drop' })
      .should(($input) => {
        // console.log($input)
        expect($input[0].files[0].name).to.be.equal('example.json')
      })
  })

  it('Garante que link abre em outra aba sem clicar nele', () => {
    cy.get('#privacy > a').should('have.attr', 'target', '_blank')
  })

  it('Clique no link após remover o target', () => {
    cy.get('#privacy > a').should('have.attr', 'target', '_blank')
      .invoke('removeAttr', 'target').click()

    cy.url().should('contain', 'privacy.html')
  }) 

  it('Exibe e esconde a mensagem de sucesso', () => {
    cy.get('.success').should('not.be.visible')
      .invoke('show').should('be.visible')
      .invoke('hide').should('not.be.visible')
  })

  it('Preenche a área de texto usando invoke val', () => {
    // Cria uma string com esses valores repetidos 20 vezes
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area').invoke('val', longText)
      .should('have.value', longText)
  })

  it('Faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should((res) => {
        expect(res.status).to.be.equal(200)
        expect(res.statusText).to.be.equal('OK')
        expect(res.body).to.include('CAC TAT')
      })
  })
})