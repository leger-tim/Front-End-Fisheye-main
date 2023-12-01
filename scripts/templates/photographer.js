function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  // Supprime le .jpg
  let imgAlt = portrait.replace(".jpg", "");

  // Sépare les mots qui commencent par une majuscule, à réviser
  const modifiedString = imgAlt.replace(/([a-z])([A-Z])/g, "$1 $2");

  function getUserCardDOM() {
    return `
      <article>
        <a href="replica.html?id=${id}" class="link-image">
          <div class="container-img">
            <img src="${picture}" alt="${modifiedString}" class="photographer-img">
          </div>
          <h2 class="name-style">${name}</h2>
        </a>
        <p class="city-style">${city}, ${country}</p>
        <p class="tagline-style">${tagline}</p>
        <p class="price-style">${price}€ /jour</p>
      </article>
    `;
  }

  return { name, picture, getUserCardDOM };
}
