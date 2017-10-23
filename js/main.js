var done_once = false;
var host = "http://localhost:5000/wiki/";
var search = $("#search");
var latestInput = "";

function getData(input){
    if(latestInput !== input){
        latestInput = input;

        search.val(input.replace(/_/g, ' '));

        newSearch = true;
        var pastSummary = $("#" + input.toLowerCase().replace(/_/g, ' '));
        if(pastSummary.length > 0){
            $("#main-summary-text").text(localStorage.getItem(input.replace(/ /g, '_').toLowerCase()));
        }
        else{
            $.ajax({
                url: host+ input + "/summaries",
                dataType: "json"
            }).done(function(data) {
                $("#main-summary-text").text(data["summaries"]);
            });
        }
        input = input.replace(/ /g, '_');
        $.ajax({
            url: host+ input + "/titles",
            dataType: "json"
        }).done(function(data) {
            var array = $(".additive");
            for(var i = 0; i < array.length; i ++) {
                array[i].innerHTML = ("<a onclick='getData(\""+data["titles"][i].replace(/ /g, '_').toLowerCase()+"\")' class='noColor'><h3>" + capitalize(data["titles"][i].replace(/_/g, ' '))+"</h3></a>")
            }
            getSummaries(data["titles"])
        });

        if(!done_once){
            disappear();
        }
    }
}

function getSummaries(input){
    if(newSearch) {
        localStorage.clear();
        $.ajax({
            url: host + input.join("+") + "/summaries",
            dataType: "json"
        }).done(function (data) {
            var array = $(".additive");
            for (var i = 0; i < array.length; i++) {
                localStorage.setItem(input[i], data['summaries'][i]);
                var output = data['summaries'][i].substring(0, data['summaries'][i].indexOf(' ', 275)) + "...";
                $(array[i]).append("<p class=\"" + input[i] + "\">" + output + "</p>");
            }
        });
    }
}

search.on('keyup', function (e) {
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
    getData(search.val());
}

particlesJS.load('particles-js', 'js/particles.json', function() {
    console.log('callback - particles.js config loaded');
});




var words = ["Isaac Newton", "String Theory", "Federalism", "Boston Terrier", "Queensland"];
var currentIndex = 0;
var increasing = true;
function cyclePlaceHolders(){
    var string = search.attr('placeholder');
    if(increasing){
        string += words[currentIndex].charAt(string.length);
        if(string.length === words[currentIndex].length){
            increasing = false;
        }
    }
    else{
        string = string.substring(0,string.length - 1);
        if(string.length === 0){
            increasing = true;
            currentIndex = (currentIndex + 1) % words.length
        }
    }
    var timeout = 150 + Math.random() * 70;
    if(!increasing){
        timeout /= 2.5;
    }
    search.attr('placeholder', string);
    if(!done_once){
        setTimeout(cyclePlaceHolders, timeout);
    }
}

cyclePlaceHolders();


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);

}