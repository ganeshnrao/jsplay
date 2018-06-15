const express = require(`express`)

express()
  .use(express.static(`static`))
  .listen(3300, () => console.log(`App started`))