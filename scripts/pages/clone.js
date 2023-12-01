const urlParams = new URLSearchParams(window.location.search);
const photographerId = parseInt(urlParams.get("id")); // Assurez-vous que l'ID est converti en nombre entier

// Fetch Data from JSON

async function getMedia() {
  try {
    const response = await fetch("data/photographers.json");
    const data = await response.json();

    return {
      media: data.media || [],
      photographers: data.photographers || [],
    };
  } catch (error) {
    console.error("Erreur:", error);
    return {
      media: [],
      photographers: [],
    };
  }
}

// Calculate Likes
function calculateTotalLikes(mediaArray) {
  return mediaArray.reduce((total, media) => total + media.likes, 0);
}

// Fonctions de tri
const sortByDate = (mediaArray) => {
  return mediaArray.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const sortByLikes = (mediaArray) => {
  return mediaArray.sort((a, b) => b.likes - a.likes);
};

const sortByTitle = (mediaArray) => {
  return mediaArray.sort((a, b) => a.title.localeCompare(b.title));
};

// Main Function

async function main() {
  const { media, photographers } = await getMedia();

  if (!media || !photographers) {
    console.error(
      "Data fetch error: No media or photographers data available."
    );
    return;
  }

  let photographerDetails = null;

  // Loop through photographers to find the matching one

  for (let i = 0; i < photographers.length; i++) {
    if (photographers[i].id === photographerId) {
      photographerDetails = photographers[i];
      break;
    }
  }

  const { name, city, country, tagline, price, portrait } = photographerDetails;

  let photographerDetailsHtml = "";
  let likesAndPriceHtml = "";
  let sortDropdown = "";
  let mediaSection = document.createElement("div");
  mediaSection.id = "media-section";
  let articles = "";

  // Display photographer details
  if (photographerDetails) {
    console.log(photographerDetails);
    photographerDetailsHtml = `      
      <div class="photograph-header">
    <div class="infos-style">
        <h1>${name}</h1>
        <p>${city}, ${country}</p>
        <p>${tagline}</p>
    </div>
    <button class="contact_button" onclick='displayModal("${name}")'>Contactez-moi</button>
    <div class="imagePh-style"><img src="assets/photographers/${portrait}" alt="${name}"
            class="portrait-size"></div>
</div>`;
  }

  document
    .querySelector("#main")
    .insertAdjacentHTML("beforeend", photographerDetailsHtml);

  sortDropdown = `<span  class="container-trier-par"><p class="p-trier-par">Trier Par</p><span class="span-trier-par"><div class="dropdown-top"><button tabIndex="0" class="dropbtn"><div class="date-text-container"><span>Date</span></div><img src="/assets/icons/vector.png" alt="Flèche" class="arrow-position rotate-arrow"></button><div id="myDropdown" class="dropdown-content dropdown"><hr class="custom-hr-class"><a href="#" class="link-drop">Popularité</a><hr class="custom-hr-class"><a href="#" class="link-drop">Titre</a></div></div></span></span>`;

  document.querySelector("#main").insertAdjacentHTML("beforeend", sortDropdown);

  const dropdownButton = document.querySelector(".dropdown-top");

  // Loop through media to find those that match the photographer's ID
  const matchingMedia = [];
  for (let i = 0; i < media.length; i++) {
    if (media[i].photographerId === photographerId) {
      matchingMedia.push(media[i]);
    }
  }

  let selectedSortingArray = [];

  dropdownButton.addEventListener("click", (e) => {
    const dateTextContainer = document.querySelector(".date-text-container");
    const dropdownMenu = document.querySelector("#myDropdown");
    const rotateArrow = document.querySelector(".rotate-arrow");
    dropdownMenu.classList.toggle("show");
    rotateArrow.classList.toggle("rotate");
    let option = "";
    if (e.target.classList.contains("link-drop")) {
      var previousValue = dateTextContainer.textContent;
      option = e.target.textContent.toLowerCase();
      // Update the displayed text in the custom select
      dateTextContainer.textContent = e.target.textContent;

      // Deselect other options
      const otherOptions = document.querySelectorAll(".link-drop");
      otherOptions.forEach((otherOption) => {
        if (otherOption !== e.target) {
          otherOption.classList.remove("selected");
        }
      });

      // Mark the selected option
      e.target.classList.add("selected");
      document.querySelector(".selected").textContent = previousValue;
    }

    const mediaDateSorted = sortByDate([...matchingMedia]);
    const mediaTitleSorted = sortByTitle([...matchingMedia]);
    const mediaPopularitySorted = sortByLikes([...matchingMedia]);

    // Select the appropriate sorting array based on the dropdown value

    switch (option) {
      case "date":
        selectedSortingArray = mediaDateSorted;
        // dateTextContainer.textContent = "Date";
        articlesFunction(selectedSortingArray);
        slider("click");
        slider("keypress");

        break;
      case "titre":
        selectedSortingArray = mediaTitleSorted;
        // dateTextContainer.textContent = "Titre";

        articlesFunction(selectedSortingArray);
        console.log(mediaTitleSorted);
        console.log("Title");
        slider("click");
        slider("keypress");

        break;
      case "popularité":
        selectedSortingArray = mediaPopularitySorted;
        // dateTextContainer.textContent = "Popularite";
        articlesFunction(selectedSortingArray);
        slider("click");
        slider("keypress");

        break;
    }
  });

  const totalLikes = calculateTotalLikes(matchingMedia);

  likesAndPriceHtml = `
  <p id="priceDay">${price}€/jour</p><span id="likes-heart"><i class="fa-solid fa-heart"></i>
  <p id="likes-p">${totalLikes}</p>
  </span>
  `;

  document
    .querySelector(".sticky-encart")
    .insertAdjacentHTML("beforeend", likesAndPriceHtml);

  function articlesFunction(selectedSortingArray) {
    // Reset articles to an empty string
    articles = "";
    selectedSortingArray.map(
      (
        { id, photographerId, title, image, video, likes, date, price },
        index
      ) => {
        if (image) {
          // Handle image
          articles += `<article class="media-style" tabIndex = "0" >
                                    <img src="assets/images/${image}" alt="${title}" class="media-size">
                                    <div class="title-like">
                                      <h3>${title}</h3>
                                      <span id="likes-and-icon">
                                        <p class="like-counter" data-liked="false" onclick='handleLikeClick(this)'>${likes}</p>
                                        <i class="fa-solid fa-heart" id="heart" aria-label="likes"></i>
                                      </span>
                                    </div>
                                  </article>`;
        } else if (video) {
          // Handle video
          articles += `<article class="media-style" tabIndex = "0" >
                                    <video alt="assets/images/${video}" controls="true" class="media-size">
                                      <source src="assets/images/${video}" type="video/mp4">
                                    </video>
                                    <div class="title-like">
                                      <h3>${title}</h3>
                                      <span id="likes-and-icon">
                                        <p class="like-counter" data-liked="false" onclick='handleLikeClick(this)'>${likes}</p>
                                        <i class="fa-solid fa-heart" id="heart" aria-label="likes"></i>
                                      </span>
                                    </div>
                                  </article>`;
        }
      }
    );

    mediaSection.innerHTML = articles;
  }

  articlesFunction(matchingMedia);

  document.querySelector("#main").appendChild(mediaSection);

  slider("click");
  slider("keypress");
}

function slider(event) {
  const articles = document.querySelectorAll(".media-style");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxVideo = document.querySelector("#lightboxVideo");
  const lightbox = document.querySelector("#lightbox");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const imageTitle = document.querySelector("#ImageName");
  const closeLightboxBtn = document.querySelector(".close-lightbox");
  let currentIndex = 0;

  articles.forEach((article, index) => {
    article.addEventListener(event, (e) => {
      currentIndex = index;
      const image = article.querySelector("img");
      const video = article.querySelector("video");
      const imageName = article.querySelector(".title-like h3");
      imageTitle.textContent = imageName.textContent;
      currentIndex = index;
      console.log("Click", currentIndex);

      if (image) {
        lightboxImage.src = image.src;
        lightboxImage.style.display = "block";
        lightboxVideo.style.display = "none";
      } else if (video) {
        lightboxVideo.src = video.querySelector("source").src;
        lightboxVideo.style.display = "block";
        lightboxImage.style.display = "none";
      }

      if (!e.target.classList.contains("like-counter")) {
        lightbox.style.display = "block";
      }
    });
  });

  function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImage.style.display = "none";
    lightboxVideo.style.display = "none";
    // currentIndex = 0;
  }

  closeLightboxBtn.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      closeLightbox();
    }
  });

  function moveSlide(direction) {
    console.log("before", currentIndex);
    currentIndex += direction;
    if (currentIndex < 0) {
      currentIndex = articles.length - 1;
    } else if (currentIndex >= articles.length) {
      currentIndex = 0;
    }

    const currentArticle = articles[currentIndex];
    const currentImage = currentArticle.querySelector("img");
    const currentVideo = currentArticle.querySelector("video");
    const currentTitle = currentArticle.querySelector(".title-like h3");
    imageTitle.textContent = currentTitle.textContent;

    if (currentImage) {
      lightboxImage.src = currentImage.src;
      lightboxImage.style.display = "block";
      lightboxVideo.style.display = "none";
    } else if (currentVideo) {
      lightboxVideo.src = currentVideo.querySelector("source").src;
      lightboxVideo.style.display = "block";
      lightboxImage.style.display = "none";
    }

    // console.log(currentIndex);
  }

  // Event listeners for close button, next button, and previous button
  document
    .querySelector(".close-lightbox")
    .addEventListener("click", closeLightbox);

  // Remove existing click and keydown event listeners
  nextButton.removeEventListener("click", handleNextButtonClick);
  prevButton.removeEventListener("click", handlePrevButtonClick);
  nextButton.removeEventListener("keydown", handleNextButtonKeydown);
  prevButton.removeEventListener("keydown", handlePrevButtonKeydown);

  // Define event handler functions
  function handleNextButtonClick() {
    moveSlide(1);
  }

  function handlePrevButtonClick() {
    moveSlide(-1);
  }

  function handleNextButtonKeydown(e) {
    if (e.keyCode == 13) {
      // Enter key
      moveSlide(1);
    }
  }

  function handlePrevButtonKeydown(e) {
    if (e.keyCode == 13) {
      // Enter key
      moveSlide(-1);
    }
  }

  if (event == "click") {
    nextButton.addEventListener("click", handleNextButtonClick);
    prevButton.addEventListener("click", handlePrevButtonClick);
  } else {
    nextButton.addEventListener("keydown", handleNextButtonKeydown);
    prevButton.addEventListener("keydown", handlePrevButtonKeydown);
  }
}

function handleLikeClick(event) {
  console.log(event);
  // Check if the media has already been liked
  if (event.getAttribute("data-liked") === "true") {
    return; // If already liked, exit the function early
  }

  // Get the current number of likes from the clicked element
  const currentLikes = parseInt(event.textContent, 10);

  // Increment the number of likes
  const newLikes = currentLikes + 1;

  // Update the displayed number of likes
  event.textContent = newLikes;

  // Mark the media as liked
  event.setAttribute("data-liked", "true");

  // Update the total likes in the sticky-encart div
  const totalLikesElement = document.querySelector("#likes-p");
  const currentTotalLikes = parseInt(totalLikesElement.textContent, 10);
  totalLikesElement.textContent = currentTotalLikes + 1;
}

main();
