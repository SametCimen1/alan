import React from 'react'
import style from './bigLocation.module.css'
import {useEffect, useState} from 'react'
import { current } from '@reduxjs/toolkit';
const electron = window.require('electron');
const ipc = electron.ipcRenderer;

export default function BigLocation({location, onHomeClick}) {
    const [comments, setComments] = useState(location.reviews)
    const amnetiaFonts = ['fa-solid fa-person-swimming',"fa-solid fa-wifi","fa-solid fa-bath", "fa-solid fa-square-parking","fa-solid fa-sink", "fa-solid fa-smoking","fas fa-box", "fas fa-door-open", "fas fa-smoking-ban"];
    const amnetiaTexts = ["Pool","Free WiFi","Bathtub","Free parking", "Kitchen", "Smoking areas", "Offers Takeout Food", "Connecting rooms available", "Non-smoking"];
    const [curretnWeather, setCurrentLocation] = useState("");
    const [stars, setStars] = useState([]);
    const [openAddComment, setOpenAddComment] = useState(false)
    const [myComment, setMyComment] = useState("")
    const [name, setName] = useState("");
    const [star,setStar] = useState("1 Star");

    const updateMe = () => {
        ipc.send("getNewMe", {
            content:location.name
        })
    }

    const increaseVisitedTime = async() => {
        ipc.send("increaseVisitedTime",{
            content:location.address
        })
    }
    useEffect(() => {
        increaseVisitedTime()
    },[])
    useEffect(() => {
        const starCount = location.stars;
        const numberStarCount = Math.floor(starCount)
        const newArr = []
        for(let i =0; i<numberStarCount; i++){
            newArr.push(0)
        }
        setStars(newArr)
    }, [location])

    const kelvinToCel = (kelvin) => {
        return Math.floor((kelvin - 273.15) * 9/5 + 32);
    } 
    const getCurrentWeather = async() => {
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lot}&appid=f085ef6c84085777b03dc4255e499742`)
        const result = await data.json();
        console.log(result)
        setCurrentLocation(result)
    
    }
    useEffect(() => {
        getCurrentWeather()
    }, [])
    

    const addReview = () => {
        if(myComment === "" || star === "" || name === ""){
            alert("please enter all of the fields. They can't be empty")
        }
        else{
        
            const myStar = parseInt(star[0])
            console.log("sending")
            console.log(myComment, myStar, name)
            ipc.send("addReview", {
                content:{
                    locationName:location.name,
                    comment:myComment,
                    star:myStar,
                    name:name
                }
            });
            updateMe();
        }
    }
    ipc.on("updateMySelf",(event,arg) => {
        setComments(arg.reviews)
    })
    useEffect((elem) => {
        location =  elem;
    },[]) 

    const getIconIndex = (name) => {
        let myIndex = -1;
        for(let i =0; i<amnetiaTexts.length; i++){
            if(amnetiaTexts[i].toLocaleLowerCase().includes(name.toLocaleLowerCase())){
                myIndex = i;
            }
            else{

            }
        }
      return myIndex;
    }



    const getWeatherIcon = () => {
        if(curretnWeather.weather[0].description === "clear sky"){
            return "fas fa-sun text-yellow-500"
        }
    }

    return (
    <section>
        <section className = {style.imageContaier}>
            <div>
                <section className = "headerText">
                        <h1 style = {{cursor:"pointer"}} onClick = {() => onHomeClick()}>Alan</h1>
                        <p>Find your next place to visit!</p>
                </section>

                <section className = {style.enterence}>
                    <a href = "/"><i class="fa-solid fa-arrow-left text-sky-500 text-3xl"></i></a>
                    <div className = {style.name}>
                        <h1>{location.name}</h1>
                    </div>  
                    <div className = {style.stars}>
                      
                        {stars.map(() => {
                            return(
                                <i class="fas fa-star"></i>
                            )
                        })}
                        <p>{location.stars}/5</p>
                    </div>
                </section>
            </div>
        </section>

        <section className = {style.informations}>
            <section className = {style.firstBox}>

                <div className = {style.infoBox}>
                     <i class="fas fa-map-marker"></i>
                     <p>{location.address}</p>
                </div>
                <div className = {style.infoBox}>
                     <i class="fas fa-phone"></i>
                     <p>{location.phoneNumber}</p>
                </div>
                <div className = {style.infoBox}>
                     <i class="fas fa-link"></i>

                    <a href = {location.website} target="_blank" >{location.website}</a>
                    
                </div> 
            </section> 
            
            <section className = {style.map}>
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3083.2905992498663!2d-74.63093468432933!3d39.39493112506753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c0c2500936900f%3A0x28150b725117bac2!2s24%20High%20School%20Dr%2C%20Egg%20Harbor%20Township%2C%20NJ%2008234%2C%20USA!5e0!3m2!1sen!2sae!4v1644800143629!5m2!1sen!2sae"  style={{border:0}} ></iframe>
            </section>
        </section>

        <section className = {style.line}>
             <span className = {style.lineSpan}></span>
        </section>

        <section className = {style.amnetias}>
            <h1 className = {style.header}>Amenities</h1>
            <section className = {style.amnetiasContainer}>
                {typeof location.amenities !== "undefined" && location.amenities.length > 0 ?
                 <div className = {style.amnetiaDivContainer}>
                     {location.amenities.map((amnetia) => {
                         let currentFont =""
                         const index = getIconIndex(amnetia)
                         currentFont = amnetiaFonts[index]
        
                         return (
                            <div className = {style.amnetia}>
                                {index === -1
                                ? <i class=""></i> : 
                                <i class = {amnetiaFonts[index]}></i>
                                }
                                <span>{amnetia}</span>
                            </div>
                         )
                     })}
                 </div>
                 :
                 <span>Sorry, this location does not have any amenities</span>
                }
                
                {/* <div className = {style.amnetia}>
                    <i class="fa-solid fa-bicycle"></i>
                    <span>Bicycle Parking</span>
                </div>
                <div className = {style.amnetia}>
                    <i class="fa-solid fa-bread-slice"></i>
                    <span>Food</span>
                </div> */}
            </section>
        </section>
        {typeof location.highlights !== 'undefined' &&
        <section className = {style.amnetias}>
            <h1 className = {style.header}>Highlights</h1>
            <section className = {style.amnetiasContainer}>
                        {location.highlights.map((elem)=>{
                            return(
                                <div className = {style.highlight}>
                                    <i class="fa-solid fa-check"></i>
                                    <span>{elem}</span>
                                </div>  
                            ) 
                        })}
                

            </section>
        </section>
        
        }

        <section className = {style.line}>
             <span className = {style.lineSpan}></span>
        </section>
    

        <section className = {style.about}>
            <h1 className = {style.header}>About</h1>
            <div className = {style.aboutText}>
                <p>{location.description}</p>
            </div>
        </section>


        <section className = {style.line}>
             <span className = {style.lineSpan}></span>
        </section>

        <section className = {style.pricingContainer}>
            <h1 className = {style.header}>Pricing</h1>
            <section className = {style.pricing}>
                <div className = {style.aboutText}>
                    <p className = {style.priceText}>Lowest price avaible</p>
                    <span className = "text-green-600">${location.price}</span>
                </div>
            </section>
        </section>

        {curretnWeather !== "" && 
            
            <section className = {style.pricingContainer}>
                {console.log(curretnWeather)}
            <h1 className = {style.header}>Current Weather In {curretnWeather.name}</h1>
            <section className = {style.pricing}>
                <div className = {style.weatherContainer}>
                <div className = {style.weatherIcon}>
                    <i class= {getWeatherIcon()}></i> 
                </div>
                <div className = {style.condition}>
                    <p className = {style.weatherHeader}>Weather</p>
                    <p className = {style.weatherCondition}>{curretnWeather.weather[0].description}</p>
                </div>
                <div>
                    <p className = {style.weatherHeader}>Wind</p>
                    <p className = {style.weatherCondition}>{curretnWeather.wind.speed} mph</p>
                </div>
                <div>
                    <p className = {style.weatherHeader}>Feels like</p>
                    <p className = {style.weatherCondition}>{kelvinToCel(curretnWeather.main.feels_like)} F</p>
                </div>
                </div>
            </section>
        </section>
        }
        


        <section className = {style.line}>
             <span className = {style.lineSpan}></span>
        </section>


       <section className = {style.reviews}>
            <div className = {style.reviewIntro}>           
                <h1 className = {style.header}>Reviews</h1>
                <button onClick = {() => setOpenAddComment((prev) => !prev)} >Add Yours</button>
            </div>

            {openAddComment &&
            <div className = "flex justify-content flex-col">
                <div class=" m-auto relative w-2/4">
                    <select  onChange = {(e) => setStar(e.target.value)} value = {star} class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="1 Star">1 Star</option>
                        <option value="2 Star">2 Star</option>
                        <option value="3 Star">3 Star</option>
                        <option value="4 Star">4 Star</option>
                        <option value="5 Star">5 Star</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                <div className = "w-2/4 flex justify-center m-auto mt-4">
                    <input value = {name} onChange = {(e) => setName(e.target.value)} placeholder='Your Name' type = "text" className = {`${"bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mr-1"} ${style.questionInput}`}></input>
                </div>
                <div className = "w-2/4 flex justify-center m-auto mt-4">
                    <input value = {myComment} onChange = {(e) => setMyComment(e.target.value)} placeholder='Review' type = "text" className = {`${"bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mr-1"} ${style.questionInput}`}></input>
                </div>
                
                <div className = "w-full flex justify-content">
                    <button onClick = {() => addReview()} className =" w-2/4 mt-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mx-auto">Add Your Review!</button>
                </div>
            </div>
            
            }

            <div className = {style.reviewContainer}>
                {comments.length > 0 && comments.map((review) => {
                    return(
                        <div className = {style.review}>
                        <div className = {style.headerAndStars}>
                            {review.name !== "" && <span>{review.name}</span>}
                            <span>{review.star} /5 </span>
                        </div>
                        <p className = {style.reviewText}>{review.content}</p>
                    </div>
                    )
                })}

                {comments.length === 0 &&
                   <h1>Sorry, no review is avaible right now!</h1>
                }
               
            </div>
       </section>


       <div class = "w-4/5 m-auto bg-primary">
                        <h2 className = "text-orange-600">Note: data is not real</h2>
        </div>

    </section>
    
  )
}
