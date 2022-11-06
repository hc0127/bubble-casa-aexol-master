const resultPerPage = 10
var lang = localStorage.getItem('setLang') || 'en'

export const searchQuery = (search, categories, searchIn, nodeId, nodeChildren, page) => {

    const comma = () => {
        return nodeChildren.length > 0 ? ',' : ''
    }

    if(searchIn === 'node' && nodeId != 1 && nodeId != -1) {
        if(categories.length > 0) {
            // szukaj w danym node z kategoriami
            return {q: search, filter: `node_id IN (${nodeId + comma() + nodeChildren})`, categories: categories, page: page, resultsPerPage: resultPerPage}
        }
        else {
            // szukaj w danym node bez kategorii
            return {q: search, filter: `node_id IN (${nodeId + comma() + nodeChildren}) AND language="${lang}"`, page: page, resultsPerPage: resultPerPage}
        }
    } else {
        if(categories.length > 0) {
            // szukaj w całej stronie z kategoriami
            return {q: search, filter: `language="${lang}"`, categories: categories, page: page, resultsPerPage: resultPerPage}
        } else {
            // szukaj w całej stronie bez kategori
            return {q: search, filter: `language="${lang}"`, page: page, resultsPerPage: resultPerPage}
        }
    }
}

export const changeSearchLang = (set) => {
    lang = set
}