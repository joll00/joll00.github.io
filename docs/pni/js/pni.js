
var map, infoWindow, fakeRest, marker, starRangeValues, addRestaurantLocation, service, serviceMoreDetail, request, newRequest;

var markers = []
var googleRestaurants = []
var addRestaurantToggle = false
var zoomChanged = false

function initMap() {
    // center on Belfast until JSON loads
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 54.597, lng: -5.930},
    zoom: 12
    });

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation. get users current position and center there.
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // current position marker
      marker = new google.maps.Marker({
        position: pos,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: 'rgb(204, 227, 252',
          fillOpacity: 0.8,
          strokeColor: '#007bff',
          strokeWeight: 4
        },
        draggable: false,
        map: map
      });

      map.setCenter(pos);

    // get data from google places and display at user location

    request = {
        location: pos,
        radius: '5000',
        type: 'restaurant'
    }

    service = new google.maps.places.PlacesService(map)
    service.textSearch(request, callback)

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //console.log(results)
            for (let i = 0; i < 10; i++) {
                newRequest = {
                    placeId: results[i].place_id,
                    fields: ['id','name','formatted_address','formatted_phone_number','geometry', 'icon', 'photo','opening_hours','review'],
                }
             
                serviceMoreDetail = new google.maps.places.PlacesService(map);
                serviceMoreDetail.getDetails(newRequest, callback);
            
                function callback(place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        //console.log(place)
                        googleRestaurants.push(place)
                        initRestData(place, place.id)
                    }
                }   
            }
        }
    }

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });

    } else {
    // Browser doesn't support Geolocation
    map.setCenter({lat: 54.597, lng: -5.930})
    handleLocationError(false, infoWindow, map.getCenter());

    }
    

    // Fetch JSON file of fake restaurants
    fetch('../json/pni.json')
            .then(function(response) {
            if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            return;
            }

            response.json().then(data => {
                fakeRest = data
                    fakeRest.forEach(item => {
                        item.id = Math.floor(Math.random() * 1000000)
                        item.rating = 3
                    })
                })
            })

            .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

    // when map is clicked addRestaurantLocation is updated with position that is clicked
    map.addListener('click', function(e) {
        addRestaurantLocation = {
            lat: e.latLng.lat(), 
            lng: e.latLng.lng()
        }
        console.log(addRestaurantLocation)
        if (addRestaurantToggle) {
        $('#addRestaurantModal').modal('show')
        } 
    })

    //when map is dragged search clear map and return restaurants within new map bounds. 
    //only return restaurants that have not already been found.

    google.maps.event.addListener(map, 'dragend', function() {
        const restArea = document.getElementById('restArea')
        restArea.innerHTML = ''  
        
        setMapOnAll(null)
        markers = []

        let mapArea = map.getBounds()

        request = {
            bounds: mapArea,
            type: 'restaurant'
        }
    
        service = new google.maps.places.PlacesService(map)
        service.textSearch(request, callback)
    
        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                //console.log(results)
                for (let i = 0; i < 10; i++) {
                     
                    let alreadyFound = googleRestaurants.find(restaurant => {
                        return restaurant.id === results[i].id
                    })
                    // console.log(alreadyFound)

                    if (!alreadyFound) {
                    newRequest = {
                        placeId: results[i].place_id,
                        fields: ['id','name','formatted_address','formatted_phone_number','geometry', 'icon', 'photo','opening_hours','review','rating'],
                    }
                 
                    serviceMoreDetail = new google.maps.places.PlacesService(map);
                    serviceMoreDetail.getDetails(newRequest, callback);
                
                    function callback(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            googleRestaurants.push(place)
                            }
                        }
                    }
                }
            }
        
            fakeRest.forEach(item => {
                let checkMap = mapArea.contains(item.geometry.location)
                    if (checkMap) {
                        ranges(item, item.id, item.rating)
                    }
                })
            googleRestaurants.forEach(item => {
                let checkMap = mapArea.contains(item.geometry.location)
                    if (checkMap) {
                        ranges(item, item.id, item.rating)
                    }
                })    

        }
    })

    //when map is zoomed in or out only show restaurants in map bounds
    google.maps.event.addListener(map, 'zoom_changed', function() {
        zoomChanged = true;
    });

    google.maps.event.addListener(map, 'bounds_changed', function(){
        if (zoomChanged) {
            zoomChanged = false

        let mapArea = map.getBounds()
        setMapOnAll(null)
        markers = []
        const restArea = document.getElementById('restArea')
        restArea.innerHTML = ''  

        fakeRest.forEach(item => {
            let checkMap = mapArea.contains(item.geometry.location)
            if (checkMap) {
                ranges(item, item.id, item.rating)
            }
        })
        googleRestaurants.forEach(item => {
            let checkMap = mapArea.contains(item.geometry.location)
            if (checkMap) {
                ranges(item, item.id, item.rating)
            }
        })
    }
    })

    // when slider is moved, only restaurants in given range are displayed
    slider.noUiSlider.on('update', function(values, handle) {
        starRangeValues = values
        let mapArea = map.getBounds()
        setMapOnAll(null)
        markers = []
        const restArea = document.getElementById('restArea')
        restArea.innerHTML = ''
        fakeRest.forEach(item => {
            let checkMap = mapArea.contains(item.geometry.location)
            if (checkMap) {
                ranges(item, item.id, item.rating)
            }
        })
        googleRestaurants.forEach(item => {
            let checkMap = mapArea.contains(item.geometry.location)
            if (checkMap) {
                ranges(item, item.id, item.rating)
            }
        })
    })

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

