import { remove } from 'fs-extra'
import browsersync from 'browser-sync'
import normalizeConfig from './bin.normalize.js'

export default (ahub, src, dest, { configPath, isWatch, verbose }) =>
  normalizeConfig(src, dest, configPath, isWatch, false)
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
      .then(watcher =>
        browsersync.create().init({
          server: dest,
          watch: true
        })
      )
    )
  )