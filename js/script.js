/* ============================ */
/* ====== Menu Animation ====== */
/* ============================ */
body = document.getElementsByTagName("body")[0];
aside = document.getElementsByTagName("aside")[0];
closeMenuButton = document.getElementById("close-menu");

aside.addEventListener("mousedown", function (e){
    body.style.gridTemplateColumns = "auto 500px";
    aside.style.right = '0px';
});

closeMenuButton.addEventListener("click", function (e){
    body.style.gridTemplateColumns = "auto 100px";
    aside.style.right = '-400px';
    triggerSearch();
});


// Prepare variables used to construct url
var Clue,
    Answer,
    Value,
    AirDate = [ new Date("January 1, 1950"), new Date() ],
    Category;
var categories;


// ======================================
// ======== Category Input field ========
// ======================================

categoryInput = document.getElementById("category-input");

function autocomplete(field, possibleValues) {
    // Categories dictionary is passed in, but instead we need the keys
    possibleValues = Object.keys(possibleValues);

    var currentFocus;

    field.addEventListener('input', function(e) {
        var matchesD, suggestionD, i, value = this.value;
        // Close any already open lists of autocompleted values
        closeAllLists();

        // Do not waste time on empty fields
        if (!value){
            Categories = undefined;
            return(false);
        };
        // Do not waste time on strange characters
        if (!/[A-Za-z0-9_'"]/.test(value)){
            return(false);
        }

        currentFocus = -1;

        // Container for matches ...
        matchesD = document.createElement('div');
        matchesD.setAttribute('id', this.id + 'autocomplete-list');
        matchesD.setAttribute('class', 'autocomplete-items');

        matchesD.style.width = this.offsetWidth + "px";
        matchesD.style.position = "fixed";
        matchesD.style.top = ($(this).offset().top + this.offsetHeight) + "px";
        matchesD.style.left = $(this).offset().left + "px";
        matchesD.style.zIndex = "10";

        document.getElementsByTagName("body")[0].appendChild(matchesD);

        // Append the DIV element as a child of the autocomplete container:
        // this.parentNode.appendChild(matchesD);

        for (i = 0; i < possibleValues.length; i++) {
            // Search criteria: first characters in common
            if (possibleValues[i].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
                match = possibleValues[i]

                suggestionD = document.createElement('div');


                // Make the matching letters bold
                let content = '<strong>' + match.substr(0, value.length) + '</strong>';
                content += match.substr(value.length);

                // Insert a input field that will hold the current array item's value:
                content += "<input type='hidden' value='" + sanitize(match) + "'>";

                suggestionD.innerHTML = content;

                suggestionD.addEventListener('click', function(e) {
                    field.value = this.getElementsByTagName('input')[0].value;
                    Category = field.value;
                    closeAllLists();
                    triggerSearch();
                });
                matchesD.appendChild(suggestionD);

                // Keep the list within 10 elements
                if(matchesD.childNodes.length >= 10){
                    break;
                }
            }
        }
    });

    field.addEventListener('keydown', function(e) {
        let list = document.getElementById(this.id + 'autocomplete-list');

        if(list)
            list = list.getElementsByTagName('div');

        if(e.keyCode == 40) {          // Down Arrow
            currentFocus++;
            addActive(list);
        }else if (e.keyCode == 38) {   //Up Arrow
            currentFocus--;
            addActive(list);
        }else if (e.keyCode == 13) {   // Enter key
            e.preventDefault();
            if(defined(list)){
                // Search for currently focused entry
                if(currentFocus > -1) {
                    list[currentFocus].click();
                }else{
                    list[0].click();
                }
            }

        }
    });

    function addActive(items) {
        // Classify items as "active":
        if (!items) return false;

        // Start by removing the "active" class on all items
        removeActive(items);

        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (items.length - 1);

        // Add class "autocomplete-active":
        items[currentFocus].classList.add('autocomplete-active');
    }

    function removeActive(items) {
        // Remove the "active" class from all autocomplete items:
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('autocomplete-active');
        }
    }

    global function closeAllLists(element) {
        // Close all autocomplete lists in the document, except the one passed as an argument:
        let items = document.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < items.length; i++) {
            if (element != items[i] && element != field) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
    }
}