// displays restaurants on right hand side of map
function displayRestView (item, id) {
    
    const restArea = document.getElementById('restArea')

    const row = document.createElement('div')
    row.setAttribute('id', `rest-${id}`)
    row.setAttribute('class', 'row mb-2 mx-1 border')

    restArea.appendChild(row)
    // image area
    const image = document.createElement('div')
    image.setAttribute('id', `restImage-${id}`)
    image.setAttribute('class', 'col-6 col-sm-5 col-lg-4')

    row.appendChild(image)

    // rest title
    const nameArea = document.createElement('div')
    nameArea.setAttribute('class', 'col-6 col-sm-7 col-lg-8')
    
    // try the new function
    const name = document.createElement('h6')
    name.setAttribute('id', `restName-${id}`)
    name.setAttribute('class', 'text-center mt-2')
    name.innerHTML = checkExists(item.name)


    row.appendChild(nameArea)
    nameArea.appendChild(name)

    // small review
    const revRow = document.createElement('div')
    revRow.setAttribute('class', 'row')

    const revCol = document.createElement('div')
    revCol.setAttribute('class', 'd-none d-lg-block col-lg-6')

    const firstRev = document.createElement('p')
    firstRev.setAttribute('id', `firstRev-${id}`)
    firstRev.setAttribute('class', 'text-center font-italic miniRev')

    nameArea.appendChild(revRow)
    revRow.appendChild(revCol)
    revCol.appendChild(firstRev)

    // address and phone stars and buttons
    const restDetails = document.createElement('div')
    restDetails.setAttribute('class', 'col-sm-12 col-lg-6 text-center text-lg-right')

    const restAddress = document.createElement('p')
    restAddress.setAttribute('id', `restAddress-${id}`)
    restAddress.setAttribute('class', 'reduce mb-0')
    restAddress.innerHTML = checkExists(item.formatted_address)
    
    const restPhone = document.createElement('p')
    restPhone.setAttribute('id',`restPhone-${id}`)
    restPhone.setAttribute('class', 'reduce mb-0')
    restPhone.innerHTML = checkExists(item.formatted_phone_number)

    revRow.appendChild(restDetails)
    restDetails.appendChild(restAddress)
    restDetails.appendChild(restPhone)

    // star rating
    const rating = document.createElement('div')
    rating.setAttribute('id', `restRating-${id}`)

    restDetails.appendChild(rating)

    // see all reviews button
    const moreInfo = document.createElement('div')
    moreInfo.setAttribute('id', `moreInfoBtn-${id}`)

    const moreInfoLink = document.createElement('a')
    moreInfoLink.setAttribute('href', '#moreInfo')

    const moreInfoButton = document.createElement('button')
    moreInfoButton.setAttribute('type', 'button')
    moreInfoButton.setAttribute('class', 'btn btn-outline-info btn-sm my-1')
    moreInfoButton.innerHTML = 'Reviews'

    restDetails.appendChild(moreInfo)
    moreInfo.appendChild(moreInfoLink)
    moreInfoLink.appendChild(moreInfoButton)

    // see all reviews reviews button on click
    $(`#moreInfoBtn-${id}`).click(function() {
        moreInfoView(item, id)
        moreInfoHours(item, id)
        moreInfoRestRating(item, id)
        moreReviews(item, id)
        moreInfoStreetView(item, id)
    })
}
// displays more info and all reviews below map section
function moreInfoView (item, id) {
    const moreInfo = document.getElementById('moreInfo')
    moreInfo.innerHTML = ''

    const moreInfoRow = document.createElement('div')
    moreInfoRow.setAttribute('class', 'row py-3 border-top')

    moreInfo.appendChild(moreInfoRow)

    const moreInfoCol = document.createElement('div')
    moreInfoCol.setAttribute('class', 'col-12 col-md-4 col-lg-3 offset-lg-1 text-center mb-2')

    moreInfoRow.appendChild(moreInfoCol)

    // rest title
    const moreInfoName = document.createElement('h4')
    moreInfoName.setAttribute('id', `moreInfoName-${id}`)
    moreInfoName.innerHTML = checkExists(item.name)

    // rest image will be from google street view
    const moreInfoImage = document.createElement('img')
    moreInfoImage.setAttribute('id', `streetImage-${id}`)
    moreInfoImage.setAttribute('class', 'img-fluid rounded mx-auto')
    moreInfoImage.setAttribute('alt', 'Restaurant Image')

    moreInfoCol.appendChild(moreInfoName)
    moreInfoCol.appendChild(moreInfoImage)

    // details 
    const moreInfoDetail = document.createElement('div')
    moreInfoDetail.setAttribute('class', 'col-12 col-md-8 col-lg-7')

    const moreInfoDetailRow = document.createElement('div')
    moreInfoDetailRow.setAttribute('class', 'row text-center')

    moreInfoRow.appendChild(moreInfoDetail)
    moreInfoDetail.appendChild(moreInfoDetailRow)

    // opening hours
    const moreInfoHoursCol = document.createElement('div')
    moreInfoHoursCol.setAttribute('class', 'col-12 col-md-7 col-lg-6 mt-4')

    moreInfoDetailRow.appendChild(moreInfoHoursCol)

    const hoursTitle = document.createElement('h5')
    hoursTitle.innerHTML = 'Opening Hours '

    hoursIcon = document.createElement('span')
    hoursIcon.setAttribute('class', 'far fa-clock-o')

    moreInfoHoursCol.appendChild(hoursTitle)
    hoursTitle.appendChild(hoursIcon)

    const hoursDetail = document.createElement('div')
    hoursDetail.setAttribute('id', `times-${id}`)
    hoursDetail.setAttribute('class', 'text-md-left reduceB')

    moreInfoHoursCol.appendChild(hoursDetail)

    // address and phone
    const moreInfoAddress = document.createElement('div')
    moreInfoAddress.setAttribute('class', 'col-12 col-md-5 col-lg-6 mt-4')

    moreInfoDetailRow.appendChild(moreInfoAddress)
    
    const moreInfoAddressDetail = document.createElement('p')
    moreInfoAddressDetail.setAttribute('id', `moreInfoAddress-${id}`)
    moreInfoAddressDetail.innerHTML = checkExists(item.formatted_address)

    const moreInfoPhoneDetail = document.createElement('p')
    moreInfoPhoneDetail.setAttribute('id', `moreInfoPhone-${id}`)
    moreInfoPhoneDetail.innerHTML = checkExists(item.formatted_phone_number)

    moreInfoAddress.appendChild(moreInfoAddressDetail)
    moreInfoAddress.appendChild(moreInfoPhoneDetail)

    // cuisine
    const cuisineRow = document.createElement('div')
    cuisineRow.setAttribute('class', 'row')

    const cuisineCol = document.createElement('div')
    cuisineCol.setAttribute('class', 'col-12')

    const cuisineTitle = document.createElement('h5')
    cuisineTitle.innerHTML = 'Cuisine'

    const cuisineData = document.createElement('p')
    cuisineData.setAttribute('id', `cuisine-${id}`)
    cuisineData.innerHTML = checkExists(item.cuisine)

    moreInfoAddress.appendChild(cuisineRow)
    cuisineRow.appendChild(cuisineCol)
    cuisineCol.appendChild(cuisineTitle)
    cuisineCol.appendChild(cuisineData)

    // star rating
    const moreInfoRating = document.createElement('div')
    moreInfoRating.setAttribute('id', `restRatingMore-${id}`)
    moreInfoRating.setAttribute('class', 'col-12 mb-2')

    cuisineRow.appendChild(moreInfoRating)

    // add review button
    const addReviewBtnRow = document.createElement('div')
    addReviewBtnRow.setAttribute('class', 'row mt-1')

    const addReviewBtnCol = document.createElement('div')
    addReviewBtnCol.setAttribute('class', 'col-10 text-center pr-0')

    const addReviewBtnLink = document.createElement('a')
    addReviewBtnLink.setAttribute('href', '#addReviewHere')

    const addReviewBtn = document.createElement('button')
    addReviewBtn.setAttribute('type', 'button')
    addReviewBtn.setAttribute('class', 'btn btn-info btn-sm btn-block')
    addReviewBtn.innerHTML = 'Add Review'

    moreInfoDetail.appendChild(addReviewBtnRow)
    addReviewBtnRow.appendChild(addReviewBtnCol)
    addReviewBtnCol.appendChild(addReviewBtnLink)
    addReviewBtnLink.appendChild(addReviewBtn)

    // close button
    const closeBtnCol = document.createElement('div')
    closeBtnCol.setAttribute('class', 'col-2 text-center')

    const closeBtnLink = document.createElement('a')
    closeBtnLink.setAttribute('href', '#')

    const closeBtn = document.createElement('button')
    closeBtn.setAttribute('type', 'button')
    closeBtn.setAttribute('id', 'closeMoreInfo')
    closeBtn.setAttribute('class', 'btn btn-outline-info btn-sm btn-block')

    const closeBtnIcon = document.createElement('i')
    closeBtnIcon.setAttribute('class', 'fas fa-arrow-up')

    addReviewBtnRow.appendChild(closeBtnCol)
    closeBtnCol.appendChild(closeBtnLink)
    closeBtnLink.appendChild(closeBtn)
    closeBtn.appendChild(closeBtnIcon)

    // display reviews
    const moreInfoReviewsRow = document.createElement('div')
    moreInfoReviewsRow.setAttribute('class', 'row')

    const moreInfoReviewsCol = document.createElement('div')
    moreInfoReviewsCol.setAttribute('class', 'col-12')

    const moreInfoReviews = document.createElement('div')
    moreInfoReviews.setAttribute('id', `reviews-${id}`)
    moreInfoReviews.setAttribute('class', 'list-group')

    moreInfo.appendChild(moreInfoReviewsRow)
    moreInfoReviewsRow.appendChild(moreInfoReviewsCol)
    moreInfoReviewsCol.appendChild(moreInfoReviews)

    // add review
    const addReviewCol = document.createElement('div')
    addReviewCol.setAttribute('class', 'col-12 my-3')

    moreInfoReviewsRow.appendChild(addReviewCol)

    const addReviewTitle = document.createElement('h5')
    addReviewTitle.setAttribute('id', 'addReviewHere')
    addReviewTitle.innerHTML = 'Add a Review'

    addReviewCol.appendChild(addReviewTitle)

    // add review Form
    const reviewForm = document.createElement('Form')
    addReviewCol.appendChild(reviewForm)

    // form group name
    const reviewFormGroupName = document.createElement('div')
    reviewFormGroupName.setAttribute('class', 'form-group')

    const reviewNameLabel = document.createElement('label')
    reviewNameLabel.setAttribute('for', 'name')
    reviewNameLabel.innerHTML = 'Name'

    const reviewNameInput = document.createElement('input')
    reviewNameInput.setAttribute('type', 'name')
    reviewNameInput.setAttribute('id', `reviewerName-${id}`)
    reviewNameInput.setAttribute('class', 'form-control')
    reviewNameInput.setAttribute('placeholder', 'Full Name')

    reviewForm.appendChild(reviewFormGroupName)
    reviewFormGroupName.appendChild(reviewNameLabel)
    reviewFormGroupName.appendChild(reviewNameInput)

    // form group rating
    const reviewFormGroupRating = document.createElement('div')
    reviewFormGroupRating.setAttribute('class', 'form-group')

    const reviewFormGroupRatingLabel = document.createElement('label')
    reviewFormGroupRatingLabel.setAttribute('for', 'startRating')
    reviewFormGroupRatingLabel.innerHTML = 'Star Rating'

    const reviewFormGroupSelect = document.createElement('select')
    reviewFormGroupSelect.setAttribute('class', 'form-control')
    reviewFormGroupSelect.setAttribute('id', `starSelection-${id}`)

    reviewForm.appendChild(reviewFormGroupRating)
    reviewFormGroupRating.appendChild(reviewFormGroupRatingLabel)
    reviewFormGroupRating.appendChild(reviewFormGroupSelect)

    for (let o = 1; o < 6; o++) {
        const option = document.createElement('option')
        option.innerHTML = o

        reviewFormGroupSelect.appendChild(option)
    }

    // form group review text
    const reviewFormGroupText = document.createElement('div')
    reviewFormGroupText.setAttribute('class', 'form-group')

    const reviewFormGroupReview = document.createElement('label')
    reviewFormGroupReview.setAttribute('for', 'review')
    reviewFormGroupReview.innerHTML = 'What did you think?'

    const reviewFormGroupTextArea = document.createElement('textArea')
    reviewFormGroupTextArea.setAttribute('class', 'form-control')
    reviewFormGroupTextArea.setAttribute('id', `reviewText-${id}`)
    reviewFormGroupTextArea.setAttribute('rows','5')

    reviewForm.appendChild(reviewFormGroupText)
    reviewFormGroupText.appendChild(reviewFormGroupReview)
    reviewFormGroupText.appendChild(reviewFormGroupTextArea)

    // add review button
    const reviewFormButtonLink = document.createElement('div')
    reviewFormButtonLink.setAttribute('id', `addReview-${id}`)

    const reviewFormButton = document.createElement('a')
    reviewFormButton.setAttribute('href', '#moreInfo')
    reviewFormButton.setAttribute('class', 'btn btn-info')
    reviewFormButton.innerHTML = 'Submit'

    reviewForm.appendChild(reviewFormButtonLink)
    reviewFormButtonLink.appendChild(reviewFormButton)

    $(`#addReview-${id}`).click(function() {
        const name = document.getElementById(`reviewerName-${id}`)
        const text = document.getElementById(`reviewText-${id}`)
        const stars = document.getElementById(`starSelection-${id}`)

        addReview(item,name,stars,text)
        moreReviews(item, id)
        restRating(item, id)
        moreInfoRestRating(item, id)
        firstReview(item, id)
    })

    moreInfo.style.display = "block"

    $("#closeMoreInfo").click(function() {
        const closeMoreInfo = document.getElementById('moreInfo')
        closeMoreInfo.style.display = "none"
    })
}

