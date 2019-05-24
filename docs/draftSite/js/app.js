// bags fantasy auction site

var prem;
var teamData;
let teams = []
const clubs = []
let order =["JOLLY","MITCHAM","NAYLOR","BARBER","DREWETT","WHITWAM","PICKEN","QUINN","ALDERSLEY","WILMAN"]

// team constructor
function Team (manager, name, lastName, id) {
  this.name = name,
  this.lastName = lastName,
  this.manager = manager,
  this.id = id,
  this.budget = 100,
  this.GK = [],
  this.DEF = [],
  this.MID = [],
  this.FWD = [],
  this.bets = []
}

// create teams
const jolly = new Team ("Andrew Jolly", "Bacuna Matata", "Jolly", "1")
const roost = new Team ("Thomas Mitcham", "An otherwise splendid affair", "Mitcham", "2")
const silv = new Team ("Richard Naylor", "Ricky's Dickies", "Naylor", "3")
const barb = new Team ("Nathan Barber", "Barb & The Benchwarmers", "Barber", "4")
const carly = new Team ("Carl Drewett", "Hung Like a Bony", "Drewett", "5")
const whitty = new Team ("Matthew Whitwam", "Big Strikers", "Whitwam", "6")
const wilm = new Team ("Tom Wilman", "Dr Muck", "Wilman", "7")
const fraz = new Team ("Fraser Picken", "Headbangers", "Picken", "8")
const dr = new Team ("Cameron Quinn", "Harry's coming home", "Quinn", "9")
const ste = new Team ("Stephen Aldersley", "Jose Borinio", "Aldersley", "10")

teams.push(jolly,roost,silv,barb,carly,whitty,wilm,fraz,dr,ste)

function Club (name, id) {
  this.name = name,
  this.id = id,
  this.GK = [],
  this.DEF = [],
  this.MID = [],
  this.FWD = []
}

// clubs to store players
clubs.push(new Club ("ARS", "c1"), new Club ("BOU", "c2"), new Club ("BHA", "c3"), new Club ("BUR", "c4"), new Club ("CAR", "c5"))
clubs.push(new Club ("CHE", "c6"), new Club ("CRY", "c7"), new Club ("EVE", "c8"), new Club ("LEI", "c9"), new Club ("LIV", "c10"))
clubs.push(new Club ("MCI", "c11"), new Club ("MUN", "c12"), new Club ("NEW", "c13"), new Club ("NOR", "c14"), new Club ("SHU", "c15"))
clubs.push(new Club ("SOU", "c16"), new Club ("TOT", "c17"), new Club ("WAT", "c18"), new Club ("WHU", "c19"), new Club ("WOL", "c20"))

// player sorter
function playerSorter(player) {
  for(let i = 0; i < clubs.length; i++) {
    if(player.club_code == clubs[i].name) {
          if(player.position === "Goalkeeper") {
            clubs[i].GK.push(player)
          } else if (player.position === "Defender") {
            clubs[i].DEF.push(player)
          } else if (player.position === "Midfielder") {
            clubs[i].MID.push(player)
          } else if (player.position === "Forward") {
            clubs[i].FWD.push(player)
          }
    }
  }
}

    // Fetch prem data
    fetch('../json/PremData.json')
    // fetch('https://raw.githubusercontent.com/drraq/PremierLeague.json/master/data.json')
            .then(function(response) {
            if (response.status !== 200) {
            console.log('Looks like there was a problem with the prem data. Status Code: ' +
            response.status);
            return;
            }

            response.json().then(data => {
                prem = data
                  prem.players.forEach( player => {
                    playerSorter(player)
                  })
                })
            })

            .catch(function(err) {
            console.log('Fetch Error with the prem data :-S', err);
        });

function menuManager(team, id) {
  const menu = document.getElementById(id)
  const option = document.createElement('option')
  option.innerHTML = team

  menu.appendChild(option)
}

// allocate selected player to team
function addPlayer (team, playerId) {
    const findPlayer = prem.players.find( p => {
        return p.jersey_name === playerId
    })
    if (findPlayer.position === 'Goalkeeper' && team.GK.length < 2) {
        team.GK.push(findPlayer) 
        findPlayer.notAvailable = true
    } else if (findPlayer.position === 'Defender' && team.DEF.length < 5) {
        team.DEF.push(findPlayer)
        findPlayer.notAvailable = true
    } else if (findPlayer.position === 'Midfielder' && team.MID.length < 5) {
        team.MID.push(findPlayer)
        findPlayer.notAvailable = true
    } else if (findPlayer.position === 'Forward' && team.FWD.length < 3) {
        team.FWD.push(findPlayer)
        findPlayer.notAvailable = true
    } else {
        alert('unable to add player')
    }
}

// random order picker shuffles the array of ID's. 
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// changes the current and next pick. current pick is always array index[0] and next player is index[9]
function swap () {
  const nextPlayer = order.pop()
  order.unshift(nextPlayer)
}



