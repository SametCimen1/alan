import React from 'react'
import style from './home.module.css'
import { useState, useEffect } from 'react'
import SmallLocation from '../locations/smallLocation';
import BigLocation from '../locations/bigLocation';
import { useSelector, useDispatch } from 'react-redux'
import { initTopFive,init,initFiltered } from '../../redux/counterSlice'
import Filter from './filter/filter'
import Faq from '../footer.js'
import {useRef} from 'react'
const electron = window.require('electron');
const ipc = electron.ipcRenderer;



export default function Home() {

    ///////////
    const count = useSelector(state => state.counter.value);
    const filteredCount = useSelector(state => state.counter.filteredValue);
    const topFive = useSelector(state => state.counter.topFive);
    const dispatch = useDispatch()
    const ref = useRef(null)

    useEffect(() =>{
        console.log("FILTERED AFFECTED")
        console.log(filteredCount)
    }, [filteredCount])
    useEffect(() =>{
        dispatch(initFiltered(["None"]))
    }, [])

    

    ////
    const [categories, setCategories] = useState(false);
    const [locationSearch, setLocationSearch] = useState("")
    const [options, setOptions] = useState(['Hotel','Mall', "Restaurant",'Shopping', "Places to Visit", "Things To Do", "Outside", "Inside", "Library", "Museums", "Random"])
    const [myOptions, setMyOptions] = useState([])
    
    const [search, setSearch] = useState(false);
    const [found, setFound] = useState([]);
    const [sentEmail, setSentEmail] = useState(false);
    const [filterBool, setFilterBool] = useState(false);
    const [sortBool, setSortBool] = useState(false);
    const [currentLocation, setCurrentLocation] = useState("")
    const [selectedOption, setSelectedOption] = useState("Location")
    const [isFamilyFriendly, setIsFamilyFriendly] = useState(false)
    const [currentMode, setCurrentMode] = useState("")
    const [invalidInput, setInvalidInput] = useState(false);
    const [isFreeChecked, setIsFreeChecked] = useState(false);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [isPriceFilterable, setIsPriceFilterable] = useState(false);

    const [outside, setOutside] = useState(false)
    const [inside, setInside] = useState(false)
    const [requestLocation, setRequestLocation] = useState("")


    const [foundAmnetias, setFoundAmnetias] = useState([]);

    const getTopFive = async() => {
        ipc.send("topFiveNewWindow")
        
    }

    useEffect(() => {
        console.log("topFive Changed")
        console.log(topFive)
    }, [topFive])

    useEffect(() => {
        console.log("updated")
        console.log(count)
        if(locationSearch === ""){
            setMyOptions([])
        }
        else{
            const outPuts = options.filter((elem) => elem.toLowerCase().includes(locationSearch.toLowerCase()));
            setMyOptions(outPuts)
        }

    },[locationSearch])

    

    useEffect(() =>{
        setIsPriceFilterable(false)
        console.log(found)
        // for(let i = 0; i<found.length;i++){
        //     if(!isNaN(parseInt(found[i].price))){
        //         setIsPriceFilterable(true);
        //     }
            
        //     if(typeof found[i].amenities !== "undefined"){
        //         //go over each amenetia in an entry
        //         for(let x = 0; x<found[i].amenities.length; x++){
        //                 console.log(found[i].amenities[x])
        //                 setFoundAmnetias(prev => [...prev, found[i].amenities[x]])
        //         }
        //     }
            
            
        // }

        // console.log("BEFORE FOR LOOP")
        // console.log(foundAmnetias)
        // const newArr = [];
        // for(let i = 0; i<foundAmnetias.length; i++){
        //     //offers take out
        
        //     let isFound = false;
        //     for(let x = 0; x<foundAmnetias.length; i++){
        //         if(foundAmnetias[i] === foundAmnetias[x]){
        //             isFound = true;
        //         }
        //     }
        //     if(!isFound){
        //         newArr.push(foundAmnetias[i])
        //     }
        // }
        // setFoundAmnetias(newArr)

        

    },[found])
    useEffect(() => {
        console.log("foundAmnetias")
            console.log(foundAmnetias)
    }, [foundAmnetias])

    ipc.on("reply", (event,arg) => {
        dispatch(initTopFive(arg))
    })

    

    const [newFounds, setNewFounds] = useState([]);
    ipc.on("sendLoadMoreOnClick", (event,arg) => {
        setNewFounds(arg)


    })
    useEffect(() => {
        if(newFounds.length > 0){
            if(newFounds.length === found.length){
                alert("sorry, no more location is avaible")
            }
            else{
                setFound(newFounds)
            }
        }
    },[newFounds])

    useEffect(() => {
        getTopFive()
    },[])



    const searchOnClick = (option) => {
        console.log("Search on click", option)
        if( (option ==="Type" || option === "Location") && (locationSearch ==="" ||locationSearch ===";" || locationSearch ==="." || locationSearch ==="["|| locationSearch ==="]"|| locationSearch ===" "|| locationSearch ==="`"|| locationSearch ==="/" || locationSearch ==="-" )){
            setSearch(false);
            setInvalidInput(true)
        }
        else{
            setInvalidInput(false);
            if(option === "Location"){
                setCurrentMode("Location")
                    ipc.send("getLocationsByLocation", { //fixed
                        content:locationSearch
                })
    
            }
            else if(option === "Type"){
                setCurrentMode("Type")
                ipc.send("getLocationsByType", { //fixed
                    content:locationSearch
                })
            }
            else{
                dispatch(init([]))
                ipc.send("getLocationByCategory", {
                    content:option
                })
            }
            dispatch(initFiltered(["None"]))
            setMyOptions("")
        }

    }

    ipc.on("updateFound", (event,arg) => {
        dispatch(init(arg))
    })
    ipc.on("sendSearch", (event,arg) => {
        dispatch(init(arg))
    })
    useEffect(() => {
        console.log("count updated")
        console.log(count)
    }, [count])


    const sendLocationRequest = () => {
        console.log("SENDING")
        ipc.send("sendLocationRequest", {
            content:{
                location:requestLocation,
            }
        })
    }

    ipc.on("sentEmail", (event,arg) => {
        if(arg === false){
            setSentEmail(true);
        }
        else{
            alert("errror sending email, please check the console for more info")
            console.log(arg)
        }
    })
    

    const searchByPrice = () => {
        console.log("SEARCH BY PRICE")
        
        if(isFreeChecked){
            ipc.send("getFreeLocations")
        } 
        else{
            if(isNaN(minPrice) || minPrice === ""){
                setMinPrice(0);       
             }
             if(isNaN(maxPrice) || maxPrice === ""){
                 setMaxPrice(0);       
             }
                console.log(minPrice, maxPrice)
                     ipc.send("getPricedLocations", {
                         content:{
                             maxPrice,   
                             minPrice
                         }
                     })
                 
                 // else if (minPrice !== "" && ( maxPrice === "" || maxPrice === 0 ||isNaN(maxPrice))){
                     
                 // }
                 // else if ((minPrice === "" || minPrice === 0 || isNaN(minPrice) ) && ( maxPrice !== "" || maxPrice !== 0)){
                 //     alert("min undefined")
                 // }

                 
                 console.log("min is")
                 console.log( minPrice)
                 console.log(maxPrice)
     
             
        }
      
    }

    const searchByNumberOfPeople = () => {
            ipc.send("getLocationByNumberOfPeople", {
                content:{
                    isFamilyFriendly
                }
            
            })    

    }

    const searchInsideOutside = () => {
        if(!outside && !inside){
            alert("One of the boxes must be checked")
        }
        else{
            ipc.send("getInsideOutsideLocations", {
                content:{
                    outside,
                    inside
                }
            }) 
        }
     
    }
    const setCurrentLocationEmpty = () => {
        setCurrentLocation("")
    }


    const loadMoreOnClick = () => {
        const currentLength = found.length;
        const currentType = currentMode;
        ipc.send("loadMoreOnClick", {
            content:{
                currentType,
                currentLength,
                currentInput:locationSearch
            }
        })
        
    }
    return (
        <div >
            <section className = {style.questionMark}>
                <div className = {style.align}>
                    <a href = "#header">
                        <i class="fa-solid fa-question" onClick = {() => {ref.current.scrollIntoView({ behavior: "smooth" });}}></i>
                    </a>
                    <p>How to use?</p>
                </div>
            </section>
            <section className = {style.svgContainer}> 

                <div className = "w-3/6" style = {{"display":"flex", "justifyContent":"center"}}>
                  <img className = {style.svgImages} src = "adventure.png"></img>
                </div>
                
                <div className = "w-3/6" style = {{"display":"flex", "justifyContent":"center"}}>
                  <img  className = {style.svgImages} src = "travel.png"></img>
                </div>
                
            </section> 
            {currentLocation === "" ?
            
            <div className={style.intro}>
                <section className = "headerText">
                    <h1 style = {{cursor:"pointer"}} onClick = {() => setSearch(() => false)}>Alan</h1>
                    <p>Find your next place to visit!</p>
                </section>
                

                <section className = {style.searchBy}>
                    <div className = {style.searchOptions}>

                            <div class="inline-block relative w-50">
                                <select onChange = {(e) => {setSelectedOption(e.target.value);setSearch(false)}} value = {selectedOption} name="searchBy" id="searchTypes" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="Location">Address</option>
                                    <option value="Type">Type Of Attraction</option>
                                    <option value="Price">Price</option>
                                    <option value="Family Friendly">Family Friendly</option>
                                    <option value="Outside/Inside">Outside/Inside</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                    </div>
                </section>
                {selectedOption === "Location" && 
                <div>
                    <section className  = {style.locationInput}>
                        <div className = {style.searchContainer}>
                            <input  className = {style.searchInput} type = "text" onChange = {(e) => setLocationSearch(e.target.value)} value = {locationSearch} placeholder="Search By Address" />
                        </div>
                        <button onClick = {() => {setSearch(true); searchOnClick("Location");}} className ="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Search!</button>
                </section>
                </div>
                }
                {selectedOption === "Outside/Inside" && 
                <div>
                    <section className  = {style.locationInput}>
                    <div className = {style.outsideInside}>
                    <div  className = {`${style.priceFree} ${style.outInsideEvent}`}> 
                            <input  type="checkbox" onChange = {(e) =>setOutside(e.target.checked)}/>
                            <p for="free">Outside Events</p>
                        </div>
                        
                        <div  className = {`${style.priceFree} ${style.outInsideEvent}`}> 
                            <input type="checkbox" onChange = {(e) =>setInside(e.target.checked)}/>
                            <p for="free">Inside Events</p>
                        </div>
                    </div>
                    <button onClick = {() => {setSearch(true); searchInsideOutside();}} className ="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Search!</button>
                </section>
                </div>
                }
                {selectedOption === "Type" && 
                <div>
                    <section className  = {style.locationInput}>
                    <div className = {style.searchContainer}>

                        <input  className = {style.searchInput} type = "text" onChange = {(e) => setLocationSearch(e.target.value)} value = {locationSearch} placeholder="Search By Type. Click on Categories button for options" />
        
                                {myOptions.length > 0 ?  <div className = {style.outPut}>
                                            <ul className = {style.outPutList}>
                                                {myOptions.map((item) => {
                                                    return(
                                                        <div className = "mt-2">
                                                            <li onClick = {() => { setLocationSearch(item); }} className = "py-4 bg-slate-200">{item}</li>                                                        
                                                        </div>
                                                    )
                                                })}

                                            </ul>
                                        </div> : ""

                                    }
                            
                    

                    </div>
                    <button onClick = {() => { searchOnClick("Type"); setSearch(true);}} className ="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Search!</button>
                </section>
                </div>
                }

                {selectedOption === "Price" && 
                <div className = {style.price}>
                     <div className = {`${style.priceContainer}`}>
                                <div className = {style.priceFree}> 
                                    <input type="checkbox" onChange = {(e) =>setIsFreeChecked(e.target.checked)}/>
                                    <label for="free">Free</label>
                                </div>
                                <div className = {style.minAndMaxContainer}>
                                    {/* <div className = {style.priceMin}>
                                        <label  className = {style.priceLabel}>Minimum</label>
                                        <input value = {minPrice} onChange = {(e) => setMinPrice(parseInt(e.target.value))}type = "number"></input>
                                    </div> */}
                                    <div class="relative z-0 mb-6 w-full group">
                                        <input value = {minPrice} onChange = {(e) => setMinPrice(parseInt(e.target.value))}type = "number" name="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "  />
                                        <label for="floating_email" class="absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Minimum Price</label>
                                    </div>
                                    <div class="relative z-0 mb-6 w-full group">
                                        <input  value = {maxPrice} onChange = {(e) => setMaxPrice(parseInt(e.target.value))} type = "number" name="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "  />
                                        <label for="floating_email" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Maximum Price</label>
                                    </div>
                                    {/* <div className = {style.priceMax}>
                                        <label className = {style.priceLabel}>Maximum</label>
                                        <input value = {maxPrice} onChange = {(e) => setMaxPrice(parseInt(e.target.value))} type = "number"></input>
                                    </div> */}
                                </div>
                        </div>
                         <button onClick = {() => {setSearch(true); searchByPrice();}} className ="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Search!</button>
                </div>
                }

                {selectedOption === "Family Friendly" && 
                <div className = {style.price}>
                     <div className = {style.priceContainer}>
                              
                                <div className = {style.minAndMaxContainer}>
                                    <div className = {style.priceFree}> 
                                        <input type="checkbox" onChange = {(e) =>setIsFamilyFriendly(e.target.checked)}/>
                                        <label for="free">Family Friendly</label>
                                    </div>
                                   
                                    {/* <div className = {style.priceMax}>
                                        <label className = {style.priceLabel}>Maximum</label>
                                        <input value = {maxPrice} onChange = {(e) => setMaxPrice(parseInt(e.target.value))} type = "number"></input>
                                    </div> */}
                                </div>
                        </div>
                         <button onClick = {() => {setSearch(true); searchByNumberOfPeople();}} className ="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Search!</button>
                </div>
                }
                
                {invalidInput &&
                 <p class = "text-orange-500 text-center text-2xl">Please enter a valid input.</p>
                }
                
                
                <section className = {`${style.categoriesBtn} `}>
                  <button type="button" onClick = {() =>setCategories((prev) => !prev)} class="mr-4 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Categories</button>
                  <button  onClick = {() => {if(sortBool){setSortBool(false); setFilterBool((prev) => !prev)} else{setFilterBool((prev) => !prev)}}} type="button" class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">Filter</button>
                </section>
                
                {categories &&
                <section className ={style.categories} >

                    <div onClick = {() => {setSearch(true); searchOnClick("Restaurant")}} className = {style.cardCategory}>
                        <i className = "fas fa-utensils"></i>
                        <p >Restuarants</p>
                    </div>

                    <div  onClick = {() =>  {setSearch(true); searchOnClick("Shopping")}} className = {style.cardCategory}>
                        <i className="fas fa-shopping-cart"></i>
                        <p  >Shopping</p>
                    </div>

                    <div onClick = {() =>  {setSearch(true);searchOnClick("Visit")}} className = {style.cardCategory}>
                        <i className="fas fa-suitcase-rolling"></i>
                        <p >Places To Visit</p>
                    </div>

                    <div onClick = {() =>  {setSearch(true);searchOnClick("Things To Do")}} className = {style.cardCategory}>
                        <i className="fas fa-check"></i>
                        <p >Things To Do</p>
                    </div>

                    <div onClick = {() =>  {setSearch(true);searchOnClick("Hotel")}} className = {style.cardCategory}>
                        <i className="fas fa-hotel"></i>
                        <p >Hotels</p>
                    </div>
                    <div onClick = {() =>  {setSearch(true);searchOnClick("Outside")}} className = {style.cardCategory}>
                        <i className="fas fa-campground"></i>
                        <p >Outside</p>
                    </div>

                    <div onClick = {() =>  {setSearch(true);searchOnClick("Library")}} onclick = "changeScreen(e)" className = {style.cardCategory}>
                        <i className="fas fa-book"></i>
                        <p >Libraries</p>
                    </div>

                    <div onClick = {() =>  {setSearch(true);searchOnClick("Museums")}} className = {style.cardCategory}>
                        <i className="fas fa-brain"></i>
                        <p >Museums</p>
                    </div>
                    <div onClick = {() =>  {setSearch(true);searchOnClick("Random")}} className = {style.cardCategory}>
                        <i className="fas fa-random"></i>
                        <p >random</p>
                    </div>

                </section>
                }
                {!search ?
            <section>
                <section className = {style.topFive}>
                        <h1>Top 5 visited places</h1>
                        <div className = "flex flex-wrap w-4/5 m-auto justify-center items-stretch">
                            {topFive.length > 0 ? topFive.map((elem) => 
                            <div onClick = {() => {setCurrentLocation(elem)}}>
                                <SmallLocation  elem = {elem}></SmallLocation>
                            </div>
                            ) : ""}
                            
                        </div>
                </section>
                <section>
                    <Faq ref = {ref}></Faq>
                </section>
            </section>
            :
            <section>
                <section className = {style.filterContainer}>
                    <div className = {style.filterMyButtons}>
                        <div className={`${style.filterAndSortContainer} "inline-flex rounded-md shadow-sm"`} role="group">

                            {/* <button onClick = {() => {if(filterBool){setFilterBool(false); setSortBool((prev) => !prev)} else{setSortBool((prev) => !prev)}}} type="button" class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                                Sort
                            </button> */}
                        </div>
                    </div>
                    {
                        filterBool &&
                        <div>
                            <Filter></Filter>
                        </div>
                    }
                    {/* {
                        sortBool &&
                            <div>
                                <Sort></Sort>
                            </div>
                    } */}


                </section>
                <section className = {style.topFive}>
                        <h1>Found These Locations</h1>
                        <div className = {`${"flex w-4/5 m-auto justify-center flex-wrap"} ${style.topFiveContainer}`}>
                            
                            {(filteredCount.length > 0 || filteredCount.length === 0) && filteredCount[0] !== "None"  ?
                                <div className = "flex flex-wrap justify-center"> 
                                    {filteredCount[0] !== "empty" ? filteredCount.map((elem) => 
                                        <div  className = {style.divContainer} onClick = {() => {setCurrentLocation(elem)}}>
                                            <SmallLocation  elem = {elem}></SmallLocation>
                                        </div>
                                    ) : 
                                    
                                    <div>
                                        <h1>Sorry, we could not find any filtered location</h1>
                                        <img className = "w-1/2 m-auto" src = "./404.png"></img>
                                    </div>
                                    }
                                </div>
                            :
                                <div className = "flex flex-wrap justify-center">
                                    {typeof count !== "undefined" && count.length > 0 ? count.map((elem) => 
                                        <div className = {style.divContainer} onClick = {() => {setCurrentLocation(elem)}}>
                                            <SmallLocation  elem = {elem}></SmallLocation>
                                        </div>
                                    ) : 
                                    
                                    <div>
                                        <h1>Sorry, we could not find any location</h1>
                                        {sentEmail && <div>
                                            <p class = "text-cyan-300 text-center text-2xl">successfully sent the email</p>
                                        </div>}
                                        <img className = "w-1/2 m-auto" src = "./404.png"></img>
                                        <div className = "w-4/5 text-center m-auto my-2">
                                            <h2 className = "couldNotFind">Don't give up! If you want to see locations that meets this criteria, fill out the form and click on request!</h2>
                                        </div>
                                        <div className = "w-full flex justify-center m-auto">
                                            <input value = {requestLocation} onChange = {(e) => setRequestLocation(e.target.value)}   placeholder='What do you want to see?' type = "text" className = {`${"bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mr-1"} ${style.questionInput}`}></input>
                                            <button onClick =  {()=> sendLocationRequest() } className ="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">request!</button>
                                        </div>

                                    </div>
                                    }
                                </div>
                            }


                             {/* Normal searching without filters */}



                            {/* {found.length > 0 ? found.map((elem) => <div><SmallLocation  elem = {elem}></SmallLocation></div>) : ""} */}
                            
                        </div>
                        {found.length >= 5 &&
                                <div className = "w-full flex justify-center">
                                    <button className = "bg-blue-500  w-1/4 mt-2 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick = {() => loadMoreOnClick()}>Load More</button>
                                </div>                            
                            }
                </section>
             </section>
            }
            </div>
            
            
        : 
        
        
        
        <section className = {style.bigLocationContainer}>
               <BigLocation onHomeClick =  {setCurrentLocationEmpty} location = {currentLocation}></BigLocation>
        </section>} 

            


         

        </div>
    )
}



// advance searching:
//type:Hiking price:188-200 indoor:true