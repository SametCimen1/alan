import React from 'react'
import style from '../../home/home.module.css'
import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initFiltered, init } from '../../../redux/counterSlice'

export default function Filter() {
    const found = useSelector(state => state.counter.value);
    const dispatch = useDispatch()
    
    const [filterStars, setFilterStars] = useState([]);
    const [indoorOrOutdoor, setIndoorOrOutdoor] = useState("");

    const [minPrice, setMinPrice] = useState("undefined");
    const [maxPrice, setMaxPrice] = useState("undefined");

    let filtered = [];
    const filterFound = () => {
        
        filtered = [];
        console.log("Filtered", filtered)
    
        if(filterStars.length !== 0){
            for(let elem = 0; elem < found.length; elem++){
                for(let i =0; i<filterStars.length; i++){
                    console.log("stars")
                    console.log(Math.floor(found[elem].stars))
                    if(Math.floor(found[elem].stars) === parseInt(filterStars[i])){
                        addIfNotPresent(found[elem])
                    }
                }
            }

        }
        if(indoorOrOutdoor !== ""){
            console.log("IN INDOOR")
            
            if(indoorOrOutdoor.includes("indooroutdoor") || indoorOrOutdoor.includes("outdoorindoor") ){
                
                for(let i = 0; i<found.length; i++){
                        addIfNotPresent(found[i])
                }
            }
            else if(indoorOrOutdoor.includes("outdoor")){
                for(let i = 0; i<found.length; i++){
                    if(found[i].isOutside){
                        addIfNotPresent(found[i])
                    }
                }
            }
            else if(indoorOrOutdoor.includes("indoor")){
                for(let i = 0; i<found.length; i++){
                    if(!found[i].isOutside){
                        addIfNotPresent(found[i])
                    }
                }
            }
        }
        console.log("CLICKED PRICE FILTER")
        console.log(minPrice)
        console.log(maxPrice)
        if(minPrice !== "undefined" && maxPrice !== "undefined"){
            console.log("in correct")
            console.log(minPrice)
            console.log(found)
            for(let i = 0; i<found.length; i++){
                console.log(typeof found[i].price)
                if(typeof found[i].price === "string"){
                    addIfNotPresent(found[i])
                }
                else{
                    if(found[i].price > minPrice && found[i].price < maxPrice){
                        console.log("adding", found[i])
                        addIfNotPresent(found[i])
                    }
                }

            }
        }
        else if (minPrice !== "undefined" && maxPrice === "undefined"){ //maxPrice is not avaible.
            //work with minPrice
            
            for(let i = 0; i<found.length; i++){
                console.log(typeof found[i].price)
                if(typeof found[i].price === "string"){
                    addIfNotPresent(found[i])
                }
                else if(found.price > minPrice){
                    addIfNotPresent(found[i])
                }
            }

        }
        else if(minPrice === "undefined" && maxPrice !== "undefined"){
            for(let i = 0; i<found.length; i++){
                if(typeof found[i].price === "string"){
                    addIfNotPresent(found[i])
                }
                else if( found.price < maxPrice){
                    addIfNotPresent(found[i])
                }
            }
        }

        if(filtered.length > 0){
            console.log("DISPATCHED")
            console.log(filtered)
            dispatch(initFiltered(filtered))            
        }
        else{
            filtered.push("empty")
            dispatch(initFiltered(filtered))
        }
    }




    const addIfNotPresent = (location) => {
        if(filtered.some((elem) => elem.name === location.name)){

        }
        else{
            filtered.push(location);
        }
    }

    const updateStarFilter = (e,starNumber) => {
        if(e.target.checked){
            setFilterStars((prev) => [...prev, starNumber])
        }
        else{
            const arr = [];
            for(let i =0; i<filterStars.length; i++){
                if(filterStars[i] !== starNumber){
                    arr.push(filterStars[i])
                }
            }
            setFilterStars(arr)
        }
    } 

    const updateIndoorOutdoor = (e, name) => {
        if(e.target.checked){
            if(name === "outdoor"){
                const prev = indoorOrOutdoor;
                setIndoorOrOutdoor(prev + "outdoor")
            }
            else{
                const prev = indoorOrOutdoor;
                setIndoorOrOutdoor(prev+"indoor")
            }

        }
        else{
            if(name === "outdoor"){
                const prev = indoorOrOutdoor;
                if(prev.includes("indoor")){
                    setIndoorOrOutdoor("indoor")
                }
                else{
                    setIndoorOrOutdoor("")
                }

            }
            else{ //delete indoor
                const prev = indoorOrOutdoor;
                if(prev.includes("outdoor")){
                    setIndoorOrOutdoor("outdoor")
                }
                else{
                    setIndoorOrOutdoor("")
                }
            }
        }
    }

    useEffect(() => {
        console.log(indoorOrOutdoor)
    }, [indoorOrOutdoor])


    const cancelFilter = () => {
        //get filtered answers
        
        dispatch(initFiltered(["None"]))
    }
  return (
    <div>
                         <section className = {style.filterOptions}>
                         <h1 className = {`${"text-center underline decoration-wavy decoration-emerald-400"} ${style.filterAndSortText}`}>Filter Section</h1>
                        <div className = {style.filterDiv}>
                            <div className = {`${"flex items-center w-full"} ${style.filterDivContainer}`} >
                             <p className = {style.filterButtons}>Number Of Stars</p>
                             {/* <div className = "relative z-0 mb-6 w-full group">
                                 <input type="number" name="floating_email" class="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                 <label for="floating_email" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Number Of Stars</label>
                              </div> */}
                              <div class="flex justify-start w-full" >
                                 <div class = "flex w-full" > 
                                     <div class=" flex mr-4 items-center form-check" >
                                         <input onChange = {(e) => updateStarFilter(e,"1")} class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
                                         <label class="form-check-label inline-block text-gray-800" for="flexCheckDefault">
                                             1 Star
                                         </label>
                                     </div>
                                     <div class="flex mr-4 items-center form-check">
                                         <input onChange = {(e) => updateStarFilter(e,"2")} class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckChecked"  />
                                         <label class="form-check-label inline-block text-gray-800" for="flexCheckChecked">
                                             2 Star
                                         </label>
                                     </div>
                                     <div class="flex  mr-4 items-center form-check">
                                         <input onChange = {(e) => updateStarFilter(e,"3")} class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckChecked"  />
                                         <label class="form-check-label inline-block text-gray-800" for="flexCheckChecked">
                                             3 Star
                                         </label>
                                     </div>
                                     <div class="flex mr-4 items-center form-check">
                                         <input onChange = {(e) => updateStarFilter(e,"4")} class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckChecked"  />
                                         <label class="form-check-label inline-block text-gray-800" for="flexCheckChecked">
                                             4 Star
                                         </label>
                                     </div>
                                     <div class="flex mr-4 items-center form-check">
                                         <input onChange = {(e) => updateStarFilter(e,"5")} class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckChecked"  />
                                         <label class="form-check-label inline-block text-gray-800" for="flexCheckChecked">
                                             5 Star
                                         </label>
                                     </div>
                                 </div>
                                 </div>

                         </div>
                         
                     </div>
                     <div className = {`${"flex items-center w-full"} ${style.filterDivContainer}`} >
                             <p className = {style.filterButtons}>Indoor Or Outdoor?</p>
                             {/* <div className = "relative z-0 mb-6 w-full group">
                                 <input type="number" name="floating_email" class="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                 <label for="floating_email" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Number Of Stars</label>
                              </div> */}
                              <div class="flex justify-start w-full" >
                                 <div class = "flex w-full" > 
                                     <div class=" flex mr-4 items-center form-check" >
                                         <input onChange = {(e) => updateIndoorOutdoor(e, "outdoor")} class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
                                         <label class="form-check-label inline-block text-gray-800" for="flexCheckDefault">
                                             OutDoor
                                         </label>
                                     </div>
                                     <div class=" flex mr-4 items-center form-check" >
                                         <input onChange = {(e) => updateIndoorOutdoor(e, "indoor")} class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
                                         <label class="form-check-label inline-block text-gray-800" for="flexCheckDefault">
                                             Indoor
                                         </label>
                                     </div>
                                     
                                 </div>
                                 </div>

                         </div>

                         <div className = {`${"flex items-center w-full"} ${style.filterDivContainer}`}>
                            <button className = {style.filterButtons}>Price</button>
                            <div className = "flex w-1/2">
                                <div class="relative w-1/4 mr-2  z-0 mb-6 w-full group">
                                            <input value = {minPrice} onChange = {(e) => setMinPrice(parseInt(e.target.value))}type = "number" name="floating_email" class=" w-full block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "  />
                                            <label  for="floating_email" class="absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Minimum Price</label>
                                </div>
                                <div class="relative  w-1/4  ml-2 z-0 mb-6 w-full group">
                                            <input value = {maxPrice} onChange = {(e) => setMaxPrice(parseInt(e.target.value))}type = "number" name="floating_email" class="block w-full py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "  />
                                            <label for="floating_email" class="absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Maximum Price</label>
                                </div> 
                            </div> 
                        </div>

   

                     <div className = "flex justify-center mt-4">
                         <button onClick = {() => filterFound()} className ="bg-blue-500 w-1/4  mr-1 hover:bg-blue-400  text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Apply!</button>
                         <button onClick = {() => cancelFilter()} className ="bg-red-500 w-1/4 ml-1 hover:bg-red-400 text-white font-bold py-4 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Clear!</button>
                     </div>
            </section>
                        
    </div>
  )
}
