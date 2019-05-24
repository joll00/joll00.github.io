

// creates tables and adds data
function createTableView(team) {
    const tableArea = document.getElementById(team.id)

    tableArea.innerHTML = ''

    const table = document.createElement('table')
    table.setAttribute('class', 'table table-sm shadow p-3 mb-5 bg-white rounded font-weight-bold')

    tableArea.appendChild(table)

    const tableHead = document.createElement('thead')
    tableHead.setAttribute('class', 'thead-dark')
    if(team.id === "9") {
      tableHead.innerHTML = `<tr>
                              <th scope="row" colspan="4" class="text-center">${team.manager}&nbsp;<i class="fas fa-utensil-spoon theme"></i></th>
                          </tr>
                          <tr>
                          <th scope="col">Pos</th>
                          <th scope="col">Club</th>
                          <th scope="col">Name</th>
                          <th scope="col">Price</th>
                          </tr>`
    } else {
    tableHead.innerHTML = `<tr>
                              <th scope="row" colspan="4" class="text-center">${team.manager}</th>
                          </tr>
                          <tr>
                          <th scope="col">Pos</th>
                          <th scope="col">Club</th>
                          <th scope="col">Name</th>
                          <th scope="col">Price</th>
                          </tr>`
    }

    table.appendChild(tableHead)
    // GK1 row
    const tableBody = document.createElement('tbody')
    const trGK1 = document.createElement('tr')
    const thGK1 = document.createElement('th')
    thGK1.setAttribute('scope', 'row')
    thGK1.setAttribute('id', `GK1-${team.id}`)
    thGK1.innerHTML = 'GK'

    table.appendChild(tableBody)
    tableBody.appendChild(trGK1)
    trGK1.appendChild(thGK1)

    checkForPlayer(team.GK[0], trGK1)

    // GK2 row
    const trGK2 = document.createElement('tr')
    const thGK2 = document.createElement('th')
    thGK2.setAttribute('scope', 'row')
    thGK2.setAttribute('id', `GK2-${team.id}`)
    thGK2.innerHTML = 'GK'

    tableBody.appendChild(trGK2)
    trGK2.appendChild(thGK2)

    checkForPlayer(team.GK[1], trGK2)

    // D1 row
    const trD1 = document.createElement('tr')
    const thD1 = document.createElement('th')
    thD1.setAttribute('scope', 'row')
    thD1.setAttribute('id', `D1-${team.id}`)
    thD1.innerHTML = 'DEF'

    tableBody.appendChild(trD1)
    trD1.appendChild(thD1)

    checkForPlayer(team.DEF[0], trD1)

    // D2 row
    const trD2 = document.createElement('tr')
    const thD2 = document.createElement('th')
    thD2.setAttribute('scope', 'row')
    thD2.setAttribute('id', `D2-${team.id}`)
    thD2.innerHTML = 'DEF'

    tableBody.appendChild(trD2)
    trD2.appendChild(thD2)

    checkForPlayer(team.DEF[1], trD2)
    
    // D3 row
    const trD3 = document.createElement('tr')
    const thD3 = document.createElement('th')
    thD3.setAttribute('scope', 'row')
    thD3.setAttribute('id', `D3-${team.id}`)
    thD3.innerHTML = 'DEF'

    tableBody.appendChild(trD3)
    trD3.appendChild(thD3)

    checkForPlayer(team.DEF[2], trD3)

    // D4 row
    const trD4 = document.createElement('tr')
    const thD4 = document.createElement('th')
    thD4.setAttribute('scope', 'row')
    thD4.setAttribute('id', `D4-${team.id}`)
    thD4.innerHTML = 'DEF'

    tableBody.appendChild(trD4)
    trD4.appendChild(thD4)

    checkForPlayer(team.DEF[3], trD4)

    // D5 row
    const trD5 = document.createElement('tr')
    const thD5 = document.createElement('th')
    thD5.setAttribute('scope', 'row')
    thD5.setAttribute('id', `D5-${team.id}`)
    thD5.innerHTML = 'DEF'

    tableBody.appendChild(trD5)
    trD5.appendChild(thD5)

    checkForPlayer(team.DEF[4], trD5)

    // M1 row
    const trM1 = document.createElement('tr')
    const thM1 = document.createElement('th')
    thM1.setAttribute('scope', 'row')
    thM1.setAttribute('id', `M1-${team.id}`)
    thM1.innerHTML = 'MID'

    tableBody.appendChild(trM1)
    trM1.appendChild(thM1)

    checkForPlayer(team.MID[0], trM1)

    // M2 row
    const trM2 = document.createElement('tr')
    const thM2 = document.createElement('th')
    thM2.setAttribute('scope', 'row')
    thM2.setAttribute('id', `M2-${team.id}`)
    thM2.innerHTML = 'MID'

    tableBody.appendChild(trM2)
    trM2.appendChild(thM2)

    checkForPlayer(team.MID[1], trM2)

    // M3 row
    const trM3 = document.createElement('tr')
    const thM3 = document.createElement('th')
    thM3.setAttribute('scope', 'row')
    thM3.setAttribute('id', `M3-${team.id}`)
    thM3.innerHTML = 'MID'

    tableBody.appendChild(trM3)
    trM3.appendChild(thM3)

    checkForPlayer(team.MID[2], trM3)

    // M4 row
    const trM4 = document.createElement('tr')
    const thM4 = document.createElement('th')
    thM4.setAttribute('scope', 'row')
    thM4.setAttribute('id', `M4-${team.id}`)
    thM4.innerHTML = 'MID'

    tableBody.appendChild(trM4)
    trM4.appendChild(thM4)

    checkForPlayer(team.MID[3], trM4)

    // M5 row
    const trM5 = document.createElement('tr')
    const thM5 = document.createElement('th')
    thM5.setAttribute('scope', 'row')
    thM5.setAttribute('id', `M5-${team.id}`)
    thM5.innerHTML = 'MID'

    tableBody.appendChild(trM5)
    trM5.appendChild(thM5)

    checkForPlayer(team.MID[4], trM5)

    // F1 row
    const trF1 = document.createElement('tr')
    const thF1 = document.createElement('th')
    thF1.setAttribute('scope', 'row')
    thF1.setAttribute('id', `F1-${team.id}`)
    thF1.innerHTML = 'FWD'

    tableBody.appendChild(trF1)
    trF1.appendChild(thF1)

    checkForPlayer(team.FWD[0], trF1)

    // F2 row
    const trF2 = document.createElement('tr')
    const thF2 = document.createElement('th')
    thF2.setAttribute('scope', 'row')
    thF2.setAttribute('id', `F2-${team.id}`)
    thF2.innerHTML = 'FWD'

    tableBody.appendChild(trF2)
    trF2.appendChild(thF2)

    checkForPlayer(team.FWD[1], trF2)

    // F3 row
    const trF3 = document.createElement('tr')
    const thF3 = document.createElement('th')
    thF3.setAttribute('scope', 'row')
    thF3.setAttribute('id', `F3-${team.id}`)
    thF3.innerHTML = 'FWD'

    tableBody.appendChild(trF3)
    trF3.appendChild(thF3)

    checkForPlayer(team.FWD[2], trF3)

    // Money remaining
    const trBudget = document.createElement('tr')
    trBudget.innerHTML = `<th scope="row" id="${team.id}budget"></th>
                              <td></td>
                              <td></td>
                              <td id="${team.id}money" class="font-weight-bold">£${team.budget}M</td>`

    tableBody.appendChild(trBudget)                              
}

