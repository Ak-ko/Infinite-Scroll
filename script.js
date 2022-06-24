const img_container = document.getElementById('img-container');
const loader = document.getElementById('loader');


// Unsplah APi
let photo_count = 30; // this become the initial loaded
const img_orientation = 'landscape';
const access_key = '-Oyt6yiHJa4P4c3XfHxeM4FAko_hdxPmoYGjMC0BOkA';

let ready = false;
let imagesLoaded = 0;
let totalImages  = 0;

let apiUrl = `https://api.unsplash.com/photos/random?client_id=${access_key}&count=${photo_count}&orientation=landscape`;

// Showing all the images are ready
function imgLoaded() {    
    imagesLoaded++; 
    if(imagesLoaded === totalImages) {
        loader.hidden = true;
        ready = true;
    }
}


// setting attributes (don't want to repeat the same code again and again)
function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// putting images to the document
function addImagesToDocument(data) {
    // reseting the images loaded to 0
    imagesLoaded = 0;
    
    totalImages = data.length;
    
    
    data.forEach(img => {
        // setting attributes to the tag
        const anchor_tag = document.createElement('a');
        // anchor_tag.setAttribute('href', img.links.html);       
        setAttributes(anchor_tag, {
          href: img.links.html,
          target: '_blank',
        })

        const img_tag = document.createElement('img');        
        setAttributes(img_tag, {
            src: img.urls.regular,
            alt: img.alt_description,
            title: img.alt_description,
        })

        if(img.alt_description == null) img_tag.title = 'unknown title';
        else img_tag.title = img.alt_description;
        
        // check whether images are loaded or not
        img_tag.addEventListener('load', imgLoaded);


        // creating an img link
        anchor_tag.appendChild(img_tag);        
        // put the created img tag to the img_container
        img_container.appendChild(anchor_tag);
    });
}

// getting images
async function gettingUnsplahImagesFromApi() {
    try {        

        const respond = await fetch(apiUrl);
        const data = await respond.json();
        
        // adding images
        addImagesToDocument(data);    
    } catch(err) {        
        console.log(err);
    }
}

// infinite scroll activation by fetching the photos again and again when it meets the end of the window's height
window.addEventListener('scroll', () => {
    if(window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000 && ready){
        ready = false;
        gettingUnsplahImagesFromApi();
    }
})


// On Load
gettingUnsplahImagesFromApi();
