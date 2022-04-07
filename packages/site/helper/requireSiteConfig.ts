import { SiteConfig } from "../site.config"

export default function requireSiteConfig() {
  delete require.cache[require.resolve('../site.config')]
  const { default: siteConfig } = require('../site.config') as { default: SiteConfig }

  return siteConfig
}