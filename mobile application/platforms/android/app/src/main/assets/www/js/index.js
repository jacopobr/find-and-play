let lastClicked_index;
let markers = [];
let map;
var URI_profilePic = '';
let dataPlaygrounds;
var personalReviews = [];
var personalReports = [];
var valutazione = 0;
var reportImageURL = '';
var modal = document.querySelector('#modal-play');


document.querySelector('ons-page').addEventListener('hide', function(event) { 
  var page = event.target;
  if (page.id === 'playReport.html'){
    var modal = document.querySelector('#modal-play');
  }
 });


/**Event that fires when a page is shown
 * playReview.html -> render reviews list by fetching them thanks to an API
 */
document.querySelector('ons-page').addEventListener('show', function(event) { 
  var page = event.target;
  if (page.id === 'playReview.html'){
    getPlayReviews(dataPlaygrounds[lastClicked_index].code_pg);
  } 
  else if (page.id === 'playInfo.html'){
    setPlayInfoPage(dataPlaygrounds[lastClicked_index].code_pg);
  }
  else if (page.id === 'playReport.html'){
    if (loginStatus == false){
      var modal = document.querySelector('#modal-play');
      modal.hide({animation:'fade',animationOptions:{duration:0.2}});
      myNavigator = document.getElementById('myNavigator');
      myNavigator.pushPage('./loginPage.html',{animation:'fade',animationOptions:{duration:0.2}});
    }
    
  }

 });


/**Get all the playgrounds data through json */
function getPlaygrounds(){
  var options = {
    method: 'get',
    headers: {'Access-Control-Allow-Origin': '*'},
    responseType: 'json',
  };

  var url = 'https://findplay.ddns.net/api/playgrounds/';
  cordova.plugin.http.sendRequest(url, options, function(response){
    //Success
    dataPlaygrounds = response.data;
    addMarkers(response.data);
    console.log(response);
  }, function(response){
    //Error
    console.log(response);
  });
}

/**Get the review for a single playground */
function getPlayReviews(code_pg){
  var options = {
    method: 'get',
    headers: {'Access-Control-Allow-Origin': '*'},
    responseType: 'json',
  };
  var url = 'https://findplay.ddns.net/api/review/playground/'+ code_pg;
  cordova.plugin.http.sendRequest(url, options, function(response){
    //Success

    console.log(response.data)
    if (response.data.message == "no reviews"){
      document.getElementById('no-review-playground').style.display = 'block';
      console.log('no reviews');
    } else {
      document.getElementById('no-review-playground').style.display = 'none';
      renderReviewList(response.data);
    }

  }, function(response){
    //Error
    console.log(response);
  });
}

