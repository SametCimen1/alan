const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
var fs = require('fs');
const locations = require("../locations.json")
const faq = require("../faq.json")
const unanswered = require("../newfaq.json")



function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if(process.platform !== "darwin"){
  
      app.quit()
  } 
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



ipcMain.on("topFiveNewWindow", async(event, message) => {
  const sorted = [];
  for(let i = 0 ; i<locations.length; i++){
    let biggest = locations[i];
    let index = i;
    for(let x = i+1; x<locations.length; x++){
      if(biggest.totalClicked < locations[x].totalClicked){
        biggest = locations[x];
        index = x;
      }
    }

    const temp = biggest;
    locations[index] = locations[i];
    locations[i] = temp; 

  }

  const current = [locations[0], locations[1], locations[2],locations[3],locations[4]];
  event.reply("reply", current)
})


ipcMain.on("getLocationsByType", async(event, message) => {
    //empty array to contain the locations we wil find later.
    console.log("REQUEST TO LOCATIONS BY TYPE")
    console.log(message)
    const found = [];

    //if user wanted a random location. Send them a random location from the database.
    if(message.content === "Random"){
      const location = locations[Math.floor(Math.random() * locations.length)] // make a random index and get random location.
      found.push(location)
      event.reply("sendSearch", found); //send the data to user.
    }
    else{
      //goes through all of the location database and it's tag array.
      for(let i = 0; i<locations.length; i++){
        for(let x = 0; x<locations[i].tags.length; x++){
          if(locations[i].tags[x].toLowerCase().includes(message.content.toLowerCase())){
            //if any tag of the location mathces with the input user wanted, add that to the found array.
            found.push(locations[i])
          }
        }
      }
      event.reply("sendSearch", found) // send the data to user.
    }

})

ipcMain.on("addReview", async(event,message) => {
  //message is an object that contains the new review and the name of the locotion.
  let foundLocation = {}; //object, made to store the location that we will add review to.
  let foundLocationIndex = -1; //the index of the element, we will add the review.
  for(let i =0; i<locations.length; i++){ 
    //goes through all of the locations and finds the location that has the same name with the given location name.
      if(locations[i].name === message.content.locationName){
        foundLocation = locations[i]; //once that is found, save the location to foundLocation.
        foundLocationIndex = i;//save the current index to the variable  foundLocationIndexis.
      }
  }
  if(foundLocation === {} || foundLocationIndex === -1){ 
    //if the location can not be found, send error to the user.
    console.log("error")
    event.reply("reviewError", "error while adding review. Please try again later")
  }
  else{
    //save the old reviews array in the oldReviews variable.
    const oldReviews = locations[foundLocationIndex].reviews;

    //create a new review object
    const newReview = {
        "name":message.content.name,
        "star":message.content.star,
        "content":message.content.comment
    }
    oldReviews.push(newReview);
    //push the new review object  to the oldreviews
    //update the database
    fs.writeFileSync("locations.json",JSON.stringify(locations),"utf-8");
  }  
})

ipcMain.on("getLocationsByLocation", async(event, message) => {
  //empty array to contain the locations we will find later.
  const found = [];

  //locations is the database of locations. Goes through all of the
  //database and finds the locations that has the given input 
  //in their address.
  for(let i = 0; i<locations.length; i++){
    if(locations[i].address.toLowerCase().includes(message.content.toLowerCase())){
      found.push(locations[i]) //when a location is found, add this location
      //to the found array we have created before.
    }
  }
  event.reply("sendSearch", found)//send the found locations to the user.
})


ipcMain.on("getInitialQuestions", async(event,message) => {

  const myArr = [];
  for(let i = faq.length-1; i >= 0; i--){
      myArr.push(faq[i])
  }
  event.reply("getInitialFAQ", myArr)
})

ipcMain.on("increaseVisitedTime", async(event,message) => {
  let found = {};
  const everythingElse = [];
  for(let i =0; i<locations.length; i++){
    if(message.content.toLowerCase() === locations[i].address.toLowerCase()){
      found = locations[i];
    }
    else{
      everythingElse.push(locations[i])
    }
  }
  found.totalClicked = found.totalClicked + 1;
  everythingElse.push(found);
  fs.writeFileSync("locations.json",JSON.stringify(everythingElse),"utf-8");
})