// checks if name, address, phone, cuisine exits
function checkExists(thing) {
    if (!thing) {
        thing = 'Not Available'
    } 
    return thing
}

// restaurant image
function restImage(item, id) {

    const restImage = document.getElementById(`restImage-${id}`)
    
    if (item.photo) {
        let imageURL = item.photo
        restImage.setAttribute('style', `background: url('${imageURL}') no-repeat center/cover; min-height: 170px;`)
    } else if (item.photos) {
        let imageURL = item.photos[0].getUrl({maxHeight: 300})
        restImage.setAttribute('style', `background: url('${imageURL}') no-repeat center/cover; min-height: 170px;`)
    } else {
        restImage.setAttribute('style', `background: url('images/noImage.png') no-repeat center/cover; min-height: 170px;`)
    }
}

// first review quote
function firstReview (item, id) {
    const firstRev = document.getElementById(`firstRev-${id}`)

    if (item.reviews) {
        firstRev.innerHTML = `${item.reviews[0].text}`
    } else {
        firstRev.innerHTML = 'No reviews available'
    }
}

// opening hours
function moreInfoHours (item, id) {
    const moreInfoHours = document.getElementById(`times-${id}`)

    const hasHours = item.opening_hours
    if (hasHours) {
        const hoursText = item.opening_hours.weekday_text
        hoursText.forEach(item => {
        let day = document.createElement('p')
        day.setAttribute('class', 'my-0')
        day.innerHTML = item
        moreInfoHours.appendChild(day)
    })
    } else {
    noHours = document.createElement('p')
    noHours.innerHTML = 'Opening Hours unavailable'

    moreInfoHours.appendChild(noHours)
}
}