/***CREATION OF THE MAP , draw borders and add markers to it */
function onInitMap() {
    var div = document.getElementById("map");
    map = plugin.google.maps.Map.getMap(div,{
        'mapType': plugin.google.maps.MapTypeId.ROADMAP,
    'controls':{
        'compass':true,
        'myLocationButton':true,
        'myLocation':true,
    },
    'camera' : {
        'latLng': {'lat': 45.0781, 'lng': 7.6761},
        'zoom' : 13,
      },
      'preferences':{
        'zoom': {
            'minZoom':11,
            'maxZoom':18,
        },
      },
      'styles': [
        {
          "featureType": "administrative",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
            "featureType": "administrative.locality",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
        {
          "featureType": "landscape",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.attraction",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.station.rail",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        }
      ]
    });
    
    //QUANDO LA MAPPA è CARICATA DISEGNA I BORDI E LIMITA LA VISTA
    map.on(plugin.google.maps.event.MAP_READY, function (){
      drawBounds(); //altro file
      restrictBounds();
      //addMarkers();
    });
}

/***RESTRITCT VIEW TO ONLY TURIN, it will pan to the last visible center that is contained in the bounds */
function restrictBounds(){
    var allowedBounds = new plugin.google.maps.LatLngBounds(
        [new plugin.google.maps.LatLng(45.15,7.830104),
        new plugin.google.maps.LatLng(44.992575,7.536)]
   );

    var lastValidCenter = map.getCameraPosition().target;

    map.addEventListener(plugin.google.maps.event.CAMERA_MOVE_END, function(){

        if (allowedBounds.contains(map.getCameraPosition().target)){
            lastValidCenter = map.getCameraPosition().target;
        }
        else{
            map.animateCamera({'target':  lastValidCenter, 'duration':1000});
        };
    });
};

/***ADD MARKERS TO THE MAP, adding to each of them an information windows and also a gesture to set the plauground page */
function addMarkers(dataPlaygrounds){
  for(let i = 0; i < dataPlaygrounds.length; i++){
    var position = new plugin.google.maps.LatLng(dataPlaygrounds[i].pg_lat, dataPlaygrounds[i].pg_long);
    var marker = map.addMarker({
      'position': position,
      'icon':{
        'url': 'https://findplay.ddns.net/static/img/marker.png',
        'size':{
          'width':50,
          'height': 50,
        }
      }
    });

   markers.push(marker);
  };
  
  for(let i = 0; i < markers.length; i++){

      markers[i].on(plugin.google.maps.event.MARKER_CLICK, function(){
        var star_score = stringAverageRating(dataPlaygrounds[i].pg_avg_score);
        markers[i].hideInfoWindow();
        var htmlInfoWindow = new plugin.google.maps.HtmlInfoWindow();
        var container = document.createElement('div');
        container.setAttribute('id','infoWindowContainer');
        container.innerHTML ='<ons-gesture-detector onclick = "showPlaygroundPage('+i+')">\
                              <b>'+dataPlaygrounds[i].pg_name+'</b><br>'+ dataPlaygrounds[i].pg_address +'<br> Valutazione: '+ star_score +'</ons-gesture-detector>';
        htmlInfoWindow.setContent(container);
        htmlInfoWindow.open(markers[i]);
      
    });
  }
};

/***SHOW MODAL PAGE CONTAINING PARK INFORMATION */
function showPlaygroundPage(i){

  lastClicked_index = i
  modal.show({animation:'fade',animationOptions:{duration:0.2}});

  document.querySelector('#infoCardPlayName').innerHTML = dataPlaygrounds[lastClicked_index].pg_name;
  document.querySelector('#playTabbar').setActiveTab(0);
  document.getElementById('closeModal').addEventListener('click',function(){
  modal.hide({animation:'fade',animationOptions:{duration:0.2}});
    document.getElementById("lazyRepeat").innerHTML = '';
    document.getElementById("subject").value = '';
    deleteReportPhoto();
    document.getElementById('subject').value = '';
    document.getElementById('reportType').value = '';
    document.getElementById('reportContent').value = '';


  });

}

/***RENDER THE LIST OF REVIEW OF EACH PARK, SHOULD CALL A JSON */
function renderReviewList(review){

  console.log(review)

  document.getElementById("lazyRepeat").innerHTML = '';

  if (review.length == 0){
    console.log('No reviews')
  }
  else {

      var infiniteList = document.createElement('ons-lazy-repeat');
      document.getElementById("lazyRepeat").innerHTML = '';
      document.getElementById("lazyRepeat").appendChild(infiniteList);

      infiniteList.delegate = {
      createItemContent: function(i) {
      if (i<review.length){
      var  date = new Date(review[i].creation_date);
      return ons.createElement(' \
      <ons-card class = "reviewItems">\
      <ons-list-item modifier = "nodivider">\
          <div class="left">\
          <img class="review--picture--splitter" src="https://findplay.ddns.net/static/profile_pictures/'+review[i].user_id+'.jpg">\
          </div>\
          <div class="center">\
          <span class="list-item__title"><b>'+review[i].user_name+' '+review[i].user_surname+'</b></span><span class="list-item__subtitle">'+ date.getDate() +'/'+(date.getMonth() +1)+'/'+date.getFullYear()+'</span>\
          <span class="list-item__subtitle">Valutazione: <span style="color: #f0a500">'+ stringAverageRating(review[i].score)+'</span></span>\
          </div>\
      </ons-list-item>\
      <p class="textarea textarea--transparent content-review-report" style ="text-align: justify;padding-left: 10px;padding-right: 10px;">' +review[i].content+'</p></ons-card>');
      }},

      countItems: function() {
      return review.length;
      }
  };
}
}

/***REGISTER USER FUNCTION, validation of the form */
function register(){
  var user_name = document.getElementById('user_name').value;
  var user_surname = document.getElementById('user_surname').value;
  var user_email = document.getElementById('user_email').value;
  var password_one = document.getElementById('password_one').value;
  var password_two = document.getElementById('password_two').value;

  user_name = capitalizeFirstLetter(user_name);
  user_surname = capitalizeFirstLetter(user_surname);

  /**Validation of the form, it check
   * fields are not null,
   * passwords are the same,
   * email is of the correct format,
   * password is at least 8 characters and with a number
   */
  if (user_name == '' || user_surname == '' || user_email == '' || password_two == '' || password_one == ''){
    document.querySelector('#fillAllFormToast').show();
    setTimeout(function(){ document.querySelector('#fillAllFormToast').hide(); }, 3000);

  }
  else if(password_one.length < 8 || hasNumber(password_one) == false ){
    document.querySelector('#passwordWrongFormatToast').show();
    setTimeout(function(){ document.querySelector('#passwordWrongFormatToast').hide(); }, 3000);
  }
  else if (password_one != password_two){
    document.querySelector('#passwordDifferentToast').show();
    setTimeout(function(){ document.querySelector('#passwordDifferentToast').hide(); }, 3000);
  }
  else if (validateEmail(user_email) == false) {
    document.querySelector('#emailWrongToast').show();
    setTimeout(function(){ document.querySelector('#emailWrongToast').hide(); }, 3000);

  }
  else {
    var options = {
    method: 'post',
    data: {
      "user_email": user_email,
      "user_surname": user_surname,
      "password_one": password_one,
      "user_name": user_name
    },
    headers: {'Access-Control-Allow-Origin': '*'},
    serializer:'json',
    responseType: 'json'
    };

    var url = 'https://findplay.ddns.net/api/register/';

    cordova.plugin.http.sendRequest(url, options, function(response) {
      /**Ciò che succede se va a buon fine la chiamata */
      if (response.data.message == 'email already used'){
        document.getElementById('email-already-used').show();
      }
      else if (response.data.message == 'problem registering user'){
        document.getElementById('some-problems').show();
      }
      else if (response.data.message == 'success'){
        document.getElementById('sent-confirm').show();
        document.getElementById('myNavigator').popPage({animation:'fade',animationOptions:{duration:0.2}});
      }

      console.log(response);
    }, function(response) {
      document.getElementById('some-problems').show();
      console.log(response);
    });
    }
}

/**Login function + tutti i controlli del risultato che può avere */
function login(){
  var user_email = document.getElementById('user_email_login').value;
  var password = document.getElementById('password_login').value;
  var options = {
    method: 'post',
    data: {
      "user_email": user_email,
      "password": password,
    },
    headers: {'Access-Control-Allow-Origin': '*'},
    serializer:'json',
    responseType: 'json',
    };

    var url = 'https://findplay.ddns.net/api/login/';

    cordova.plugin.http.sendRequest(url, options, function(response) {
      if (response.data.message == "not confirmed"){
        document.getElementById('confirm-pending').show();
      } 
      else if (response.data.message == "success"){
        permanentStorage.setItem('token', response.data.token);
        permanentStorage.setItem('user_id', response.data.user_id);
        loginStatus = true;
        getUserInformation();
        getPersonalReview();
        getPersonalReport();
        document.getElementById('myNavigator').popPage({animation:'fade',animationOptions:{duration:0.2}});
      }
      else if (response.data.message == "wrong password"){
        document.querySelector('#wrongPasswordToast').show();
        setTimeout(function(){ document.querySelector('#wrongPasswordToast').hide(); }, 2500);
      }
      else if (response.data.message == "email not registered"){
        document.querySelector('#emailNoTRegisterToast').show();
        setTimeout(function(){ document.querySelector('#emailNoTRegisterToast').hide(); }, 2500);
      }
      else if (response.data.message == "problems logging in"){
        document.getElementById('some-problems').show();
      }
      console.log(response);
    }, function(response) {
      document.getElementById('some-problems').show();
      console.log(response);
    });
}

/**Save user information */
function getUserInformation(){
  var options = {
    method: 'get',
    headers: {'Access-Control-Allow-Origin': '*'},
    responseType: 'json',
    };

  var user_id = permanentStorage.getItem('user_id')
  cordova.plugin.http.sendRequest('https://findplay.ddns.net/api/user/'+ user_id, options, function(response) {
    permanentStorage.setItem('user_email', response.data['user_email']);
    permanentStorage.setItem('user_name', response.data['user_name']);
    permanentStorage.setItem('user_surname', response.data['user_surname'])
  }, function(response) {
    console.error(response.error);
  });

}

/**Logout */
function logout(){
  permanentStorage.clear();
  document.getElementById('menuSplitter').close();
  loginStatus = false;
  personalReviews = [];
  personalReports = [];

}

/**Invia email quando si preme il bottone contattaci */
function sendEmailToUs() {
  cordova.plugins.email.open({
    to:      'findplaypolito@gmail.com',
    body:    'Al team Find&ampPlay,\n'
  });
}

/**Fetch the reviews written by the user logged in */
function getPersonalReview(){
  var user_id = permanentStorage.getItem('user_id');
  var token = permanentStorage.getItem('token');
  var options = {
    method: 'get',
    headers: {'Access-Control-Allow-Origin': '*','x-access-token':token},
    responseType: 'json',
  };
  var url = 'https://findplay.ddns.net/api/review/user/'+ user_id;
  cordova.plugin.http.sendRequest(url, options, function(response){
    //Success
    console.log(response.data)
    if (response.data.message == 'no reviews'){
      document.getElementById('no-reviews').style.display = 'block';

    } else {
      personalReviews = response.data;
    }

  }, function(response){
    //Error
    console.log(response);
  });
}


/**Get personal reports */
function getPersonalReport() {
  var user_id = permanentStorage.getItem('user_id');
  var token = permanentStorage.getItem('token');
  var options = {
    method: 'get',
    headers: {'Access-Control-Allow-Origin': '*','x-access-token':token},
    responseType: 'json',
  };
  var url = 'https://findplay.ddns.net/api/report/user/'+ user_id;
  cordova.plugin.http.sendRequest(url, options, function(response){
    //Success
    console.log(response.data);

    if (response.data.message == "no reports"){
    } else {
      personalReports = response.data;
    }

  }, function(response){
    console.log(response.data);
  });
}



/***RENDER THE LIST OF The  Reports made by a user*/
function renderPersonalReports(personalReports){
  var reports = personalReports;
  var infiniteList = document.createElement('ons-lazy-repeat');

  document.getElementById("lazyRepeatReport").innerHTML = '';
  document.getElementById("lazyRepeatReport").appendChild(infiniteList);

  //TODO: INSERIRE LA API PER IL FETCH DEL JSON DELLE RECENSIONI DI UN PARCO /review/playground/code_pg e cambiare review con il nome del json
  //Immagine utente
  

  if(personalReports.length > 0){
  infiniteList.delegate = {
      createItemContent: function(i) {
      if (i<reports.length){

        if (reports[i].status == 1){
          stato = 'Letto <ons-icon icon ="fa-check" style = "color:#1fa67a" ></ons-icon>'
        } else {
          stato = 'Non ancora letto <ons-icon icon ="fa-clock-o" style = "color:#e45826"></ons-icon>'
        }
        if (reports[i].type_eq == 'no'){
          equipment = '';
        } else {
          equipment = ' - ' + reports[i].type_eq;
        }

        var  date = new Date(reports[i].creation_date);
        return ons.createElement(' \
        <ons-card class = "reviewItems">\
            <ons-list-item modifier = "nodivider">\
            <span class="list-item__title">'+reports[i].pg_name+ equipment + '</span><br><span class="list-item__subtitle">'+ reports[i].subject+'</span><br>\
            <span class="list-item__subtitle">'+ capitalizeFirstLetter(reports[i].type)+' - ' + stato+'</span><br>\
            <span class="list-item__subtitle">'+ date.getDate() +'/'+(date.getMonth() +1)+'/'+date.getFullYear()+'</span></ons-list-item>\
          <p class="textarea textarea--transparent content-review-report" style ="text-align: justify;padding-left: 10px;padding-right: 10px;">' +reports[i].description+'</p></div>\
          </ons-card>');
      }},

      countItems: function() {
      return reports.length;
      }
  };
}
}


/***RENDER THE LIST OF The  REVIEW made by a user*/
function renderPersonalReview(personalReviews){
  var review = personalReviews;
  var infiniteList = document.createElement('ons-lazy-repeat');

  document.getElementById("lazyRepeatPersonal").innerHTML = '';
  document.getElementById("lazyRepeatPersonal").appendChild(infiniteList);

  //TODO: INSERIRE LA API PER IL FETCH DEL JSON DELLE RECENSIONI DI UN PARCO /review/playground/code_pg e cambiare review con il nome del json
  //Immagine utente
  

  infiniteList.delegate = {
      createItemContent: function(i) {
      if (i<review.length){
      var  date = new Date(review[i].creation_date);
      return ons.createElement(' \
      <ons-card class = "reviewItems">\
          <ons-list-item modifier = "nodivider">\
          <span class="list-item__title"><b>'+review[i].pg_name+'</b></span><br><span class="list-item__subtitle">'+ review[i].pg_address+'</span><br>\
          <span class="list-item__subtitle">Valutazione: <span style = "color: #f0a500">'+ stringAverageRating(review[i].score)+'</span></span><br>\
          <span class="list-item__subtitle">'+ date.getDate() +'/'+(date.getMonth() +1)+'/'+date.getFullYear()+'</span></ons-list-item>\
          <p class="textarea textarea--transparent content-review-report" style ="text-align: justify;padding-left: 10px;padding-right: 10px;">' +review[i].content+'</p></div>\
        </ons-card>');
      }},

      countItems: function() {
      return review.length;
      }
  };
}

function updateProfilePicture(){

  var options = {
    // Some common settings are 20, 50, and 100
    quality: 30,
    destinationType: Camera.DestinationType.DATA_URL,
    // In this app, dynamically set the picture source, Camera or photo gallery
    targetWidth: 500,
    targetHeight: 500,
    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    correctOrientation: true
  }

  navigator.camera.getPicture(function cameraSuccess(dataURL) {
    user_id = permanentStorage.getItem("user_id");

    var options = {
        method: 'post',
        data: {
          "imgstring": dataURL,
          "user_id": user_id,
        },
        headers: {'Access-Control-Allow-Origin': '*'},
        serializer:'json',
        responseType: 'json'
        };
    
        var url = 'https://findplay.ddns.net/api/uploadprofilepic/';

    cordova.plugin.http.sendRequest(url, options, function(response) {
      if (response.data.message = "picture loaded") {
        document.getElementById('picture-uploaded').show();
        window.CacheClear(function(){console.log('cache cleared')}, function(){console.log('cache not cleared')});
        document.getElementById('ProfilePicSplitter').src = 'https://findplay.ddns.net/static/profile_pictures/'+user_id+'.jpg';
      } else if (response.data.message = "picture not loaded"){
        ons.notification.alert('Profile not picture uploaded');
      }
    }, function(response) {
      console.log(response);
    });

  }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
  },options);

}

