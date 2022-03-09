# ALAN | 2022 FBLA Coding & Programming
## ALAN Readme File

### Installation & Set Up:
- Go to https://drive.google.com/file/d/1hphWlR2qUVRVURLKY5feTfLMCxnYFhFG/view and click on the download button.

- Once the file is installed, open the file and drag the folder to your desktop (Do not open the .exe file when the file is in a .zip folder).

- Open the folder and open the file called alan.exe

### Documetation:
#### Attraction search
- You can search attractions based on their location, their type (restaurants, shopping etc), their price, family friendly, and finally whether if it is inside or outside.To search for an attraction, select the mode and search the it based on the mode.

- To search for an attraction, select the mode (described in the above paragraph) and search it.

- To search with Location mode: Type the name of the location you want. For Example: Egg Harbor Township. Even if you don't write the full name, it would return all of the attractions that's address includes the input you have given. Example: Egg Harbor and Egg Harbor Township returns the same values

- To search with Type of attraction: Type the name of the attraction you want. Full list can be found in the Alan's home page (click on the categories button)

- To search with Price: You can select free option, which would return all of the free options. If you decide to use Maximum and Minimum range you will have to fill at least one of them. You can leave one of them empty and fill the other if you desire.

- To search with family friendly: You would need to select the option and click on the check button. After you check it, the program will return all of the results that are family friendly 

- To search with Outside/Inside: You need to check which one you would like to visit. However, it is possible to choose both of them. If you decide to choose both of them, the program will return all of the attractions.

#### Filter Options
- There are 3 options that you can use to filter the returned values. Number of stars, Outdoor/Indoor and price range.
- Number of stars: You can choose the number of stars you want in an attraction. In addition to that, you can choose more than 1 star. For example if you choose 2 and 3 stars it will return all of the attractions that has either 2 or 3 stars. If you choose none of them, it will return all of the values

- Indoor/Outdoor: If you want to get only locations that are outdoor, check outdoor button. If you only want to get the indoor locations, check the indoor button. However, you can left this are empty which would return all of the locations.

- Price: Enter the range of the price you desire. You don't have to fill this option if you don't want to. However, you can also choose to fill one of them. For example you can leave minimum empty and fill maxiumum or vice versa.




### Libaries Used

| Library Name    | Purpose                                                                                                                  | Website                                      |
|-----------------|--------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| Electron        | Converting HTML web pages into desktop applications                                                                  | https://www.electronjs.org/                  |
| React           | Used to write the front-end (user-interface) of the application.                                                         | https://reactjs.org/                         |
| Redux           | Storing the locations the program found across all of the pages.                                                                     | https://redux.js.org/                        |
| electron-is-dev | Checks whether or not the application is in development mode.                                                            | https://www.npmjs.com/packageelectron-is-dev |
| Weather API     | When you click on a location, the program sends a request to this API and gets the current weather in that location. | https://openweathermap.org/api               |
| fs              | Used to read and write into locations.json file, which contains the location database.                                   | https://nodejs.org/api/fs.html               |


### Source
| Name         | Purpose                                                                      | Website                              |
|--------------|------------------------------------------------------------------------------|--------------------------------------|
| Unsplash     | Source of all of the images in the program. License: Creative Commons license         | https://unsplash.com/license        |
| Font Awesome | Source of all of the icons in the program.  License: Creative Commons license          | https://fontawesome.com/license/free   |
| Undraw       | Illisturations in the program (The blue images in the main screen.) Liscense: Creative Commons license    | https://undraw.co/license            |


