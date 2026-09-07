import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"

registerCondition("skills-map", (props) => {
  const tags = props.fileData.frontmatter?.tags
  return Array.isArray(tags) && tags.includes("skills-map")
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
