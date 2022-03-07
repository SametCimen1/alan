import React from 'react'
import style from '../home/home.module.css'
export default function SmallLocation({elem}) {
  return (
    <div className = {`${" rounded  shadow-lg"} ${style.topFiveDiv}`}>
  
    
            {/* <div className ={style.topFiveInfo} >
                <div className = {style.topFiveName}>
                     <div>
                       <p className = {style.topFiveIName}>{elem.name}</p>
                    </div>
                    <div className = {style.lowPrice}>
                      <p className = {style.lowestPricelowest}>Lowest Price Avaible:  </p>
                      {elem.price !== "" ?  <span className = {style.smallLocationPrice}> ${elem.price}</span> : <span className = {style.smallLocationPrice}> Free</span>}

                    </div>
                    
                </div>
                <div className = {style.topFiveAddressContainer}>
                    <div className = {style.topFiveAddress}>
                        <p className ={style.topFiveIAddress} >{elem.address}</p>
                    </div>
                    <div className = {style.lowPrice}>
                      <p className = {style.lowestPricelowest}>Visited  </p>
                      <span className = {style.smallClicked}> {elem.totalClicked} </span>
                      <p className = {style.clickedText}> times </p>
                    </div>
                    
                </div>

            </div> */}
  
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

  )
}