// Set the playground info page by fetching the list of equipment
function setPlayInfoPage(code_pg) {

  // 
  var panoImage = document.getElementById('pano');
  panoImage.innerHTML = ''; //Reset panorama div 
  var panorama = new PANOLENS.ImagePanorama('https://findplay.ddns.net/static/img/playground/'+code_pg+'/pano.jpg');

  var panoImage = document.getElementById('pano');
  var viewer = new PANOLENS.Viewer({container: panoImage,controlBar:false});

  viewer.add(panorama);
  console.log(viewer);

  var inclusive = dataPlaygrounds[lastClicked_index].inclusive;
  var accessible = dataPlaygrounds[lastClicked_index].accessibile;

  console.log(inclusive);
  console.log(accessible);

  document.getElementById('pg-address').innerText = dataPlaygrounds[lastClicked_index].pg_address;
  document.getElementById('opening-hour').innerText = capitalizeFirstLetter(dataPlaygrounds[lastClicked_index].opening_hour);
  document.getElementById('access-age').innerText ='Età accesso: '+ dataPlaygrounds[lastClicked_index].pg_age +'+';

  if (inclusive == accessible == 1){
    console.log('Accessibile e inclusivo');
    document.getElementById('accessible').innerText =' Accessibile e inclusivo';
  } else if (inclusive == 0 && accessible == 1){
    document.getElementById('accessible').innerText =' Accessibile ma non inclusivo';
  } else if (inclusive == accessible == 0){
    document.getElementById('accessible').innerText =' Non accessibile';
  }



  var options = {
    method: 'get',
    headers: {'Access-Control-Allow-Origin': '*'},
    responseType: 'json',
  };

  document.getElementById('equipment_list').innerHTML = '';

  var url = 'https://findplay.ddns.net/api/playground/equipment/' + code_pg;
  cordova.plugin.http.sendRequest(url, options, function(response){
    //Success
    equipment_list = response.data;
    curretPlaygroundEquipmentList = equipment_list;
    equipment_div = document.getElementById('equipment_list');
    

    //Equipment list in playInfo page
    for(let i = 0; i < equipment_list.length; i++){
      equipment_item = document.createElement('ons-list-item')
      equipment_item.innerHTML = '<div class = "left">'+ equipment_list[i]["id_equip"]+ '</div>\
                                  <div class = "center">' + equipment_list[i]["type_eq"] + '</div>\
                                  <div class ="right" onclick = "showPopoverEquipment(this,\''+code_pg+ '\', '+ equipment_list[i]["id_equip"] +')"><ons-icon icon = "fa-eye"></ons-icon></div>';
      equipment_div.append(equipment_item);
    }

    //Equipment list in Report page
    report_equipment_div = document.getElementById('reportEquipmentList');
    report_equipment_div.innerHTML = '';
    for(let i = 0; i < equipment_list.length; i++){
      equipment_item = document.createElement('option')
      equipment_item.value = equipment_list[i]["id_equip"];
      equipment_item.innerHTML = equipment_list[i]["type_eq"];
      report_equipment_div.append(equipment_item);
    }
    console.log(equipment_list);
  }, function(response){
    //Error
    console.log(response);
  });
}