// Checks to see if a player is held in the teams position array. Displayed if it is.
function checkForPlayer(position, tablePos) {

    const tdClub = document.createElement('td')
    const tdName = document.createElement('td')
    const tdCost = document.createElement('td')
  
    if (position) {
        tdClub.innerHTML = `${position.club_code}`
        tdName.innerHTML = `${position.jersey_name}`
        tdCost.innerHTML = `£${position.cost}M`
    } else {
      tdClub.innerHTML = '-'
      tdName.innerHTML = '-'
      tdCost.innerHTML = '-'
    }
    tablePos.appendChild(tdClub)
    tablePos.appendChild(tdName)
    tablePos.appendChild(tdCost)
  }

  // change text colour depending on money left (from black to red) change to a switch case? either way needs work
function colourChange(team) {
    colourOfMoney = document.getElementById(`${team.id}money`)
    if (team.budget <= 80 && team.budget >= 71) {
      colourOfMoney.style.color = "#3d2500"
    } else if (team.budget <= 70 && team.budget >= 61) {
      colourOfMoney.style.color = "#160208"
    } else if (team.budget <= 60 && team.budget >= 51) {
      colourOfMoney.style.color = "#330613"
    } else if (team.budget <= 50 && team.budget >= 41) {
      colourOfMoney.style.color = "#540b20"
    } else if (team.budget <= 40 && team.budget >= 31) {
      colourOfMoney.style.color = "#72102c"
    } else if (team.budget <= 30 && team.budget >= 21) {
      colourOfMoney.style.color = "#96163b"
    } else if (team.budget <= 20 && team.budget >= 11) {
      colourOfMoney.style.color = "#c61f4f"
    } else if (team.budget <= 10) {
      colourOfMoney.style.color = "#ff2a68"
    }
  }

  // displays list of players after it has been shuffled and displays whos pick it is each time a player is added
  function populate() {

    const currentPlayer = document.getElementById('currentPlayer')
    currentPlayer.setAttribute('class', 'fadeIn')
    currentPlayer.innerHTML = order[0]
  
    const nextPlayer = document.getElementById('nextPlayer')
    nextPlayer.setAttribute('class', 'fadeIn')
    nextPlayer.innerHTML = order[9]
  }
  
  function updatePick() {
    const currentPlayer = document.getElementById('currentPlayer')
    currentPlayer.setAttribute('class', 'fadeOut')
  
    const nextPlayer = document.getElementById('nextPlayer')
    nextPlayer.setAttribute('class', 'fadeOut')
  
    setTimeout(populate, 2000)
  
  }
  
  function populateModal () {
    document.getElementById('pick1').innerHTML = order[0]
    document.getElementById('pick2').innerHTML = order[9]
    document.getElementById('pick3').innerHTML = order[8]
    document.getElementById('pick4').innerHTML = order[7]
    document.getElementById('pick5').innerHTML = order[6]
    document.getElementById('pick6').innerHTML = order[5]
    document.getElementById('pick7').innerHTML = order[4]
    document.getElementById('pick8').innerHTML = order[3]
    document.getElementById('pick9').innerHTML = order[2]
    document.getElementById('pick10').innerHTML = order[1]
  }

  // once start button pressed. shuffle the array then display the pick order in a modal. 
  $('#randomise').click(function() {
  
    shuffle(order)
    populateModal()  
  
      const nextPick = document.getElementById('nextPick')
      nextPick.innerHTML = `<div class="col-12 offset-0 col-md-6 offset-md-0 col-lg-3 offset-lg-3">
                                <h4 class="py-1">Current Pick&nbsp;&nbsp;&nbsp;<i class="fas fa-arrow-circle-right theme"></i>&nbsp;&nbsp;&nbsp;<span id="currentPlayer" class="fadeIn"></span></h4>
                            </div>
                            <div class="col-12 offset-0 col-md-6 offset-md-0 col-lg-3 offset-lg-1">
                                <h4 class="py-1">Next Pick&nbsp;&nbsp;&nbsp;<i class="fas fa-arrow-circle-right theme"></i>&nbsp;&nbsp;&nbsp;<span id="nextPlayer" class="fadeIn"></span></h4>
                            </div>`
  
      populate()
  })

// Create tables for all teams - should be part an init function?
teams.forEach( team => {
    menuManager(`${team.lastName}`, 'managerSelect')
    createTableView(team)
})

clubs.forEach( club => {
  menuManager(`${club.name}`, 'clubSelect')
})

// check local storage
function checkLocal(){

    let retrieveTeamData = localStorage.getItem('teamData')
    if (retrieveTeamData) {
      teams = JSON.parse(retrieveTeamData)
  
      teams.forEach( team => {
        createTableView(team)
        colourChange(team)
    })
    }
  }
  
  checkLocal()