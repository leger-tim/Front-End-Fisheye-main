function displayModal(name) {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "flex"; // Affichez la modale en définissant display sur flex
  const nameOfPhotographer = document.querySelector("#contactMe");
  nameOfPhotographer.textContent = `Contactez-moi ${name}`;
// Ajoute le focus à l'input prenom 
  document.getElementById("prenom").focus();

}


function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none"; // Cachez la modale en définissant display sur none
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal(); // Utilisez la fonction closeModal existante pour fermer la modale
  }
});

let close = document.querySelector("#closeModale");
close.addEventListener('click', function() {
  closeModal();
});

let form = document.querySelector(".contact_button");

form.addEventListener('click', function(event) {
  consoleData(event);
});

function consoleData(event) {
  event.preventDefault();
  let dataPrenom = document.querySelector("#prenom");
  let dataNom = document.querySelector("#nom");
  let dataEmail = document.querySelector("#email");
  let dataMessage = document.querySelector("#message");

  console.log(dataPrenom.value, dataNom.value, dataEmail.value, dataMessage.value);
}
