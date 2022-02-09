// Back to top button
// Get the button
var mybutton = document.getElementById("btn_toTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


// <section id="ad_realTime">, Connect button
$('#btn_connect').click(function () {
    $('#btn_connect').html('<span class="spinner-grow spinner-grow-sm mr-2" ' +
        'role="status" aria-hidden="true">' +
        '</span>Detecting BGP Anomalies...').addClass('disabled');
});


// Show current date
var day = new Date();
const options = {day: 'numeric', month: 'long', year: "numeric", timeZone: "America/Vancouver"};
const today = day.toLocaleDateString("en-US", options);
document.getElementById("current_date").innerHTML = today;
// document.getElementById("current_date").innerHTML = Date();


// Show current time
function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;

    setTimeout(showTime, 1000);
}

showTime();


// Click show text
$(function () {
  $('[data-toggle="popover"]').popover()
})

// Off-line classification section: Progress bar when click "Submit"
$('#btn_submit').click(function () {
  var current_progress = 0;
  var interval = setInterval(function() {
      current_progress += 10;
      $("#dynamic_bar")
      .css("width", current_progress + "%")
      .attr("aria-valuenow", current_progress)
      .text(current_progress + "% Please wait for the results...");
      if (current_progress >= 90)
          clearInterval(interval);
  }, 500);  //0.5s
});