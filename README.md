# Game of Thrones Characters Search

This project provides an auto-complete search component to search for characters from the Game of Thrones series of novels using the An API of Ice and Fire. The search functionality allows users to search by name or aliases and displays additional details when a character is selected.

## Features

- Auto-complete search with debounced input (500ms delay).
- Fetches character data from the An API of Ice and Fire.
- Caches search results to reduce API requests.
- Displays character details including name, gender, birth date, parents, spouse, aliases, and books.
- Fetches and displays names of parents and books from their respective URLs.

## Technologies Used

- React
- Axios
- Tailwind CSS

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/got-characters-search.git
   cd got-characters-search
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Component Overview

### `page.tsx` (under `src/app/character-search/`)

This file contains the main component of the project, implementing the auto-complete search functionality. It includes:

- **State Management**: Manages query, results, and selected character states.
- **Debounced Search**: Uses a custom `useDebounce` hook to delay API requests by 500ms.
- **Cache**: Caches search results to avoid redundant API calls.
- **API Calls**: Fetches characters, parent names, and book names from the API.
- **Conditional Rendering**: Displays character details only if available and replaces empty values with "Unknown".

### `useDebounce.js` (under `src/app/utils/`)

A custom hook that debounces the input value, delaying the search request by the specified delay (500ms).

## Styling

The component uses Tailwind CSS for styling. Basic styles are applied to the input field, search results, and character details.

## Usage

1. **Search for Characters**:

   - Start typing in the search input to search for characters by name or aliases.
   - The search results will be displayed in a dropdown list.

2. **Select a Character**:
   - Click on a character from the dropdown list to view their details.
   - Details displayed include name, gender, birth date, parents, spouse, aliases, and books.
   - If parents or books are URLs, the component fetches and displays their names.

## Example

Here is a sample usage of the `AutoComplete` component:

```tsx
import React from "react";
import AutoComplete from "./character-search/page";

const App = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Game of Thrones Characters Search
      </h1>
      <AutoComplete />
    </div>
  );
};

export default App;
```

## Future Improvements

- Implement pagination for search results.
- Add loading indicators while fetching data.
- Improve error handling and display user-friendly error messages.
- Enhance the UI with more detailed character information and images.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- An API of Ice and Fire for providing the data. ([API of Ice and Fire](https://anapioficeandfire.com/))
