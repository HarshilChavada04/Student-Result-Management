/**
 * Filters and sorts routes by meta properties
 * @param {Array} routes - array of route objects
 * @param {Object} options - filter/sort config
 * @param {boolean} options.show_in_menu - filter by show_in_menu (default: true)
 * @param {number} options.is_active - filter by is_active (default: 1)
 * @param {boolean} options.sort - whether to sort by seq_no (default: true)
 * @returns {Array} filtered and sorted routes
 */
export function getFilteredRoutes(routes, options = {}) {
    const {
      show_in_menu = true,
      is_active = 1,
      sort = true,
    } = options
  
    let filtered = routes.filter(item => {
      const meta = item.meta || {}
      return (show_in_menu ? meta.show_in_menu : true) &&
             (meta.is_active === is_active)
    })
  
    if (sort) {
      filtered = filtered.sort((a, b) =>
        (a.meta?.seq_no || 0) - (b.meta?.seq_no || 0)
      )
    }
  
    return filtered
  }
  