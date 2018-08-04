import { remove } from 'fs-extra'
import normalizeConfig from './bin.normalize.js'

export default (ahub, src, dest, { configPath, isPro, verbose }) =>
  normalizeConfig(src, dest, configPath, false, isPro)
  .then(({ src, dest, lang, sitemap, head, watch, favicons, ignored }) =>
    remove(dest).then(() =>
      ahub(src, dest, {
        lang,
        sitemap,
        head,
        watch,
        favicons,
        ignored,
        verbose
      })
    )
  )