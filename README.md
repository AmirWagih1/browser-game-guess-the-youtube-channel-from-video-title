# Browser Game : Guess the youtube channel from video title

##  Quick summary
it's a little project I worked on using **Youtube API V3**. Just try to guess the youtuber/youtube channel based on their video title
## Programming Languages and Frameworks/Libraries used 
- HTML
- CSS
- JS
- Jquery
- Bootstrap 4

## DOC
| Variable | Description |
| ----------- | ----------- |
| **api_key** | Youtube API V3 key used in the game, You may consider using your own API key for any reason |
| **max_results**  | Max results fetched per page |
| **region** |   Region to fetch videos from, Accepts a  [ISO 3166-1 alpha-2 ](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements)    country code  |
| **cats_allowed** | Array of Video Categories to fetch videos from,  You may wanna use [VideoCategories: list ](https://developers.google.com/youtube/v3/docs/videoCategories/list) for the list of categories available in your country | 
|  **same_cats** | If `true` Options to choose answer from are fetched only from the same category as the correct answer   |

If you are using the **console**, use `main().catch((err) => endErr(err))` for any changes in the mentioned variables to **take effect**, Otherwise just refresh the page
## Internal Features
- The game automatically detects your **region** Using **ipinfo.io** API **if no `region` value was provided** (To disable this feature, just provide a value to `region` variable)
- The game automatically hides the youtube channel name if found in **video title**
## How to use
Just open `index.html`
