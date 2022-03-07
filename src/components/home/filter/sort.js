import React from 'react'
import style from '../home.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { increment, init } from '../../../redux/counterSlice'
import {useState, useEffect} from 'react'
export default function Sort() {
    
    const found = useSelector(state => state.counter.value);

    const [filterStars, setFilterStars] = useState([]);
    const [indoorOrOutdoor, setIndoorOrOutdoor] = useState([]);
    const [amnetiaArray, setAmnetiaArray] = useState([]);



    const filterFound = () => {
        
    }



    
    useEffect(() => {
        
    }, [indoorOrOutdoor])


    useEffect(() => {
        console.log("amnetia array")
        console.log(amnetiaArray)
    },[amnetiaArray])
  return (
    <section className = {style.filterOptions}>
                            <h1 className = {`${"text-center underline decoration-wavy decoration-emerald-400"} ${style.filterAndSortText}`}>Sorting Section</h1>
                              
                        <div className = {style.filterDiv}>
                            <p className = "text-xl"> Price</p>
                            <div className = "flex ml-4">
                                <i className="mr-4 text-xl  cursor-pointer fa-solid fa-arrow-up"></i>
                                <i className="fa-solid text-xl cursor-pointer fa-arrow-down"></i>
                            </div>
                        </div>

                        <div className = {style.filterDiv}>
                            <div className = "flex items-center w-full" >
                                <p className = "text-xl">Number Of Stars</p>
                                <div className = "flex ml-4">
                                    <i className="mr-4 text-xl  cursor-pointer fa-solid fa-arrow-up"></i>
                                    <i className="fa-solid text-xl cursor-pointer fa-arrow-down"></i>
                                </div>

                            </div>
                        </div>
                        <div className = "flex justify-center mt-4">
                          <button onClick = {() => filterFound()} className ="bg-blue-500 w-1/4  mr-1 hover:bg-blue-400  text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Apply!</button>
                          <button onClick = {() => "cancelFilter"()} className ="bg-red-500 w-1/4 ml-1 hover:bg-red-400 text-white font-bold py-4 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Clear!</button>
                        </div>
                    </section>
  )
}
