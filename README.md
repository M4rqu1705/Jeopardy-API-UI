# JEOPARDY API UI

Welcome to Jeopardy API UI! The web application to search past Jeopardy questions by category, air date and value! 
Using your favorite browser [(1)](#Exceptions) you will be greeted with 20 random jeopardy questions to get the feel for the application. They are identified by the question and include category, air date and value below, but they won’t include the answer!
 
If you’re too curious and want to know the answer, you can click any question and a screen will pop up with the answer! 
 
Want a greater challenge? Are you bored of the topics inside this random set? Or are they just outdated? The good news is that you can look for questions using the menu on the right! Just click on it and you will be able to enter a category with a fully integrated auto-completion menu! Just so you don’t waste time looking for inexistent categories. 
 
Want to search for more recent questions? Enter the date or use the calendar on the left space to change the start air date. Wait, what? Are you more into classics? Then why didn’t you say so!! Change the end air date on the right space and you’ll receive older questions! However, don’t try an break the program by entering an earlier date than the start date. The application is smarter than that!
 
Now, I see you like a challenge. Then ask for harder questions by entering the desired value! But don’t worry. I know you’re lazy and you don’t want to write too many zeroes or have to use an imprecise slider. You’ll have total control over the value while still just entering one or two characters. Just enter the first number (1, for example), and it will automatically jump to a valid difficulty level. Want a question of 1000 difficulty? No problem! Just enter any other number and boom! You instantly input your value in under 2 key presses. But don’t think you can fool the program here. Any other character you enter besides a number will result in an undefined value, and your search will not work.
 
Don’t forget to hit the search button!
 
But … I don’t see anything. Well, there wasn’t a match for your specific search. Try widening your date intervals,
 
There! That did the trick. 

But I want to use the program and I don’t have a laptop with me! That’s not a problem at all, because the application also works on mobile phones! It responds to the device’s screen and will adjust accordingly
       
###### Browser Exceptions
Web application has problems with Microsoft Edge and Internet Explorer, but Google Chrome and Firefox and perfectly fine!

## TOOLS

I hope you enjoyed my application. I spent a lot of time designing it, programming it, optimizing it and solving technical problems. I used
*	AdobeXD for prototyping and initial design, including color palette selection, element arrangement and I even used it to determine which features I would implement and which I wouldn’t. (https://github.com/M4rqu1705/Jeopardy-API-UI/tree/master/resources/preliminary-design) 
*	In order to program I made extensive use of Google Chrome, Firefox, their developer tools, and the Vim text editor. Yes. I said Vim. My favorite editor!! My vimrc is in my GitHub (https://github.com/M4rqu1705/vimrc) if anybody is curious 👀.
*	I worked on a Samsung Notebook 7 laptop. A simple laptop, yet it goes with me everywhere.
*	In order to capture and store every possible category for the autocompletion, I made a Python script that uses the requests module and a for loop from 0 to 20,000 in order to look for every possible category through brute-force and store it in a JSON file. (https://github.com/M4rqu1705/Jeopardy-API-UI/tree/master/resources/tools) 
*	The programming languages used in the Web Application were HTML5, CSS3 & JavaScript. 
    *	I made extensive use of CSS Grid and Flexbox for layout, media queries to account for responsiveness, and an external tool called ‘Autoprefixer’ to help me fight lack of compatibility between browsers. Nevertheless, Edge and Explorer wouldn’t cooperate much.
    *	I used jQuery and a plugin called textfill. However, I wanted to have as pure JavaScript as I could, so I only resorted to use jQuery to do Ajax requests and textfill to save space and time.
*	If I would have more time I would add another button inside the menu in order to generate a random Game Board simulation. I even had the design made for desktops. However, tests and other priorities led me to cut the project short and end it here.
*	I would have loved to develop the web application mobile-first. However, time constraints led me to make a basic desktop version first that I would be sure worked on time and then added the corresponding media queries to add responsiveness to the web application. 
*	Git Pages website: https://M4rqu1705.github.io/Jeopardy-API-UI/ 
*	Repository: https://github.com/M4rqu1705/Jeopardy-API-UI

 
## PROBLEMS
During the process of programming I found multiple problems
*	“Mixed content error”: I am running my web application in Git Pages, which uses the HTTPS (HyperText Transfer Protocol Secure) for communication. However, the API host, jservice.io uses HTTP (HyperText Transfer Protocol) which is an insecure protocol and would basically annul any progress made by HTTP safety-wise. Basically, every browser prevents mixed content unless you disable some settings. However, this is not the norm and shouldn’t be used for production. Alternatives I considered were forcing the website to be HTTPS by prepending “https://” instead of “http://”, preparing a PHP script to re-rout my traffic from inside the page, use an open proxy somewhere and rout all traffic through it, or maybe using a VPN. The first two alternatives didn’t work. Forcing HTTPS did not work since jservice did not have the appropriate certificates. Git Pages won’t execute PHP scripts (and I’ve not used PHP too extensively), so I wouldn’t be able to re-rout traffic through a script. After some research I found “https://corsproxy.github.io/” which offered “https://crossorigin.me/” as a way to access resources from a website that isn’t CORS enabled. The site did not work, but I later found “https://cors-anywhere.herokuapp.com/” and pre-pended it to my URL. 
*	“Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https”: Since I was using a “categories.json” data file in my program and I decided to retrieve it using an ajax request, Google Chrome and Firefox complained about not supporting the “file:////” protocol involved in retrieving data from local storage. I was able to mitigate this problem by referencing the “categories.json” file I had uploaded to my repository. However, this led to my next problem …
*	I had stumbled with a Same-origin Policy error. For security reasons browsers prevent scripts from making requests to the current page, and I still had problems with retrieving the “categories.json” file from the live Git Page. However, I found excellent articles like [this one](https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9) which explained why this occurred and how I could add an "Access-Control-Allow-Origin” key in the HTTP header in order to solve this problem, and it did!
*	Flexbox vs CSS Grid: I initially had formatted the website purely with Flexbox. I realized I had to make it responsive and thought an approach where I would use JavaScript to manipulate the DOM would be fine. However, after reading more and seeing YouTube videos I learned that this is not that good of a practice and instead there is a pretty recent alternative called CSS Grid which instead of basing its arrangements in uni-linear form, it does so with powerful 2d grids which are very flexible using only CSS. I went with this choice and it ended up being way easier to adapt the Desktop web application to Mobile.
