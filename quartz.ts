import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import type { QuartzTransformerPlugin } from "./quartz/plugins/types"

registerCondition("skills-map", (props) => {
  const tags = props.fileData.frontmatter?.tags
  return Array.isArray(tags) && tags.includes("skills-map")
})

const ImageLightboxResources: QuartzTransformerPlugin = () => ({
  name: "ImageLightboxResources",

  externalResources() {
    return {
      js: [
        {
          loadTime: "afterDOMReady",
          contentType: "inline",
          spaPreserve: true,
          script: `
            document.addEventListener("click", (event) => {
              const target = event.target

              if (target instanceof HTMLImageElement && target.closest("article")) {
                let lightbox = document.querySelector(".image-lightbox")

                if (!lightbox) {
                  lightbox = document.createElement("div")
                  lightbox.className = "image-lightbox"

                  const enlarged = document.createElement("img")
                  lightbox.appendChild(enlarged)

                  document.body.appendChild(lightbox)
                }

                const enlarged = lightbox.querySelector("img")
                enlarged.src = target.src
                enlarged.alt = target.alt || ""

                lightbox.classList.add("open")
                return
              }

              if (target instanceof Element) {
                const lightbox = target.closest(".image-lightbox")

                if (lightbox) {
                  lightbox.classList.remove("open")
                }
              }
            })

            document.addEventListener("keydown", (event) => {
              if (event.key === "Escape") {
                document.querySelector(".image-lightbox")?.classList.remove("open")
              }
            })
          `,
        },
      ],
    }
  },
})

const config = await loadQuartzConfig()

config.plugins.transformers.push(ImageLightboxResources())

export default config
export const layout = await loadQuartzLayout()