// google street view image
function moreInfoStreetView (item, id) {

    const moreInfoImage = document.getElementById(`streetImage-${id}`)

    const streetView = item.street_view ? item.street_view : `https://maps.googleapis.com/maps/api/streetview?size=600x600&location=${item.geometry.location.lat()},${item.geometry.location.lng()}&heading=270&pitch=-0.76&fov=180&key=AIzaSyDzQywvj-B0jlitV1vMYdIoj2pzo4QFOmU`

    moreInfoImage.setAttribute('src', `${streetView}`)
}

// get average rating and display in stars
function restRating (restaurant, id) {
    let sum = 0
    const stars = document.getElementById(`restRating-${id}`)

    // const hasReviews = restaurant.reviews

    if (restaurant.reviews) {
        const findStars = restaurant.reviews.map(item => {
        return item.rating  
        })
        for (let s = 0; s < findStars.length; s++) {
            sum += findStars[s]
        }

    let avgRating = Math.round(sum/findStars.length)

    restaurant.rating = avgRating

        if (isNaN(avgRating)) {
            noRating(stars)
        } else {
            starGenerator(avgRating, stars)
        }
    } else if (restaurant.rating) {
    starGenerator(Math.round(restaurant.rating), stars)
    } else {
        noRating(stars)
    }  
}

