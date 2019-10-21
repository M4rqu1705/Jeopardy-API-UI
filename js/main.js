// Prepare variables used to construct url
var Clue,
    Answer,
    Value,
    //AirDate = [ new Date("January 1, 1985"), new Date("August 1, 1985") ]
    AirDate = [0,0],
    Category="1";
var categories;

// HELPER FUNCTIONS --- HELPER FUNCTIONS --- HELPER FUNCTIONS --- HELPER FUNCTIONS

// Make input sanitazion easier to prevent mishaps
function sanitize(str) {
    str = String(str);
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    var output = str.replace(reg, (match)=>(map[match]));
    return(output);
}

// Check if variable is defined or not
function defined(data){
    return(Boolean(typeof data !== 'undefined'));
}

// Show loading spinner
function loadingSpinner(state){
    if(state){
        $('#loadingIcon').show();
    }else{
        $('#loadingIcon').hide();
    }

}

function getURL(){
    // Sanitize all data before anything
    if(defined(Category)) Category = String(sanitize(Category));
    if(defined(Value)) Value = Number(sanitize(Value));
    if(defined(AirDate)) AirDate[0] = Date(sanitize(AirDate[0])), AirDate[1] = Date(sanitize(AirDate[1]));

    url=['https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues/?'];

    if(defined(Category)){
        // Get categories if not retrieved yet
        if(!defined(categories)){
            $.ajax({
                // url:        "categories.json",
                url:        "https://M4rqu1705.github.io/Jeopardy-API-UI/categories.json",
                cache:      false,
                dataType:   "json",
                success:    function(data){
                    categories = data;
                    autocomplete(document.getElementById("categoryInput"), categories);
                },
                error:      function(err){
                    console.log(err);
                }
            });
        }

        if(defined(categories)){
            matches = [];
            keys = Object.keys(categories);
            for(let c = 0; c<keys.length; c++){
                if(RegExp(Category, "i").test(keys[c])){
                    matches.push(keys[c]);
                }
            }
            url.push("category=".concat(categories[matches[0]]));
        }
    }

    if([100, 200, 300, 400, 500, 600].includes(Value)){
        url.push("value=".concat(Value));
    }

    if(typeof AirDate[0].getMonth === 'function' && AirDate[0] <= new Date()){
        day = AirDate[0].toISOString();
        url.push("min_date=".concat(day));
    }
    if(typeof AirDate[1].getMonth === 'function'){
        day = AirDate[1].toISOString();
        url.push("max_date=".concat(day));
    }

    if(url.length == 1){
        url = 'https://cors-anywhere.herokuapp.com/http://jservice.io/api/random/?count=10';
    }else{
        url = url.join("&");
    }

    return(url);
}

function updateContent(){

    var timer = setTimeout(function() {
        $.ajax({
            url:        getURL(),
            dataType:   "json",
            success:    function(data){
                // Empty search results before adding content
                $('#searchResults').empty();
                for(let c = 0; c<data.length; c++){
                    let answer =    String(data[c].answer),
                        question =  String(data[c].question),
                        value =     Number(data[c].value),
                        airdate =   new Date(data[c].airdate),
                        category =  String(data[c].category.title);

                    // Structures to help normalize data 
                    month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

                    airdate = " ".concat(month[new Number(airdate.getMonth())], " " , new String(airdate.getDate()), ", ", new String(airdate.getFullYear()));

                    // const TEXT_WIDTH = 40
                    // if(question.length > TEXT_WIDTH){
                    // question = question.slice(0, TEXT_WIDTH-3).concat("...")
                    // }


                    entryD = $('<div><div>').attr({
                        "class":"entry"
                    });
                    questionP = $('<p></p>').attr({
                        "class":"question"
                    });
                    detailsP = $('<p></p>').attr({
                        "class":"details"
                    });

                    questionP.text(question);
                    detailsP.text([
                        capitalize(category),
                        airdate,
                        value].join(" • "));

                    entryD.append(questionP, detailsP)

                    // #############################################################
                    // ###################### ON CLICK #############################
                    // #############################################################

                    $('#searchResults').append(entryD);
                }
            },
            complete:   function(){
                loadingSpinner(false);
            },
            error:      function(err){
                console.log(err);
            }
        });

    }, 1);
}
function autocomplete(field, possibleValues) {
    // Categories dictionary is passed in, but instead we need the keys
    possibleValues = Object.keys(possibleValues);

    var currentFocus;

    field.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        // Close any already open lists of autocompleted values
        closeAllLists();

        // Do not waste time on empty fields
        if (!val) return(false);
        // Do not waste time on other than characters
        if (!/[A-Za-z0-9_'"]/.test(val)){
            console.log("Exited auto completion");
            return(false);
        }

        currentFocus = -1;

        // Container for matches ...
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        // Append the DIV element as a child of the autocomplete container:
        this.parentNode.appendChild(a);

        for (i = 0; i < possibleValues.length; i++) {
            // Search criteria: first characters in common 
            if (possibleValues[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                match = possibleValues[i]
                b = document.createElement("DIV");
                // Make the matching letters bold
                b.innerHTML = "<strong>" + match.substr(0, val.length) + "</strong>";
                b.innerHTML += match.substr(val.length);

                // Insert a input field that will hold the current array item's value:
                b.innerHTML += "<input type='hidden' value='" + match + "'>";

                // End list once user selects this match
                b.addEventListener("click", function(e) {
                    field.value = this.getElementsByTagName("input")[0].value;
                    Category = field.value;
                    closeAllLists();
                    loadingSpinner(true);
                    updateContent();


                });
                a.appendChild(b);
            }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    field.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { // DOWN Arrow
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //UP Arrow
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { // ENTER key
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x){
                    x[currentFocus].click();
                }
            }

        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != field) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
    });
}