// ===================================
// ======== Value Input field ========
// ===================================

valueInput = document.getElementById('value-input');

// Automatically delete contents on focus
valueInput.addEventListener('focus', function(e) {
    valueInput.value = '';
    Value = undefined;
});

valueInput.addEventListener('keydown', function(e) {
    // If backspace or delete pressed
    if(e.keyCode == 8 || e.keyCode == 46){
        valueInput.value = '';
        Value = undefined;
    }
});

// Put restraints to the user input
valueInput.addEventListener('input', function(e) {
    v = String(valueInput.value);
    if(v.startsWith("###") && !isNaN(v.substring(3))){
        Value = Number(v.substring(3));
    }else if(v !== "###"){
        Value = Number(v);
    }

    if(Value < 100 && (1 <= Value && Value <= 10)){
        Value = Math.round(Value)*100;
    }else if(0<Value && Value<1){
        Value = 100;
    }else if(10<=Value && Value<100){
        Value = 1000;
    }else if(Value >= 1000){
        Value = 1000;
    }else{
        Value = undefined;
    }
    if(Value === undefined){
        valueInput.value = "###";
    }else{
        valueInput.value = Value;
    }
});


// ==================================
// ======== Date Input field ========
// ==================================

startDateInput = document.getElementById('start-air-date');
endDateInput = document.getElementById('end-air-date');

// Set default dates
startDateInput.value = new Date('January 1, 1950').toISOString().slice(0,10);
endDateInput.value = new Date().toISOString().slice(0,10);

startDateInput.addEventListener('input', function(e){
    // Make sure startDate is always less than or equal to endDate
    if(new Date(startDateInput.value).getTime() > new Date(endDateInput.value).getTime()){
        startDateInput.value = new Date(endDateInput.value).toISOString().slice(0,10);
    }

    if(String(startDateInput.value) == ""){
        AirDate[0] = undefined;
    }else{
        AirDate[0] = new Date(startDateInput.value);
    }
});

endDateInput.addEventListener('input', function(e){
    // Make sure startDate is always less than or equal to endDate
    if(new Date(startDateInput.value).getTime() > new Date(endDateInput.value).getTime()){
        endDateInput.value = new Date(startDateInput.value).toISOString().slice(0,10);
    }

    AirDate[1] = new Date(endDateInput.value);

});


startDateInput.addEventListener('keydown', function(e) {
    // If backspace or delete pressed
    if(e.keyCode == 8 || e.keyCode == 46){
        startDateInput.value = '';
        AirDate[0] = new Date('January 1, 1950');
    }
});

endDateInput.addEventListener('keydown', function(e) {
    // If backspace or delete pressed
    if(e.keyCode == 8 || e.keyCode == 46){
        endDateInput.value = '';
        AirDate[1] = new Date();
    }
});

// ===============================
// ======== Search Button ========
// ===============================

searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function(e){
    triggerSearch();
});


// ==================================
// ======== Helper Functions ========
// ==================================

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
        "?": '&#63;'
    };
    const reg = /[&<>"'?/]/ig;
    var output = str.replace(reg, (match)=>(map[match]));
    return(output);
}

// Check if variable is defined or not
function defined(data){
    return(Boolean(typeof data !== 'undefined'));
}

function triggerSearch(){
    loadingSpinner(true);
    updateContent();
}

// Show loading spinner
function loadingSpinner(state){
    // if(state){
        // document.getElementById("loadingIcon").style.display = "block";
    // }else{
        // document.getElementById("loadingIcon").style.display = "none";
    // }
}


// ===================================
// ======== API GET Functions ========
// ===================================