// Show the popover with the image of the clicked equipment
function showPopoverEquipment(target,code_pg, id_equi){
  document.getElementById('equipmentImage').src = 'https://findplay.ddns.net/static/img/playground/'+ code_pg +'/'+ id_equi +'.jpg';
  document.getElementById('popoverequipmet').show(target);
}

function hidePopoverImage(){
  document.getElementById('popoverequipmet').hide();
}

//Push Write review dialog
function writeReview(){
  document.getElementById('contentReview').value = '';
  resetScoreReviewButtons();
  
  var dialog = document.querySelector('#writeReviewDialog');
  if (loginStatus == false){ 
    var modal = document.querySelector('#modal-play');
    dialog.hide({animation:'fade',animationOptions:{duration:0.2}});
    modal.hide({animation:'fade',animationOptions:{duration:0.2}});
    myNavigator = document.getElementById('myNavigator');
    myNavigator.pushPage('./loginPage.html',{animation:'fade',animationOptions:{duration:0.2}});
  } else {
  dialog.show({animation:'fade',animationOptions:{duration:0.2}});
  }
}

// Sent the review to the flask api
function sendReview(){

  var dialog = document.querySelector('#writeReviewDialog');
  user_id = permanentStorage.getItem('user_id');
  token = permanentStorage.getItem('token');
  code_pg = dataPlaygrounds[lastClicked_index].code_pg;
  score = valutazione;
  content = document.getElementById('contentReview').value;

  if (score == 0){
    document.querySelector('#needRating').show();
    setTimeout(function(){ document.querySelector('#needRating').hide(); }, 3000);
  } else if (content == '' || content == null){
    document.querySelector('#needReview').show();
    setTimeout(function(){ document.querySelector('#needReview').hide(); }, 3000);
  } else {
    
  var options = {

    method: 'post',
    data: {
      "user_id": user_id,
      "code_pg": code_pg,
      "score": score,
      "content": content
    },
    headers: {'Access-Control-Allow-Origin': '*', 'x-access-token': token},
    serializer:'json',
    responseType: 'json'
    };

    var url = 'https://findplay.ddns.net/api/review/';

    cordova.plugin.http.sendRequest(url, options, function(response) {
      if (response.data.message == "review inserted"){
        document.getElementById('review-sent').show();
        dialog.hide({animation:'fade',animationOptions:{duration:0.2}});
        document.getElementById('contentReview').value = '';
        valutazione = 0;
        getPersonalReview();
        
      } 
      else if (response.data.message == "review not inserted"){
        dialog.hide({animation:'fade',animationOptions:{duration:0.2}});
        document.getElementById('contentReview').value = '';
        valutazione = 0;
        document.getElementById('review-not-sent').show();
      }
      else if (response.data.message == "review already existing"){
        dialog.hide({animation:'fade',animationOptions:{duration:0.2}});
        document.getElementById('contentReview').value = '';
        valutazione = 0;
        document.getElementById('review-existing').show()
      }
      console.log(response);
    }, function(response) {
      console.log(response);
    });
}
}

