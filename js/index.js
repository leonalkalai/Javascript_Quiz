function goToQuiz() {
    window.location.replace("main.html");
}  

$('#startbutton').click( function(e) {e.preventDefault(); goToQuiz(); return false;} );