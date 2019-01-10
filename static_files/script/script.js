$(document).ready(function(){
  
  var bgimg = Math.floor((Math.random() * 5) + 1);

  var bg = "bgimages" +"/"+ bgimg + ".jpg";
console.log(bg);

  $("#container").css("background-image", "url(" + bg + ")");



  $("#loginBtn").click(() =>{
    var uname = $("#username").val().trim();
    uname = uname.replace(/[^a-zA-Z0-9 ]/g, "");
    const passw = $("#password").val().trim();
    $.ajax({
      url: '/uCheck',
      type: 'POST',
      data: {
        username: uname,
        password: passw
      },
      success: (response) => {
        
        if(response == "0"){

          $("#pwError").html("<div class='alert alert-danger' role='alert'><strong>Incorrect username or password</strong> Please check you" + "'ve entered your details correctly.</div>");
        } else {
          localStorage.setItem("username", response.username);
          localStorage.setItem("age", response.age);
          localStorage.setItem("image", response.image);
          localStorage.setItem("desc", response.desc);
          
          
         window.location.href = "dashboard.html"
          
        }
      
         // window.location.href = "dashboard.html";
       
      },
      error: () => {
        console.log("error");
      }
      
      
    })
    return false;
  })

  $("#signUpForm").submit(()=>{
    var username = $("#username").val().toLowerCase().trim();
    username = username.replace(/[^a-zA-Z0-9 ]/g, "");
    var password = $("#password").val().trim();
    password = password.replace(/[^a-zA-Z0-9 ]/g, "");
    var dob = $("#dob").val().trim();
    dob = dob.replace(/[^0-9 ]/g, "");
    const desc = $("#desc").val().trimRight();

    //const image = $('#image')[0].files[0];
    const img = $("#image").val().trim();
    const image = img.substring(12, img.length);

    console.log(username);
    const userData = {
      username: username,
      password: password,
      dob: dob,
      image: image,
      desc: desc
    };

    
    $.ajax({
      url: "./signup/",
      method: "POST",
      type: "POST",
      dataType: "json",
      data: userData,
      success: (data)=>{

        console.log("signup response: " + data);
        if(data == "1"){
          localStorage.setItem("username", username);
          localStorage.setItem("age", dob);
          localStorage.setItem("image", image);
          localStorage.setItem("desc", desc);
            
          window.location.href = "dashboard.html"
        } else{
          alert("There was an error signing up, please try again.");
        }
      }
    }) 

  })

  $("#matches").ready(() => {
    const username = localStorage.getItem("username");
    $.ajax({
      url: "/getMatches",
      type: "GET",
      async: "false",
      data: {
        username: username
      },
      dataType: "json",
      success: (data) => {
        $.each(data, (index, val) => {
          
          $(".matches").append('<div class="match"> <img src="userimages/'+ val.image +'" id="matchImg" class="center-block" style="height: 200px;width: 150px;"> <p class="smalltext">'+ val.username +'</p><p class="smalltext">Age: '+val.age +'</p> <p class="smalltext">'+ val.desc +'</p> <button id="'+ val.id +'" class="viewUser">View profile</button> </div>');
          
        })

        $(".viewUser").click((event)=>{
         ;
          var userID = event.target.id;
          localStorage.setItem("userID", userID);
        
         window.location.href = "/user.html";  
        
        })

        $(".matches").slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 4,
          arrows: false,
          responsive: [
            {
              breakpoint: 1000,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
              }
            }
          ]
        })
      }
    })
  })

  

  $("#quizForm").submit(() => {
    
    var intPoints = 0;
    var senPoints = 0;
    var orgPoints = 0;
    var logPoints = 0;

    const q1Ans = $("#friends:checked").val();
    const q2Ans = $("#creative:checked").val();
    const q3Ans = $("#worried:checked").val();
    const q4Ans = $("#q4:checked").val();
    const q5Ans = $("#q5:checked").val();
    const q6Ans = $("#q6:checked").val();


    if(q1Ans == "true"){
      intPoints--;
      console.log("int true");
    } else if(q1Ans == "false"){
      console.log("int false");
      intPoints++;
    }
    
    if(q2Ans == "true"){
      logPoints--;
    } else if(q2Ans == "false"){
      logPoints++;
    }

    if(q3Ans == "true"){
      senPoints++;
    } else if (q3Ans == "false"){
      senPoints--;
    }

    if(q4Ans == "true"){
      intPoints--;
    } else if(q4Ans == "false"){
      intPoints++;
    }

    if(q5Ans == "true"){
      orgPoints--;
    } else if(q5Ans == "false"){
      orgPoints++;
    }

    if(q6Ans == "true"){
      logPoints++;
    } else if(q6Ans == "false"){
      logPoints--;
    }

    console.log(intPoints);

    localStorage.setItem("logical", logPoints);
    localStorage.setItem("introvert", intPoints);
    localStorage.setItem("sensitive", senPoints);
    localStorage.setItem("organized", orgPoints);

    const data = {
      log: logPoints,
      int: intPoints,
      sen: senPoints,
      org: orgPoints,
      user: localStorage.getItem("username")
    }

    console.log(data);

    $.ajax({
      url: "/quizSubmit",
      type: "POST",
      dataType: "json",
      data: data,
      success: (data) => {

      }
    })
  })
  