function sendReport(){
  //global Park report of user logged in
  if (document.getElementById('playgroundCheckbox').checked == true) {

      subject = document.getElementById('subject').value;
      category = document.getElementById('reportType').value;
      description = document.getElementById('reportContent').value;

      if (subject == '' || description == '' || category == ''){
        document.querySelector('#fillAllFormToast').show();
        setTimeout(function(){ document.querySelector('#fillAllFormToast').hide(); }, 3000);
  
      }
      else {
      var options = {
        method: 'post',
        data: {
          "user_id": permanentStorage.getItem('user_id'),
          "code_pg": dataPlaygrounds[lastClicked_index].code_pg,
          "subject": subject,
          "description": description,
          "category": category,
          "image": reportImageURL
        },
        headers: {'Access-Control-Allow-Origin': '*', 'x-access-token': permanentStorage.getItem('token')},
        serializer:'json',
        responseType: 'json'
        };

      var url = 'https://findplay.ddns.net/api/report/globalreport/';
      cordova.plugin.http.sendRequest(url, options, function(response) {
        if (response.data.message == 'report already sent in the past 24h'){
          document.getElementById('report-existing').show();
          modal.hide({animation:'fade',animationOptions:{duration:0.2}});
          deleteReportPhoto();
          document.getElementById('subject').value = '';
          document.getElementById('reportType').value = '';
          document.getElementById('reportContent').value = '';
        } 
        else if (response.data.message == 'report inserted'){
          document.getElementById('report-sent').show();
          getPersonalReport();
          modal.hide({animation:'fade',animationOptions:{duration:0.2}});
          deleteReportPhoto();
          document.getElementById('subject').value = '';
          document.getElementById('reportType').value = '';
          document.getElementById('reportContent').value = '';


        }
        else if (response.data.message == 'problem inserting report'){
          document.getElementById('some-problems').show();
          modal.hide({animation:'fade',animationOptions:{duration:0.2}});
          deleteReportPhoto();
          document.getElementById('subject').value = '';
          document.getElementById('reportType').value = '';
          document.getElementById('reportContent').value = '';
        }
        console.log(response);
      }, function(response) {
        console.log(response);
      });
    }
  }


  //Report for specific target
  if (document.getElementById('equipmentCheckbox').checked == true) {


    subject = document.getElementById('subject').value;
    id_equip = document.getElementById('reportEquipmentList').value;
    description = document.getElementById('reportContent').value;
    category = document.getElementById('reportType').value;


    if (subject == '' || id_equip == '' || description == '' || category == ''){
      document.querySelector('#fillAllFormToast').show();
      setTimeout(function(){ document.querySelector('#fillAllFormToast').hide(); }, 3000);
  
    }
    else {
    var options = {
      method: 'post',
      data: {
        "user_id": permanentStorage.getItem('user_id'),
        "code_pg": dataPlaygrounds[lastClicked_index].code_pg,
        "subject": subject,
        "id_equi": id_equip,
        "description": description,
        "category": category,
        "image": reportImageURL
      },
      headers: {'Access-Control-Allow-Origin': '*', 'x-access-token': permanentStorage.getItem('token')},
      serializer:'json',
      responseType: 'json'
      };


    var url = 'https://findplay.ddns.net/api/report/targetreport/';
    cordova.plugin.http.sendRequest(url, options, function(response) {
      if (response.data.message == 'report already sent in the past 24h'){
        document.getElementById('report-existing').show();
        modal.hide({animation:'fade',animationOptions:{duration:0.2}});
        deleteReportPhoto();
        document.getElementById('subject').value = '';
        document.getElementById('reportType').value = '';
        document.getElementById('reportContent').value = '';

      } 
      else if (response.data.message == 'report inserted'){
        document.getElementById('report-sent').show();
        getPersonalReport();
        modal.hide({animation:'fade',animationOptions:{duration:0.2}});
        deleteReportPhoto();
        document.getElementById('subject').value = '';
        document.getElementById('reportType').value = '';
        document.getElementById('reportContent').value = '';

      }
      else if (response.data.message == 'problem inserting report'){
        document.getElementById('report-not-sent').show();
        modal.hide({animation:'fade',animationOptions:{duration:0.2}});
        deleteReportPhoto();
        document.getElementById('subject').value = '';
        document.getElementById('reportType').value = '';
        document.getElementById('reportContent').value = '';
      }
      console.log(response);
    }, function(response) {
      document.getElementById('some-problems').show();
    });
  }
}
}


