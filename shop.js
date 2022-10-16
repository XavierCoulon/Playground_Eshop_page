const section = document.querySelector("section");
const modal = document.getElementById("modal");
const adminForm = document.querySelector(".admin-form");
const adminFormBtn = document.getElementById("btn-insert");
const inputSearch = document.getElementById("search");

async function getJSON(jsonFile) {
  const request = new Request(jsonFile);
  const response = await fetch(request);
  const json = await response.json();
  return json;
}

class Sneaker {
  constructor(id, model, brand = "", price, description = "", img) {
    this.id = id;
    this.model = model;
    this.brand = brand;
    this.price = price;
    this.description = description;
    this.img = img;
  }

  //   Method to create all HTML elements for a sneaker instance
  createHtmlElements() {
    const sneakerModel = document.createElement("h3");
    sneakerModel.classList.add("sneaker-model");
    const sneaker = this;
    sneakerModel.addEventListener("click", function (e) {
      e.preventDefault();
      sneaker.createSneakerModal();
    });
    sneakerModel.innerHTML = this.model;

    const sneakerPrice = document.createElement("h4");
    sneakerPrice.classList.add("sneaker-price");
    sneakerPrice.innerHTML = `${this.price}€`;

    const sneakerImg = document.createElement("img");
    sneakerImg.src = this.img;
    sneakerImg.classList.add("sneaker-img");
    sneakerImg.setAttribute("alt", `${sneakerModel.textContent} photo`);
    sneakerImg.addEventListener("click", function (e) {
      e.preventDefault();
      sneaker.createSneakerModal();
    });

    return [sneakerImg, sneakerModel, sneakerPrice];
  }

  //   Method to create and implement sneaker card
  createSneakerCard() {
    const cardSneaker = document.createElement("div");
    cardSneaker.classList.add("card-sneaker");
    cardSneaker.setAttribute("id", this.id);
    this.createHtmlElements().forEach((element) =>
      cardSneaker.appendChild(element)
    );
    section.appendChild(cardSneaker);
  }

  //   Method to create and display sneaker modal
  createSneakerModal() {
    if (modal.innerHTML === "") {
      const img = document.createElement("img");
      img.src = this.img;
      img.setAttribute("class", "sneaker-img");

      const description = document.createElement("p");
      description.innerHTML = `${this.description.substring(0, 400)}...`;

      // const model = document.createElement("h3");
      // model.innerHTML = `<u>Model</u>: ${this.model}`;

      const brand = document.createElement("h3");
      brand.innerHTML = this.brand;

      // const price = document.createElement("h3");
      // price.innerHTML = `<u>Price</u>: ${this.price}`;

      const modalDetails = document.createElement("div");
      modalDetails.classList.add("modal-details");

      modal.style.display = "flex";
      modal.appendChild(img);
      modal.appendChild(modalDetails);
      // modalDetails.appendChild(model);
      modalDetails.appendChild(brand);
      // modalDetails.appendChild(price);
      modalDetails.appendChild(description);
      modal.addEventListener("click", function () {
        modal.style.display = "none";
        modal.innerHTML = "";
      });
    }
  }
}

// Display all sneakers from JSON file
getJSON("data/data.json").then((sneakers) => {
  sneakers.forEach((sneaker) => {
    sneaker = new Sneaker(
      sneaker.id,
      sneaker.model,
      sneaker.brand,
      sneaker.price,
      sneaker.description,
      sneaker.img
    );
    sneaker.createSneakerCard();
  });
});

// Admin part to create a sneaker card 'on the fly'
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    adminForm.classList.toggle("active");
  }
});

adminFormBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const newSneaker = new Sneaker(
    document.querySelectorAll(".card-sneaker").length + 1,
    document.getElementById("model").value,
    document.getElementById("brand").value,
    document.getElementById("price").value,
    document.getElementById("description").value,
    document.getElementById("img").value
  );

  newSneaker.createSneakerCard();
});

// Filter - search part

inputSearch.addEventListener("input", () => {
  const sneakersCards = document.querySelectorAll(".card-sneaker");
  sneakersCards.forEach((element) => element.classList.add("opacity_light"));
  setTimeout(function (e) {
    // e.preventDefault();
    filterSneakers(inputSearch.value);
  }, 500);
});

function filterSneakers(string) {
  const sneakers = document.querySelectorAll(".card-sneaker");

  sneakers.forEach(function (sneaker) {
    if (
      !sneaker
        .querySelector(".sneaker-model")
        .textContent.toLowerCase()
        .includes(string.toLowerCase())
    ) {
      sneaker.style.display = "none";
    } else {
      sneaker.style.display = "flex";
      sneaker.classList.remove("opacity_light");
    }
  });

  if (areAllSneakersHidden()) {
    document.querySelector(".no-result").style.display = "block";
  } else {
    document.querySelector(".no-result").style.display = "none";
  }
}

function areAllSneakersHidden() {
  return (
    section.querySelectorAll("[style*=none]").length ===
    document.querySelectorAll(".card-sneaker").length
  );
}
