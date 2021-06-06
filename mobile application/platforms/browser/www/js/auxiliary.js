const iPhoneNotch = ["iPhone13,4","iPhone13,3","iPhone13,2","iPhone13,1","iPhone12,5","iPhone12,3","iPhone12,1","iPhone11,8","iPhone11,6","iPhone11,4","iPhone11,2","iPhone10,6","iPhone10,3"];
const permanentStorage = window.localStorage;
let loginStatus;
var buttonSearchPressed = 0;


document.addEventListener('deviceready', onDeviceReady, false);
document.getElementById('myNavigator').addEventListener('postpush', function(event){
  if (document.getElementById('myNavigator').topPage.id == "myReviewsPage.html" ){
    if (personalReviews.length == 0){
      document.getElementById('no-reviews').style.display = "block";
    } else {
      document.getElementById('no-reviews').style.display = "none";
      renderPersonalReview(personalReviews);
    }

  }
  if (document.getElementById('myNavigator').topPage.id == "myReportsPage.html" ){
    if (personalReports.length == 0){
      document.getElementById('no-reports').style.display = "block";
    } else {
      document.getElementById('no-reports').style.display = "none";
      renderPersonalReports(personalReports);
    }
  }
});


function onDeviceReady() {
  checkUserLogged();
  initialSetting();
  getPlaygrounds();
  console.log(dataPlaygrounds);
  onInitMap();
  console.log(markers);
    // Cordova is now initialized. Have fun!    
}

/***INITIAL SETTING OF THE APP (mainly used to adapt the UI to the iPhones) */
function initialSetting(){
    var model = device.model;
    var devicePlatform = device.platform;

    if (devicePlatform === 'iOS'){
      document.body.style.marginTop = "-10px"
    }else if (iPhoneNotch.includes(model)){
        //document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
        document.body.style.marginTop = "30px";
        document.body.style.marginBottom = "20px";
    };
  
    plugin.google.maps.environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCKZP6KKLMVX0qlslKEgeoFzUYJIyBiFdA',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCKZP6KKLMVX0qlslKEgeoFzUYJIyBiFdA'
    });
}

/***RETURN THE average score in stars string  */
function stringAverageRating(score){
    if (score == 0){
      return ('&#9734&#9734&#9734&#9734&#9734')
    };
    if (score == 1){
      return ('&#9733&#9734&#9734&#9734&#9734')
    };
    if (score == 2){
      return ('&#9733&#9733&#9734&#9734&#9734')
    };
    if (score == 3){
      return ('&#9733&#9733&#9733&#9734&#9734')
    };
    if (score == 4){
      return ('&#9733&#9733&#9733&#9733&#9734')
    };
    if (score == 5){
      return ('&#9733&#9733&#9733&#9733&#9733')
    };
}

/**Validate email by checking if there are invalid chars*/
function validateEmail(email) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
       return (true)
     }
       return (false)
}

/**Check if a  string has number */
function hasNumber(myString) {
  return /\d/.test(myString);
}

/**First letter of name and surname to capital */
function capitalizeFirstLetter(str) {
  var capitalized = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return capitalized;
}

/**Transform the file URI into base64 encoded image so it can be displayed in div*/
function getFileContentAsBase64(path,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);
    function fail(e) {
          alert('Cannot found requested file');
    }
    function gotFile(fileEntry) {
           fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                   var content = this.result;
                   callback(content);
              };
              // The most important point, use the readAsDatURL Method from the file plugin
              reader.readAsDataURL(file);
           });
    }
}

/**Check if the user is already logged in */
function checkUserLogged(){
  //Controllo sulla validità del token presente, se non è presente 
  access_token = permanentStorage.getItem("token")
  if (access_token != '' && access_token != null){
    //var valid = checKTokenValidity(access_token);
    console.log ('Validity' +checKTokenValidity(access_token) )
    if (checKTokenValidity(access_token) == true){
      loginStatus = true;
      getPersonalReview();
      getPersonalReport();
      // getPersonalReport();
      return true;
    } else {
      console.log('user not logged in');
      loginStatus = false;
      return false;
    }
  }
  else {
    loginStatus = false;
    return false;
  }
}


//Contact the api to check validity of the login token
function checKTokenValidity(access_token){
  var options = {
    method: 'post',
    data: {
      "token": access_token
    },
    headers: {'Access-Control-Allow-Origin': '*', 'x-access-token': access_token},
    serializer:'json',
    responseType: 'json',
  };

  var tokenStatus = true;

  var url = 'https://findplay.ddns.net/api/verifytoken/';
    cordova.plugin.http.sendRequest(url, options, function(response){
    //Success
    console.log(response)
    if (response.data.message == "token valid"){
      tokenStatus = true;
    }
    else if (response.data.message == "new token"){
      permanentStorage.setItem("token", response.data.token);
      console.log('Token updated'); //Update the token if it is going to expire soon
      tokenStatus = true;      
    }
    else if(response.data.message == "token is invalid") {
      tokenStatus =  false;
    }
  }, function(response){
    //Error
    document.getElementById('some-problems').show();
    console.log(response);
  });

  return tokenStatus;
}