function searchBarReport(){
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchReport");
    filter = input.value.toUpperCase();
    list = document.getElementById("lazyRepeatReport");
    li = list.getElementsByTagName("ons-card");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function searchBarReview(){

  var input, filter, li, a, i, txtValue;
  input = document.getElementById("searchReview");
  filter = input.value.toUpperCase();
  list = document.getElementById("lazyRepeatPersonal");
  li = list.getElementsByTagName("ons-card");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("span")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }
}

function filterPlaygrounds () {
  equipment_filter = document.getElementById("equipment_filter");
  equipment_alternative = equipment_filter.getElementsByTagName("ons-checkbox");
  accessible_checkbox = document.getElementById("accessibleCheckbox");
  inclusive_checkbox = document.getElementById("inclusiveCheckbox");
  ageThree_checkbox = document.getElementById("ageThreeCheckbox");
  ageSix_checkbox = document.getElementById("ageSixCheckbox");
  var dialog = document.getElementById('filterDialog');
  
  selected_equipment = [];
  age = 0;
  accessible = 0;
  inclusive = 0;

  /**Appen values of the selected equipment**/
  for(let i = 0; i < equipment_alternative.length; i++){
    if (equipment_alternative[i].checked) {
      selected_equipment.push(equipment_alternative[i].value);
    }
  }

  if (selected_equipment.length == 0){
    selected_equipment = ["altalena","castello","scivolo","dondolo","girello","molla","palestrina"]
  }

  if (accessible_checkbox.checked == true) {
    accessible = 1;
    inclusive = 0;
  } else if (inclusive_checkbox.checked == true) {
    accessible = 0;
    inclusive = 1;
  }

  if (ageThree_checkbox.checked == true) {
    age = 3
  } else if (ageSix_checkbox == true) {
    age = 6
  }

  /**API REQUEST**/
  var options = {
    method: 'post',
    data: {
        "category": selected_equipment,
        "age": age,
        "accessibility": accessible,
        "inclusive": inclusive
    },
    headers: {'Access-Control-Allow-Origin': '*'},
    serializer:'json',
    responseType: 'json'
    };

  var url = 'https://findplay.ddns.net/api/playground/filter/';

  cordova.plugin.http.sendRequest(url, options, function(response) {

      if (response.data.message == 'nessun parco trovato'){
        dialog.hide({animation:'fade',animationOptions:{duration:0.2}});
        document.getElementById('filter-empty').show();
      } else {
        console.log(response.data.message);
        for (let i = 0; i < dataPlaygrounds.length; i++){
          console.log(dataPlaygrounds[i].code_pg);
            if (response.data.message.includes(dataPlaygrounds[i].code_pg)){
              markers[i].setVisible(true);
            } else {
              markers[i].setVisible(false);
            }
        }

        dialog.hide({animation:'fade',animationOptions:{duration:0.2}});
        document.getElementById('filterButton').style.backgroundColor = "#CC99FF";

      }
      console.log(response);
    }, function(response) {
      document.getElementById('some-problems').show();
      console.log(response);
    });


}

