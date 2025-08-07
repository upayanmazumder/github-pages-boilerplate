function loadHTML(selector, file) {
  fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);
      return response.text();
    })
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("#header", "/components/header.html");
  loadHTML("#footer", "/components/footer.html");
});