// Star rating for each restaurant in more info section
function moreInfoRestRating (restaurant, id) {
    const rating = restaurant.rating
    const stars = document.getElementById(`restRatingMore-${id}`)

    if (rating) {
        starGenerator(Math.round(rating), stars)
    } else {
        noRating(stars)
    }
}

// display reviews in moreInfo section
function moreReviews (restaurant, id) {
    const reviews = restaurant.reviews

    const allReviews = document.getElementById(`reviews-${id}`)
    allReviews.innerHTML = ''

    if (reviews) {
        for (let r = 0; r < reviews.length; r++) {
            eachReview = document.createElement('div')
            eachReview.setAttribute('class', 'list-group-item')
            eachReview.innerHTML = `<div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${reviews[r].author_name}</h5>
            <small class="text-muted">${reviews[r].relative_time_description}</small>
            </div>
            <p class="mb-1">${reviews[r].text}
            </p>
            <div id="starRating-${id}-${r}">
            </div>
            </div>`

            allReviews.appendChild(eachReview)

            let reviewerRating = reviews[r].rating

            let starRating = document.getElementById(`starRating-${id}-${r}`)
            starGenerator(reviewerRating, starRating)
        }
    } return
}

// generate Star markup
function starGenerator (rating, place) {
    place.innerHTML = ''
    for (let k = 0; k < rating; k++) {
        const icon = document.createElement('i')
        icon.setAttribute('class', 'fas fa-star')
        
        place.appendChild(icon)
    }
}