ipcMain.on("getFreeLocations", async(event,message) => {
  const found = [];
  for(let i = 0; i< locations.length; i++){
    if(locations[i].price === 0){
      found.push(locations[i])
    }
  }
  event.reply("sendSearch", found)
})
ipcMain.on("getPricedLocations", async(event,message) => {

  if(isNaN(message.content.maxPrice)){
    message.content.maxPrice = 0;
  }
  if(isNaN(message.content.minPrice)){
    message.content.minPrice = 0;
  }
  if((message.content.minPrice === 0 || message.minPrice === '') && message.content.maxPrice !== 0){ //minPrice deoenst exist
    const found = [];
    for(let i =0; i<locations.length; i++){
      if(locations[i].price < message.content.maxPrice){
        found.push(locations[i])
      }
    }
    event.reply("sendSearch", found)
  }
  else if(message.content.minPrice !== 0 && (message.content.maxPrice === 0 || message.content.maxPrice === "")){ //minPrice  exist
    const found = [];
    for(let i =0; i<locations.length; i++){
      if(locations[i].price > message.content.minPrice){
        found.push(locations[i])
      }
    }
    event.reply("sendSearch", found)
  }
  else if(message.content.minPrice !== 0 && message.content.minPrice !== 0){ //both  exist
    const found = [];
    for(let i =0; i<locations.length; i++){
      if(locations[i].price > message.content.minPrice && locations[i].price < message.content.maxPrice ){
        found.push(locations[i])
      }
    }
    event.reply("sendSearch", found)
  }
})
ipcMain.on("getLocationByNumberOfPeople", async(event,message) => {
  let myResults = [];
  if(message.content.isFamilyFriendly){
    for(let i =0; i<locations.length; i++){
      let amIFriendly = false;
      for(let x= 0;x<locations[i].tags.length; x++){
        if(locations[i].tags[x] === "Family"){
          amIFriendly = true;
        }
      }
      if(amIFriendly){
        myResults.push(locations[i])
      }
    }
  }
  event.reply("sendSearch", myResults)
})
ipcMain.on("getInsideOutsideLocations", async(event,message) => {
  if(message.content.outside && !message.content.inside){ //only outside
    const sorted = [];
    for(let i =0; i<locations.length; i++){
      if(locations[i].isOutside){
        sorted.push(locations[i])
      }
    }
    event.reply("sendSearch", sorted)
  }
  else if(message.content.inside && !message.content.outside){
      const sorted = [];
      for(let i =0; i<locations.length; i++){
        if(!locations[i].isOutSide){
          sorted.push(locations[i])
        }
      }
      event.reply("sendSearch", sorted)
    }

  else if(message.content.inside && message.content.outside){
      const sorted = [];
      for(let i =0; i<locations.length; i++){
          sorted.push(locations[i])
        
      }
      event.reply("sendSearch", sorted)
    }
    
  
})

// ipcMain.on("getCurrentWeather", async(event,message) => {
//   console.log(message)
//   const data = await fetch(`api.openweathermap.org/data/2.5/weather?lat=${message.lat}&lon=${message.lot}&appid=${process.env.OPENWEATHERKEY}`)
//   const result = await data.json();
//   console.log(result)
// })

ipcMain.on("getLocationByCategory", async(event,message) => {
    const found = [];
    if(message.content === "Random"){
      const location = locations[Math.floor(Math.random() * locations.length)]
      found.push(location)
      event.reply("sendSearch", found);
    }
    else{
      for(let i = 0; i<locations.length; i++){
        for(let x = 0; x<locations[i].tags.length; x++){
          if(locations[i].tags[x].toLowerCase().includes(message.content.toLowerCase())){
            found.push(locations[i])
          }
        }
      }
      event.reply("sendSearch", found)
    }
})

ipcMain.on("getNewMe", async(event,message) => {
  let foundElem = {};
  for(let i = 0; i<locations.length; i++){
    if(locations[i].name === message.content){
      foundElem = locations[i]
    }
  }
  event.reply("updateMySelf", foundElem)
})
ipcMain.on("addNewFAQ", async(event,message) => {
  const old = unanswered;
  old.push({"question":message.content});
  fs.writeFileSync("newfaq.json",JSON.stringify(old),"utf-8");
})
ipcMain.on("getinitilalnewFAQ", async(event,message) => {
  const old = unanswered;
  event.reply("returnedinitialnewFAQ", old)
})