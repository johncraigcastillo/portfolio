document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.createElement("div")
  lightbox.className = "image-lightbox"

  const enlarged = document.createElement("img")
  lightbox.appendChild(enlarged)
  document.body.appendChild(lightbox)

  document.querySelectorAll("article img").forEach((img) => {
    img.addEventListener("click", () => {
      enlarged.src = img.src
      enlarged.alt = img.alt || ""
      lightbox.classList.add("open")
    })
  })

  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("open")
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      lightbox.classList.remove("open")
    }
  })
})