// no rating markup generator
function noRating(place) {
    place.innerHTML = ''
    const noRating = document.createElement('p')
    noRating.innerHTML = 'No Rating Available'

    place.appendChild(noRating)
}

// add a review
function addReview (restaurant,name,rating,text) {

    const review = {
        author_name: name.value,
        relative_time_description: 'just now',
        rating: parseInt(rating.value),
        text: text.value
    }

    const hasReviews = restaurant.reviews

    if (hasReviews) {
        hasReviews.unshift(review)
    } else {
        restaurant.reviews = []
        restaurant.reviews.unshift(review)
    }
    name.value = ''
    text.value = ''
    rating.value = '1'
}

// add a restaurant details
function addRestaurant () {

    let newRestaurant = {
        name: addRestaurantName.value,
        formatted_address: addRestaurantAddressL1.value + ', ' + addRestaurantCity.value + ' ' + addRestaurantPostcode.value,
        formatted_phone_number: addRestaurantPhone.value,
        street_view: "https://maps.googleapis.com/maps/api/streetview?size=600x600&location=" + addRestaurantLocation.lat + ',' + addRestaurantLocation.lng + "&heading=305&pitch=-0.76&key=AIzaSyDzQywvj-B0jlitV1vMYdIoj2pzo4QFOmU",
        geometry: {
            location: {
                lat: addRestaurantLocation.lat,
                lng: addRestaurantLocation.lng
            }
        },
        cuisine: addRestaurantCuisine.value,
        reviews: [
            {
                author_name: addRestaurantReviewName.value,
                relative_time_description: 'just now',
                rating: parseInt(addRestaurantRating.value),
                text: addRestaurantText.value
            }
        ],
        id: Math.floor(Math.random() * 1000000)
    }

    fakeRest.push(newRestaurant)
    initRestData (newRestaurant, newRestaurant.id)

    addRestaurantName.value = ''
    addRestaurantAddressL1.value = ''
    addRestaurantCity.value = ''
    addRestaurantPostcode.value = ''
    addRestaurantPhone.value = ''
    addRestaurantCuisine.value = ''
    addRestaurantReviewName.value = ''
    addRestaurantRating.value = '1'
    addRestaurantText.value = ''


}

