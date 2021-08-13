// Define Global Variables

const OFFSET = 500;          // Used for indicating that the section viewed is near to the top.
let currentSection,          // Stores the current viewed section in the viewport.
    currentSectionId = "",   // Stores the ID of current viewed section in the viewport.
    sections = [],           // Stores all (sections start positions) in the page.
    topScroller;             // Scroll to top button

// End Global Variables
// --------------------------------------------------------


// Start Helper Functions

    // Returns section position as {top, left} object
function getSectionPostion(sectionId){
    let section = document.getElementById(sectionId);
    return {
        top: section.offsetTop - 30,
        left: section.offsetLeft - 30
    }
}

    // Returns all sections in the page
function getAllSections(){
    return document.querySelectorAll("section");
}

    // Returns a navigation item to be put in the nav bar
function makeNavItem(item){
    const listItem = document.createElement("LI");
    const anchor = document.createElement("A");
    const sectionId = item.getAttribute("id");
    anchor.setAttribute("class", "menu__link");
    anchor.setAttribute("href", `#${sectionId}`);
    anchor.textContent = item.getAttribute("data-nav");
    anchor.onclick = (e) => {
        e.preventDefault();
        smoothScroll(sectionId);
    };
    listItem.appendChild(anchor);
    return listItem;
}

    // Ease In Out Quadratic equation to be used in animation.
function easeInOutQuad (progress, start, distance, duration) {
    progress /= duration/2;
    if (progress < 1) return distance/2*progress*progress + start;
    progress--;
    return -distance/2 * (progress*(progress-2) - 1) + start;
}

// End Helper Functions
// --------------------------------------------------------


// Begin Main Functions

    // Builds the navigation bar 
function buildNav(){
    const navList = document.getElementById("navbar__list");
    for (let i of getAllSections()){
        const item = makeNavItem(i);
        navList.appendChild(item);
    }
}

    // Activate the specifed section depending on the sectionId parameter
function activateSection(sectionId){
    const section = document.getElementById(sectionId);

    // Deactivate the current active section
    currentSection.classList.remove("active");
    document.querySelector(`a[href="#${currentSectionId}"]`).classList.remove("active");

    // Activate the specified section
    section.classList.add("active");
    document.querySelector(`a[href="#${sectionId}"]`).classList.add("active");
    setCurrentSection(sectionId, section);
}

    // Scrolls to the specified section smoothly
function smoothScroll(sectionId, position = 0, duration = 1000){

    let targetPosition = 0;

    if(typeof sectionId == "string") 
        targetPosition = getSectionPostion(sectionId).top;
    else
        targetPosition = position;

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    window.requestAnimationFrame(function AnimationFrame(step){
        if(!startTime) startTime = step;
        const progress = step - startTime;
        window.scrollTo(0, easeInOutQuad(progress, startPosition, distance, duration));
        if(progress < duration) window.requestAnimationFrame(AnimationFrame);
    });
    
}

    // Setting the current section variable.
function setCurrentSection(sectionId, section = undefined){
    currentSection = (section == undefined) ? document.getElementById(sectionId) : section;
    currentSectionId = sectionId;
}

    // Initialize global parameters
function initialize(){

    let allSections = getAllSections();

    if(allSections.length != 0){

        for (let section of allSections){
            sections.push(section.getBoundingClientRect().top + window.scrollY);
        }
        setCurrentSection(allSections[0].id);

        // Activating the current section
        activateSection(currentSectionId);
    }

    // Initialize topScroller
    topScroller = document.getElementById("js-scroller");
    topScroller.classList.add("hide");

    // Prevent flickering while page loading
    setTimeout(() => {
        topScroller.style.transition = "ease all 0.5s";
    }, 1000);
    
}

// End Main Functions
// --------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    
    buildNav();
    initialize();

    // Setting Events
    window.onscroll = function(){
        if(window.scrollY <= 100){
            topScroller.classList.add("hide");
        }
        else{
            topScroller.classList.remove("hide");
        }
        let index;
        for(let sectionIndex in sections){
            if(sections[sectionIndex] - OFFSET <= window.scrollY){
                index = sectionIndex;
            }
        }
        for(let sectionIndex in sections){
            let parsedSectionIndex = parseInt(sectionIndex) + 1;
            if(sectionIndex == index){
                activateSection(`section${parsedSectionIndex}`);
                setCurrentSection(`section${parsedSectionIndex}`);
            }
        }
    }

    topScroller.onclick = function(){
        smoothScroll(null, position = 0, duration = 1000);
    }
    
});