/**OpenSplitter  menu */
function openSplitter(){
  if (loginStatus == true){
    
      user_id = permanentStorage.getItem("user_id");
      document.getElementById('ProfilePicSplitter').src = 'https://findplay.ddns.net/static/profile_pictures/'+user_id+'.jpg';
      document.getElementById('splitterUserName').innerHTML = permanentStorage.getItem('user_name') + ' ' + permanentStorage.getItem('user_surname');
      console.log(permanentStorage.getItem('user_name') + ' ' + permanentStorage.getItem('user_surname'))

      document.getElementById('menuSplitter').open();

  }
  else {
      document.getElementById("myNavigator").pushPage('./loginPage.html', {animation:'fade',animationOptions:{duration:0.2}});
  }
}

/**Push page from splitter menu*/
function loadSplitterPage(page){
  document.getElementById("myNavigator").pushPage(page, {animation:'fade',animationOptions:{duration:0.2}});
}

function showEquipmentChoice() {
  document.getElementById('divReportEquipmentList').style.display = 'block';
  var selection = document.getElementById('reportType');
  selection.innerHTML = '<option value="manutenzione">Manutenzione</option>\
                         <option value="vandalismo">Vandalismo</option>\
                         <option value="sicurezza">Sicurezza</option>\
                         <option value= "altro">Altro</option>'
}

function hideEquipmentChoice() {
  document.getElementById('divReportEquipmentList').style.display = 'none';
  var selection = document.getElementById('reportType');
  selection.innerHTML = '<option value="manutenzione">Manutenzione</option>\
                        <option value="pulizia">Pulizia</option>\
                        <option value="vandalismo">Vandalismo</option>\
                        <option value="illuminazione">Illuminazione</option>\
                        <option value="sicurezza">Sicurezza</option>\
                        <option value= "altro">Altro</option>'
}

function scoreReview(score){
  if (score == 1){
    document.getElementById("onestar").style.color = "#f0a500";
    document.getElementById("twostars").style.color = "#434343";
    document.getElementById("threestars").style.color = "#434343";
    document.getElementById("fourstars").style.color = "#434343";
    document.getElementById("fivestars").style.color = "#434343";
    valutazione = 1;
  }
  if (score == 2){
    document.getElementById("onestar").style.color = "#f0a500";
    document.getElementById("twostars").style.color = "#f0a500";
    document.getElementById("threestars").style.color = "#434343";
    document.getElementById("fourstars").style.color = "#434343";
    document.getElementById("fivestars").style.color = "#434343";
    valutazione = 2;
  }
  if (score == 3){
    document.getElementById("onestar").style.color = "#f0a500";
    document.getElementById("twostars").style.color = "#f0a500";
    document.getElementById("threestars").style.color = "#f0a500";
    document.getElementById("fourstars").style.color = "#434343";
    document.getElementById("fivestars").style.color = "#434343";
    valutazione = 3;
  }
  if (score == 4){
    document.getElementById("onestar").style.color = "#f0a500";
    document.getElementById("twostars").style.color = "#f0a500";
    document.getElementById("threestars").style.color = "#f0a500";
    document.getElementById("fourstars").style.color = "#f0a500";
    document.getElementById("fivestars").style.color = "#434343";
    valutazione = 4;
  }
  if (score == 5){
    document.getElementById("onestar").style.color = "#f0a500";
    document.getElementById("twostars").style.color = "#f0a500";
    document.getElementById("threestars").style.color = "#f0a500";
    document.getElementById("fourstars").style.color = "#f0a500";
    document.getElementById("fivestars").style.color = "#f0a500";
    valutazione = 5;
  }
}

function resetScoreReviewButtons(){
  document.getElementById("onestar").style.color = "#434343";
  document.getElementById("twostars").style.color = "#434343";
  document.getElementById("threestars").style.color = "#434343";
  document.getElementById("fourstars").style.color = "#434343";
  document.getElementById("fivestars").style.color = "#434343";
}

function setAllPlaygroundVisible(){
  for (let i = 0; i < markers.length; i++) {
    markers[i].setVisible(true);
  }
}

function showOptionbar(){
  optionBar = document.getElementById('optionBar');
  input = document.getElementById("searchPlayground");
  
  if (buttonSearchPressed == 0){
    optionBar.style.display = 'block';
    buttonSearchPressed = 1;
  } else if (buttonSearchPressed == 1){
    optionBar.style.display = 'none';
    input.value = '';
    buttonSearchPressed = 0;
    setAllPlaygroundVisible();
  
  }
}


function searchBarPlayground(){
  input = document.getElementById("searchPlayground");
  filter = input.value.toUpperCase();
  for (let i = 0; i < dataPlaygrounds.length; i++) {
    pg_name = dataPlaygrounds[i].pg_name;
    if (pg_name.toUpperCase().indexOf(filter) > -1){
      markers[i].setVisible(true)
    } else {
      markers[i].setVisible(false)
    }
  }

}
