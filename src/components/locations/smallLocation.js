import React from 'react'
import style from '../home/home.module.css'
export default function SmallLocation({elem}) {
  console.log("SMALL LOCATION HERE")
  console.log(elem)
  return (
    
    <div className = {`${" rounded  shadow-lg"} ${style.topFiveDiv}`}>
         {typeof elem !== "undefined" &&
         
        
            <div>
             {typeof elem.image !== "undefined" && elem.image !== "" &&
                <img className= {`${"w-full"} ${style.myCardImageContainer}`} src={`${elem.image}`} alt="Sunset in the mountains" />
             }
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{elem.name}</div>
              <p class="font-bold text-sm mb-2">
                {elem.stars}/5
              </p>
              <p class="text-gray-700 text-base">
                {elem.address}
              </p>
            </div>
            
            
            <div class="px-6 pt-4 pb-2">
              {elem.tags.map((elem) => {
                return( 
                  <span class="inline-block bg-lime-300  rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{elem}</span>
                ) 
              })}
              {typeof elem.price === "string" ?
                <span class="inline-block bg-blue-300  rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{elem.price}</span>              
              :
                <span class="inline-block bg-blue-300  rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${elem.price}</span>

              }
          </div>  


              

            </div>
            }         
          </div>

  )
}