function resetFilter() {
  var dialog = document.getElementById('filterDialog')
  dialog.hide({animation:'fade',animationOptions:{duration:0.2}});
  document.getElementById('filterButton').style.backgroundColor = "#3bc8c7";
  equipment_filter = document.getElementById("equipment_filter");
  equipment_alternative = equipment_filter.getElementsByTagName("ons-checkbox");
  document.getElementById("accessibleCheckbox").checked = false;
  document.getElementById("inclusiveCheckbox").checked = false;
  document.getElementById("ageThreeCheckbox").checked = false;
  document.getElementById("ageSixCheckbox").checked = false;
  for(let i = 0; i < equipment_alternative.length; i++){
     equipment_alternative[i].checked = false
  }

  for (let i = 0;  i < markers.length; i++){
    markers[i].setVisible(true);
  }

}

function addPhotoReport() {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 80,
    destinationType: Camera.DestinationType.DATA_URL,
    // In this app, dynamically set the picture source, Camera or photo gallery
    targetWidth: 500,
    targetHeight: 500,
    sourceType: Camera.PictureSourceType.CAMERA,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    correctOrientation: true
  }

  navigator.camera.getPicture(function cameraSuccess(dataURL) {
    document.getElementById('add-report-photo-button').innerHTML = '<ons-icon icon = "fa-camera"></ons-icon> Foto aggiunta';
    document.getElementById('add-report-photo-button').style.backgroundColor = "#CC99FF";
    //document.getElementById('add-report-photo-button').style.float = "left";
    document.getElementById('delete-report-photo-button-div').style.display = 'block';
    reportImageURL = dataURL;

  }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
  },options);

}