// init rest data. this should be in map?
function initRestData (item, id) {
    displayRestView(item, id)
    restRating(item, id)
    restImage(item, id)
    firstReview(item, id)
    createRestMarker(item)
    setMapOnAll(map)
}

// display marker on map at rest location
function createRestMarker (item) {

    let restInfoWindowContent = 
    `<div class="container">
        <div class="row">
            <div class="col-12 mx-0">
                <h5 class="mb-0">${item.name}</h5>
                <div class="reduce mt-0">${item.formatted_address}</div>
            </div>
        </div>
    </div>`

    const restMarker = new google.maps.Marker({
        position: item.geometry.location, 
        map: map,
    })

    restMarker.info = new google.maps.InfoWindow({
        content: restInfoWindowContent
      });
    
    restMarker.addListener('mouseover', function() {
        restMarker.info.open(map, restMarker);
    });

    restMarker.addListener('mouseout', function() {
        restMarker.info.close();
    });
    markers.push(restMarker)
}

// set the map on all markers in array. 
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map)
    }
}

// takes ranges from slider and then displays restaurants that are within the set range.
function ranges (item, id, rating) {
    let range1 = parseInt(Math.floor(starRangeValues[0]))
    let range2 = parseInt(Math.floor(starRangeValues[1]))

if (rating >= range1 && rating <= range2) {
    initRestData(item, id)
} else {
    return
}
}

// toggle add restaurant capability to on and display advice
$('#addButton').click(function() {
    addRestaurantToggle = true
    $('#addRestaurantAdvice').modal('show')
})

// bootstrap modal focus
$('#addRestaurantModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

// submit added restaurant
$('#addRestaurant').click(function() {
    addRestaurant()
})

// whenever the modal is hidden the toggle changes back to false. 
$('#addRestaurantModal').on('hidden.bs.modal', function (e) {
    addRestaurantToggle = false
})

