$(document)
    .ready(
        function() {
          $(".progress").hide();

          $(".btn-warning")
              .click(
                  function() {
                   
                    var baseUrl = "https://data.cityofnewyork.us/resource/5scm-b38n.json";
                    var displayResources = $("#display-resources");
                    var firstName = $('#firstName').val();
                    var lastName = $('#lastName').val();
                    console.log(firstName);
                    console.log(lastName);
                    var finalUrl;

                    // For Default Search Condition
                    if (isEmpty(firstName)
                        && isEmpty(lastName)) {
                      console
                          .log("Default Search Criteria");
                      finalUrl = baseUrl;

                    } else if (!isEmpty(firstName)
                        && !isEmpty(lastName)) {
                      console
                          .log("First Name & Last Name Search Criteria");
                      finalUrl = baseUrl + "?first_name="
                          + firstName + "&last_name="
                          + lastName;

                    } else if (!isEmpty(firstName)) {
                      console
                          .log("Last Name Search Criteria");
                      finalUrl = baseUrl + "?first_name="
                          + firstName;

                    } else if (!isEmpty(lastName)) {
                      console
                          .log("Last Name Search Criteria");
                      finalUrl = baseUrl + "?last_name="
                          + lastName;
                    }

                    console.log(finalUrl);
                    displayResources
                        .text("Loading data from JSON source...");
                    httpCall(finalUrl);

                  });
        });

function isEmpty(value) {
  return (
  // null or undefined
  (value == null) ||

  // has length and it's zero
  (value.hasOwnProperty('length') && value.length === 0) ||

  // is an Object and has no keys
  (value.constructor === Object && Object.keys(value).length === 0))
}

function httpCall(url) {
  // var defaultValue="NA";

  $.ajax({
    type : "GET",
    url : url,
    success : function(result) {
     // $('.progress-bar').hide();
      buildDataTable(result);
    },
    xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                console.log("---"+percentComplete);
                updateProgress(percentComplete);
            }
        }, false);
        xhr.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                updateProgress(percentComplete);
            }
        }, false);
        return xhr;
    },
    beforeSend: function(){
     // Handle the beforeSend event
     displayProgressbar();
     updateProgress(0);
    },
   complete: function(){
     // Handle the complete event
     // alert("End..");
      updateProgress(100);
   },
   error:function(){
     hideProgressBar();
   }
  });
}

function updateProgress(percentage) {
  if (percentage > 100)
    percentage = 100;
  $('.progress-bar').css('width', percentage + '%');
  $('.progress-bar').html(percentage + '%');
}

/*
Function to build the DataTable values HTML String
Parameter : response
*/
function buildDataTable(response) {
  var defaultValue = "NA";
  //console.log(response);
  var output = "<table id='table' class='table'><thead class='table-dark'><tr><th scope='col'>First Name</th><th scope='col'>Last Name</th><th scope='col'>Exam No</th><th scope='col'>List No</th><th scope='col'>List Agency Desc</th><th scope='col'>List Title Desc</th><th scope='col'>Published Date</th></thead><tbody>";
  for (var i = 0; i < response.length; i++) {
    output +=

    "<tr><td scope='row' data-label='First Name' >"
        + (!isEmpty(response[i].first_name) ? response[i].first_name
            : defaultValue)
        + "</td><td data-label='Last Name'>"
        + (!isEmpty(response[i].last_name) ? response[i].last_name
            : defaultValue)
        + "</td><td data-label='Exam No'>"
        + (!isEmpty(response[i].exam_no) ? response[i].exam_no
            : defaultValue)
        + "</td><td data-label='List No'>"
        + (!isEmpty(response[i].list_no) ? response[i].list_no
            : defaultValue)
        + "</td><td data-label='List Agency Desc'>"
        + (!isEmpty(response[i].list_agency_desc) ? response[i].list_agency_desc
            : defaultValue)
        + "</td><td data-label='List Title Desc'>"
        + (!isEmpty(response[i].list_title_desc) ? response[i].list_title_desc
            : defaultValue)
        + "</td><td data-label='Published Date'>"
        + (!isEmpty(response[i].published_date) ? response[i].published_date
            : defaultValue) + "</td></tr>";
  }
  output += "</tbody></table>";

  $("#display-resources").html(output);
  $("table").addClass("table");
}

function displayProgressbar(){
   $(".progress").show();
   $('.progress-bar').show()
}
function hideProgressBar(){
   $(".progress").hide();
   $('.progress-bar').hide()
}