/* global define */
define(require => {
  const cellTypes = {
    open: {
      value: 0,
      className: 'cell open'
    },
    brick: {
      value: 1,
      className: 'cell brick'
    },
    gem: {
      value: 2,
      className: 'cell open gem'
    }
  }
  return {
    cellTypes: cellTypes,
    className: Object.keys(cellTypes).reduce((acc, typeName) => {
      const typeDef = cellTypes[typeName]
      acc[typeDef.value] = typeDef.className
      return acc
    }, [])
  }
})
