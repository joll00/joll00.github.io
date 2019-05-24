// helper functions, some are not in use

// potentially useful at some point... finds the player from the clubs array if required.
function playerFinder (club, position, player) {
    let clubFound = clubs.find( c => {
      return c.name === club
    })
  
    let playerFound = clubFound[position].find( p => {
      return p.jersey_name === player
    })
    return playerFound
  }