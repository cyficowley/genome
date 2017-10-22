var done_once = false;

function getData(input){
    $("#search").val(input);

    var pastSummary = $("#" + input);
    if(pastSummary.length > 0){
        $("#main-summary-text").text(pastSummary.text);
    }
    else{
        $.ajax({
            url: "http://localhost:5000/wiki/" + input + "/summaries",
            dataType: "json"
        }).done(function(data) {
            $("#main-summary-text").text(data["summaries"]);
        });
    }
    input = input.replace(" ", "_");
    $.ajax({
        url: "http://localhost:5000/wiki/" + input + "/titles",
        dataType: "json"
    }).done(function(data) {
        var array = $(".additive");
        for(var i = 0; i < array.length; i ++) {
            array[i].innerHTML = ("<a onclick='getData(\""+data["titles"][i].replace(" ", "_")+"\")' class='noColor'><h3>" + data["titles"][i].replace("_", " ") + "</h3></a>")
        }
        getSummaries(data["titles"])
    });

    if(!done_once){
        disappear();
    }
}

function getSummaries(input){
    $.ajax({
        url: "http://localhost:5000/wiki/" + input.join("+") + "/summaries",
        dataType: "json"
    }).done(function(data) {
        var array = $(".additive");
        for(var i = 0; i < array.length; i ++) {
            $(array[i]).append("<p class=\""+input[i]+"\">" + data["summaries"][i] + "</p>");
        }
    });
}

$("#search").on('keyup', function (e) {
    if (e.keyCode === 13) {
        getData(this.value)
    }
});

function disappear() {
    window.setTimeout(function () {
        $(".disappearing").each(function () {
            $(this).remove()
        })
    }, 1);
    $(".appearing").show();
}

function getSearchContent(){
    getData($("#search").val());
}

particlesJS.load('particles-js', 'js/particles.json', function() {
    console.log('callback - particles.js config loaded');
});

