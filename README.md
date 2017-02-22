# AltspaceVR Programming Project - Spaces Admin Web Frontend

View the project at https://fahdoo.github.io/altspacevr-project-html-ui/index.html

## Features
- Create and edit Spaces
- Toggle between a card and table view
- Multi-select (only for deletes, but easily extendable)
- Adding tags to spaces
- Filtering (matches title, description, tags, or creator)
- Spaces and Users are cached after fetching from data source

## Known Issues
- Filtering won't be efficient on large datasets as there's no indexing/pre-computed results
- If you select a space and then filter, that space is still selected
- Member links don't go anywhere, but intention is that there would be a similar User Admin page where you could edit details for that user.
