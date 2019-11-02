/* ============================ */
/* ====== Menu Animation ====== */
/* ============================ */
body = document.getElementsByTagName("body")[0];
aside = document.getElementsByTagName("aside")[0];
closeMenuButton = document.getElementById("close-menu");

aside.addEventListener("mousedown", function (e){
    if(window.innerWidth > 767){
        body.style.gridTemplateColumns = "auto 19.230769em";
        aside.style.right = '0px';
    }else{
        body.style.gridTemplateRows = "3.846154em auto 1em";
    }

    document.dispatchEvent(new Event('closeAnswers'));
});

closeMenuButton.addEventListener("click", function (e){
    if(window.innerWidth > 767){
        body.style.gridTemplateColumns = "auto 3.846154em";
        aside.style.right = '-15.384615em';
    }else{
        body.style.gridTemplateRows = "3.846154em 3.384615em auto";
    }

    setTimeout(delay(10), 1);
});

async function focusInput(element){
    document.getElementById(element).focus();
}

// Prepare variables used to construct url
const defaultAirDate = [new Date("January 1, 1950"), new Date()];
var Clue,
    Answer,
    Value,
    AirDate = Array.from(defaultAirDate),   // Clone array NOT copy by reference
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

        // Make sure to also close suggestions as menu is being closed
        closeMenuButton.addEventListener("click", function (e){
            closeAllLists();
        });
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

    function closeAllLists(element) {
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
startDateInput.value = defaultAirDate[0].toISOString().slice(0,10);
endDateInput.value = defaultAirDate[1].toISOString().slice(0,10);

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
        AirDate[0] = defaultAirDate[0];
    }
});

endDateInput.addEventListener('keydown', function(e) {
    // If backspace or delete pressed
    if(e.keyCode == 8 || e.keyCode == 46){
        endDateInput.value = '';
        AirDate[1] = defaultAirDate[1];
    }
});

// ===============================
// ======== Search Button ========
// ===============================

searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function(e){
    closeMenuButton.click()
    triggerSearch();
});


// ==================================
// ======== Helper Functions ========
// ==================================

function delay(ms){
    endTime = new Date().getTime() + ms;
    while(new Date().getTime() < endTime){
        ;
    }
}

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
    loadingIcon = document.getElementById("loading-icon");
    loadingIconContainer = document.getElementById("loading-icon-container");
    searchResults = document.getElementById("search-results");

    if(state){
        loadingIconContainer.style.visibility = "visible";
        loadingIconContainer.style.height = "100%";
        loadingIconContainer.style.width = "100%";
        if(window.innerWidth <= 767){
            loadingIcon.style.width = "80%";
            loadingIcon.style.width = loadingIcon.offsetWidth + "px";
            loadingIcon.style.height = loadingIcon.offsetWidth + "px";
        } else{
            loadingIcon.style.height = "80%";
            loadingIcon.style.width = loadingIcon.offsetHeight + "px";
            loadingIcon.style.height = loadingIcon.offsetHeight + "px";
        }
        searchResults.style.height = "0";
    }else{
        loadingIconContainer.style.visibility = "hidden";
        loadingIconContainer.style.height = "0";
        loadingIconContainer.style.width = "0";
        searchResults.style.height = "100%";
    }
}


// ===================================
// ======== API GET Functions ========
// ===================================

function getURL(){
    defaultURL = 'https://cors-anywhere.herokuapp.com/http://jservice.io/api/random/?count=20';
    URL = ['https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues/?'];
    // defaultURL = 'http://jservice.io/api/random/?count=20';
    // URL = ['http://jservice.io/api/clues/?'];

    // Get categories if not retrieved yet
    if(!defined(categories)){
        $.ajax({
            url:        "resources/data/categories.json",
            headers:{
                "Access-Control-Allow-Origin": "https://cors-anywhere.herokuapp.com"
            },
            // url:        "https://M4rqu1705.github.io/Jeopardy-API-UI/resources/data/categories.json",
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

    if(defined(AirDate) && AirDate[0] != defaultAirDate[0] && AirDate[0] <= new Date()){
        day = AirDate[0].toISOString().slice(0,10);
        URL.push("min_date=".concat(day));
    }
    if(defined(AirDate) && AirDate[1] != defaultAirDate[1]){
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
            headers:{
                "Access-Control-Allow-Origin": "https://cors-anywhere.herokuapp.com"
            },
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

                    entryD.appendChild(questionP);
                    entryD.appendChild(detailsP);

                    entryD.addEventListener('click', function(e){
                        body = document.getElementsByTagName('body')[0];
                        article = document.getElementsByTagName('article')[0];

                        answerScreenD = document.createElement('div');
                        answerScreenD.id = 'answer-screen'; 

                        answersDivs = [
                            document.createElement('div'),  // Exit button
                            document.createElement('p'),    // Question
                            document.createElement('p'),    // Answer
                            document.createElement('div'),  // Category, Airdate and Value separated by " • "
                        ]

                        answersDivs[0].id = 'answer-screen-close';
                        answersDivs[1].id = 'answer-screen-question';
                        answersDivs[2].id = 'answer-screen-answer';
                        answersDivs[3].id = 'answer-screen-details';

                        answersDivs[1].class = 'content-center';
                        answersDivs[2].class = 'content-center';
                        answersDivs[3].class = 'content-center';


                        answersDivs[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                        answersDivs[1].innerHTML = '<span>' + capitalize(question.trim()) + '</span>';
                        answersDivs[2].innerHTML = '<span>' + capitalize(answer.trim()) + '</span>';
                        if(window.innerWidth <= 767){
                            answersDivs[3].innerHTML = '<span>' + ["<strong>Category:</strong> " + capitalize(category.trim()), "<strong>Date:</strong> " + airdate.trim(), "<strong>Value:</strong> " + value].join("<br>") + '</span>'; 
                        } else{
                            answersDivs[3].innerHTML = '<span>' + [capitalize(category.trim()), airdate.trim(), value].join(" • ") + '</span>'; 
                        }

                        answersDivs[0].addEventListener('click', function(e){
                            body.removeChild(answerScreenD);
                            article.style.height = "100%";
                        });

                        for(c = 0; c<answersDivs.length; c++){
                            answerScreenD.appendChild(answersDivs[c]);
                        }

                        body.insertBefore(answerScreenD, article);


                        // Adjust font size
                        $(answersDivs[1]).textfill({"maxFontPixels":200, "minFontPixels":15});
                        firstsFont = Number($(answersDivs[1].children[0]).css('font-size').slice(0,-2));
                        $(answersDivs[2]).textfill({"maxFontPixels":firstsFont, "minFontPixels":15, "widthOnly":true});
                        secondsFont = Number($(answersDivs[2].children[0]).css('font-size').slice(0,-2));

                        if(window.innerWidth <= 767){
                            $(answersDivs[3]).textfill({"maxFontPixels":secondsFont, "minFontPixels":15, "widthOnly":false});
                        }else{
                            $(answersDivs[3]).textfill({"maxFontPixels":secondsFont, "minFontPixels":15, "widthOnly":true});
                        }

                        article.style.height = "0";

                        function closeAnswers(){
                            setTimeout(answersDivs[0].click(), 3000);
                        }
                        if (document.addEventListener) {
                            document.addEventListener('closeAnswers', closeAnswers, false);
                        } else {
                            document.attachEvent('closeAnswers', closeAnswers);
                        }
                    });

                    searchResultsD.appendChild(entryD);
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