$("#profile").ready(()=> {
  const username = localStorage.getItem("username");
  const age = localStorage.getItem("age");
  const image = localStorage.getItem("image");
  const desc = localStorage.getItem("desc");

  $(".username").html(username + " - " + age);
  $(".profPic").attr("src", "/userimages/" + image);
  $(".userDesc").html(desc);

  console.log(username);
  $.ajax({
    url:"/getAttrs",
    type: "GET",
    dataType: "json",
    data: {
      username: username
    },
    success: (response) =>{
      console.log(response);
      const logical = response[0].logical;
      const introvert = response[0].introvert;
      const sensitive = response[0].sensitive;
      const organised = response[0].organized;

  console.log(logical +" "+ introvert +" "+ sensitive + " " + organised);

 
  if(logical > 0){
    $(".userAttributes").append("You are a logical thinker <br>");
    
  } else {
    $(".userAttributes").append("You are a creative thinker <br>");
  }

  if(introvert > 0){
    $(".userAttributes").append("You are an introverted person <br>");
  } else {
    $(".userAttributes").append("You are an extroverted person <br>");
  }

  if(sensitive > 0){
    $(".userAttributes").append("You are a sensitive person <br>");
  } else {
    $(".userAttributes").append("You are a confident person <br>");
  }

  if(organised > 0){
    $(".userAttributes").append("You are an organised person <br>");
  } else {
    $(".userAttributes").append("You are a spontanious person <br>");
  }
      
    }
  })

      


})



$("#userProfile").ready(()=>{
  const userID = localStorage.getItem("userID");
  console.log(userID);
  $.ajax({
    url: "/user",
    type: "GET",
    data: {
      userID: userID
    },
    success: (data)=>{
      $(".userID").html(data.username + " - "+ data.age);
      $(".userProfPic").attr("src", "/userimages/" + data.image);
      $(".otherUserDesc").html(data.desc);

      console.log(data);
      const logical = data.logical;
      const introvert = data.introvert;
      const sensitive = data.sensitive;
      const organised = data.organized;

      const l = localStorage.getItem("logical");
      const i = localStorage.getItem("introverted");

      const s = localStorage.getItem("sensitive");

      const o = localStorage.getItem("organized");

      if(logical > 0){
        $(".otherUserAttributes").append(data.username + " is a logical thinker <br>");
        if(l > 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      } else {
        $(".otherUserAttributes").append(data.username + " is a creative thinker <br>");
        if(l < 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      }
    
      if(introvert > 0){
        $(".otherUserAttributes").append(data.username + " is an introverted person <br>");
        if(i > 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      } else {
        $(".otherUserAttributes").append(data.username + " is an extroverted person <br>");
        if(i < 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      }
    
      if(sensitive > 0){
        $(".otherUserAttributes").append(data.username + " is a sensitive person <br>");
        if(s > 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      } else {
        $(".otherUserAttributes").append(data.username + " is a confident person <br>");
        if(s < 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      }
    
      if(organised > 0){
        $(".otherUserAttributes").append(data.username + " is an organised person <br>");
        if(o > 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      } else {
        $(".otherUserAttributes").append(data.username + " is a spontanious person <br>");
        if(o < 0){
          $(".otherUserAttributes").append("<p style='color:green'>You two have this in common<p>");
        } else {
          $(".otherUserAttributes").append("<p style='color:red'>The two of you disagree on this, but maybe opposites will attract<p>");
        }
      }

  console.log("user - "+ logical +" "+ introvert +" "+ sensitive + " " + organised);

      
    }
  })
})

$(".dropdown-item").click(()=>{
  const trait = event.target.id;
  const username = localStorage.getItem("username");
  console.log(username);
  $.ajax({
    url: "/orderTraits",
    type: "GET",
    dataType: "json",
    data: {
      trait: trait,
      username: username
    },
    success: (data) => {
      
      $('.matches').slick('unslick');
      $(".matches").html("");

      $.each(data, (index, val) => {
          
        $(".matches").append('<div class="match"> <img src="userimages/'+ val.image +'" id="matchImg" class="center-block" style="height: 200px;width: 150px;"> <p class="smalltext">'+ val.username +'</p><p class="smalltext">Age: '+val.age +'</p> <p class="smalltext">'+ val.desc +'</p> <button id="'+ val.id +'" class="viewUser">View profile</button> </div>');
        
      })

      $(".viewUser").click((event)=>{
       ;
        var userID = event.target.id;
        localStorage.setItem("userID", userID);
      
       window.location.href = "/user.html";  
      
      })

      $(".matches").slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false
      })

    }
  })
})



})
