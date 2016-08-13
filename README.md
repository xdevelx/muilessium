# Muilessium
*Coming Soon...*

Muilessium is the **M**inimalistic **UI** framework written mostly in **LESS**. The main idea of development of this project is to create a collection of lightweight and reusable components with ability to easily customize all of them. It means that You can take Muilessium, change some constants in configuration files (see below) and get a great base for your project - like a Lego construction set, but instead of plastic bricks you'll have RSCSS components for UI on your website. Current time it has global settings listed below (Readme is updated to version 0.0.35 and can fall behind development for now. See *src/less/constants.less* for actual information):

 - Border radius
 - Border width
 - Default UI height
 - Width limit (50em for better reading for example)
 - Hover animation function
 - Hover animation duration

UI elements realized as independent RSCSS components. This is the list of realized elements for now (*src/less/components*):

 - Row & Column (simple grid system)
 - Content container
 - Page header
   - Header logo
   - Header navigation
 - Post
   - Post header
   - Post content
     - Paragraph
     - Marker
     - Media view
     - Blockquote
     - Info bubble
     - Carousel\*
   - Post footer
     - Tag & Tags list
     - Comment & Comments list
     - New comment form
 - Text input (+ variations)
 - Checkbox input
 - Radio input
 - Range input\*
 - Textarea
 - Button (+ variations)
   - Badge for button
 - Pagination (+ variations)
 - Progress bar
 - Rating
 - Spinner

For today it has some bugs in IE and Edge browsers, but they will be fixed in the near future. The release date is inaccurate and I think this project will be released when it will be completed, not to a specific date.

https://sfi0zy.github.io/muilessium/