function getURL(){
    // https://cors-anywhere.herokuapp.com/
    defaultURL = 'http://jservice.io/api/random/?count=10';
    URL = ['http://jservice.io/api/clues/?'];

    // Get categories if not retrieved yet
    if(!defined(categories)){
        $.ajax({
            // url:        "categories.json",
            url:        "https://M4rqu1705.github.io/Jeopardy-API-UI/categories.json",
            cache:      false,
            dataType:   "json",
            success:    function(data){
                categories = data;
                autocomplete(categoryInput, categories);
            },
            error:      function(err){
                console.log(err);
            }
        });
    }

    if(defined(Category) && defined(categories)){
        matches = [];
        keys = Object.keys(categories);
        URL.push("category=".concat(categories[Category]));
    }

    if(defined(Value) && [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].includes(Value)){
        URL.push("value=".concat(Value));
    }

    if(defined(AirDate) && typeof AirDate[0].getMonth === 'function' && AirDate[0] <= new Date()){
        day = AirDate[0].toISOString().slice(0,10);
        URL.push("min_date=".concat(day));
    }
    if(defined(AirDate) && typeof AirDate[1].getMonth === 'function'){
        day = AirDate[1].toISOString().slice(0,10);
        URL.push("max_date=".concat(day));
    }

    if(URL.length == 1){
        return(defaultURL);
    }else{
        return(URL[0] + URL.slice(1).join("&"));
    }
}

function updateContent(){
    // Put function in a 1ms timer because otherwise loading spinner wouldn't be displayed
    timer = setTimeout(function() {
        $.ajax({
            url:        getURL(),
            dataType:   "json",
            success:    function(data){

                let searchResultsD = document.getElementById('search-results');

                // Empty search results before adding content
                while(searchResultsD.firstChild){
                    searchResultsD.removeChild(searchResultsD.firstChild);
                }

                for(let c = 0; c<data.length; c++){
                    // Extract data of interest
                    let answer =    String(data[c].answer),
                        question =  String(data[c].question),
                        value =     Number(data[c].value),
                        airdate =   new Date(data[c].airdate),
                        category =  String(data[c].category.title);


                    // Structures to help normalize data
                    month = ["January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"];
                    function capitalize(string){
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    }

                    airdate = " ".concat(
                        month[new Number(airdate.getMonth())], " " ,    // Month
                        new String(airdate.getDate()), ", ",            // Day
                        new String(airdate.getFullYear()));             // Year

                    // Restrain question width 
                    // const TEXT_WIDTH = 50;
                    // if(question.length > TEXT_WIDTH){
                        // question = question.slice(0, TEXT_WIDTH-3).concat("...")
                    // }

                    // Entry container
                    entryD = document.createElement('div');
                    entryD.classList.add('entry');

                    // Question
                    questionP = document.createElement('p');
                    questionP.classList.add('question');
                    if(question.length > 1)     // Make sure question is not blank
                        questionP.textContent = question;
                    else
                        break;

                    // Details
                    detailsP = document.createElement('p');
                    detailsP.classList.add('details');
                    detailsP.textContent = [capitalize(category), airdate, value].join(" • ");

                    // Other data
                    questionI = document.createElement('input');
                    answerI = document.createElement('input');
                    valueI = document.createElement('input');
                    categoryI = document.createElement('input');
                    airDateI = document.createElement('input');

                    questionI.setAttribute('type', 'hidden');
                    answerI.setAttribute('type', 'hidden');
                    valueI.setAttribute('type', 'hidden');
                    categoryI.setAttribute('type', 'hidden');
                    airDateI.setAttribute('type', 'hidden');

                    questionI.setAttribute('value', question);
                    answerI.setAttribute('value', answer);
                    valueI.setAttribute('value', value);
                    categoryI.setAttribute('value', capitalize(category));
                    airDateI.setAttribute('value', airdate);


                    entryD.appendChild(questionP);
                    entryD.appendChild(detailsP);
                    entryD.appendChild(questionI);
                    entryD.appendChild(answerI);
                    entryD.appendChild(valueI);
                    entryD.appendChild(categoryI);
                    entryD.appendChild(airDateI);

                    entryD.addEventListener('click', function(e){
                        console.log("Clickety click click!");
                    });
                    // #############################################################
                    // ###################### ON CLICK #############################
                    // #############################################################

                    searchResultsD.appendChild(entryD);
                }
            },
            complete:   function(){
                loadingSpinner(false);
                console.log("Complete!");
            },
            error:      function(err){
                console.log(err);
            }
        });

    }, 1);
}