function deleteReportPhoto() {
  document.getElementById('add-report-photo-button').innerHTML = '<ons-icon icon = "fa-camera"></ons-icon> Aggiungi foto';
  document.getElementById('add-report-photo-button').style.backgroundColor = "#3bc8c7";
  document.getElementById('add-report-photo-button').style.removeProperty('float');
  document.getElementById('delete-report-photo-button-div').style.float = 'right';
  document.getElementById('delete-report-photo-button-div').style.display = 'none';
  reportImageURL = '';
}

function recoverPassword(){
  modal = document.getElementById('recoverPasswordDialog');
  user_email = document.getElementById('user_email_recover_password').value;

  var options = {
    method: 'post',
    data: {
      "user_email": user_email,
    },
    headers: {'Access-Control-Allow-Origin': '*'},
    serializer:'json',
    responseType: 'json'
    };

    var url = 'https://findplay.ddns.net//api/recoverpassword/';

    cordova.plugin.http.sendRequest(url, options, function(response) {
      /**Ciò che succede se va a buon fine la chiamata */
      if (response.data.message == 'email address not registered'){
        modal.hide();
        document.getElementById('user_email_recover_password').value = '';
        document.getElementById('email-not-existing').show();
  
      }
      else if (response.data.message == 'problem recovering password'){
        modal.hide();
        document.getElementById('user_email_recover_password').value = '';
        document.getElementById('some-problems').show();
      }
      else if (response.data.message == 'email sent'){
        modal.hide();
        document.getElementById('user_email_recover_password').value = '';
        document.getElementById('email-recover-sent').show();
        
      }

      console.log(response);
    }, function(response) {
      modal.hide();
      document.getElementById('user_email_recover_password').value = '';
      document.getElementById('some-problems').show();
      console.log(response);
    });
}


