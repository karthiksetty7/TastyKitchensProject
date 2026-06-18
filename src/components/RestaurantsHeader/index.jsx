import {BsFilterLeft} from 'react-icons/bs'
import './index.css'

const sortByOptions = [
  {id: 0, displayText: 'Highest', value: 'Highest'},
  {id: 1, displayText: 'Lowest', value: 'Lowest'},
]

const RestaurantsHeader = props => {
  const {
    activeOptionId,
    onChangeSortBy,
    searchInput,
    onChangeSearchInput,
    suggestions,
    onSelectSuggestion,
  } = props

  const onChangeOption = event => {
    onChangeSortBy(event.target.value)
  }

  const onChangeSearch = event => {
    onChangeSearchInput(event.target.value)
  }

  return (
    <div className="restaurants-header-container">
      <div className="heading-description-block">
        <h1 className="popular-restaurants-heading">Popular Restaurants</h1>
        <p className="popular-restaurants-description">
          Select Your favourite restaurant special dish and make your day
          happy...
        </p>
      </div>

      <div className="sort-container">
        {/* Search Wrapper for Absolute Dropdown Positioning */}
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Search Restaurant"
            className="search-input"
            value={searchInput}
            onChange={onChangeSearch}
          />

          {/* Dynamic Suggestion List */}
          {searchInput.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.length > 0 ? (
                suggestions.map(each => (
                  <li
                    key={each.id}
                    className="suggestion-item"
                    onClick={() => onSelectSuggestion(each.name)}
                  >
                    <div className="suggestion-info">
                      <span className="suggestion-name">{each.name}</span>
                      <span className="suggestion-meta">
                        ⭐ {each.rating} • {each.cuisine}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-suggestion">No restaurants found</li>
              )}
            </ul>
          )}
        </div>

        <BsFilterLeft className="filter-icon" />
        <p className="sort-text">Sort By</p>
        <select
          className="sort-select"
          value={activeOptionId}
          onChange={onChangeOption}
          data-testid="sort-by-select"
        >
          {sortByOptions.map(eachOption => (
            <option key={eachOption.id} value={eachOption.value}>
              {eachOption.displayText}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default RestaurantsHeader
