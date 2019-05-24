// only display players that fit criteria
$('#positionSelect').change(function() {
    if (clubSelect.value !== "-") {
      let selectedClub = clubs.find( club => {
        return club.name == clubSelect.value
      })
      console.log(selectedClub[positionSelect.value])
      let selections = selectedClub[positionSelect.value]
      const players = document.getElementById('nameSelect')
      players.innerHTML = ''
  
      for(let i = 0; i < selections.length; i++) {
        if (!selections[i].notAvailable) {
        let player = document.createElement('option')
        player.innerHTML = `${selections[i].jersey_name}`
  
        players.appendChild(player)
        }
      }
    }
  })
  
  $('#clubSelect').change(function() {
    if (positionSelect.value !== "-" && clubSelect.value !== "-") {
      let selectedClub = clubs.find( club => {
        return club.name == clubSelect.value
      })
  
      let selections = selectedClub[positionSelect.value]
      const players = document.getElementById('nameSelect')
      players.innerHTML = ''
  
      for(let i = 0; i < selections.length; i++) {
        if (!selections[i].notAvailable) {
        let player = document.createElement('option')
        player.innerHTML = `${selections[i].jersey_name}`
  
        players.appendChild(player)
        }
      }
    }
  })

  // on submit button press
$('#enterBtn').click(function() {
    // find team object
    const team = teams.find( team => {
    return team.lastName === managerSelect.value
    })
  
    if(managerSelect.value !== "-" && positionSelect.value !== "-" && clubSelect.value !== "-" && nameSelect.value !== "-") {
      
      if(playerPrice.value === "") {
        playerPrice.value = "0"
      }
      
      // add selected player to team object
      addPlayer(team, nameSelect.value)
      
      // deduct fee from team budget if they have money remaining
      if (team.budget > 0) {
        team.budget = team.budget - parseInt(playerPrice.value)
      } 
      
      let purchasedPlayer = playerFinder(clubSelect.value, positionSelect.value, nameSelect.value)
      purchasedPlayer.cost = playerPrice.value
  
      // update the table view
      createTableView(team)
      colourChange(team)
  
      // reset the form
      managerSelect.value = "-"
      positionSelect.value = "-"
      clubSelect.value = "-"
      nameSelect.value = "-"
      playerPrice.value = ""
  
      // empty local storage
      localStorage.clear()
  
      teamData = teams
      
      // add to local storage
      localStorage.setItem('teamData', JSON.stringify(teamData))
  
      // swap pick order and display
      swap()
      updatePick()
  
    }
  })
  
  // stop enter key refreshing the page
  $("#enterBtn").bind('keydown', function(event){ 
    if(event.keyCode == 13){ 
      event.preventDefault();
    }
  });
  
  $("#playerPrice").bind('keydown', function(event){ 
    if(event.keyCode == 13){ 
      event.preventDefault();
    }
  });