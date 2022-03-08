import React from 'react'
import style from './home/home.module.css'
import {useEffect, useState} from 'react'


const electron = window.require('electron');
const ipc = electron.ipcRenderer;

export default function Footer() {
  const [addQuestionBtn, setAddQuestionBtn] = useState(false);
  const [myQuestion, setMyQuestion] = useState("");
  const [openUnanswered, setOpenUnanswered] = useState(false);
  const [suggestAnswerBtn, setSuggestAnswerBtn] = useState(false);
  const [FAQ, setFAQ] = useState([])
  const [modalOpen, setModalOpen] = useState(false);
  const [newQuestions, setNewQuestions] = useState([]);

  const [openQuestion,setOpenQuestion] = useState({
      "q1":false,
      "q2":false,
      "q3":false,
      "q4":false,
  })

  useEffect(() => {
    ipc.send("getInitialQuestions")
  },[])

  ipc.on("getInitialFAQ", (event,arg) => {
    setFAQ(arg)
  })



  const getValue = (str) => {
    if(str==="q1"){
        return !openQuestion.q1
    }
    if(str==="q2"){
        return !openQuestion.q2
    }
    if(str==="q3"){
        return !openQuestion.q3
    }
    if(str==="q4"){
        return !openQuestion.q4
    }

  }
  useEffect(() => {
    getInitNewFAQ()
  },[])
  const getInitNewFAQ = () =>{
      ipc.send("getinitilalnewFAQ")
  }
  ipc.on("returnedinitialnewFAQ", (event,arg) => {
      console.log("SETTING NEW QUESTIONS")
      console.log(arg)
    setNewQuestions(arg)
  })
  const addNewQuestion = () => {
      if(myQuestion === ""){
          alert("you must fill the input")
      }
      else{
        ipc.send("addNewFAQ", {
            content:myQuestion
        })
        const arr = [];
        for(let i =0; i<newQuestions.length; i++){
            arr.push(newQuestions[i]);
        }   
        const currentObj = {
            "question":myQuestion
        }
        arr.push(currentObj)
        setNewQuestions(arr)
        
        
      }
  }

  return (
      <div>
       <section className = {style.howToUse}>
                <div className = {style.header}>
                    <h1>How To Use Alan</h1>
                </div>
                <div className ="flex justify-center" >
                  <img  className = {style.svgImages} src = "question.png"></img>
                </div>
                <div className = {style.helpButtons}>
                    <div className = {style.helpMenu}>
                        <button onClick = {() => setModalOpen((prev) => !prev)} className = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Help Menu & Documentation</button>
                    </div>
                </div>
                
                <div className = "m-auto align-center">
                        <button onClick = {() => setModalOpen((prev) => !prev)} className = "bg-teal-400 hover:bg-teal-300 text-white font-bold py-4 px-4 border-b-4 border-teal-700 hover:border-blue-500 rounded">Restore database</button>
                </div>

                <div>
                    {modalOpen &&
                        <div>
                           <section class="py-10  ">
                        <div class="container px-4 mx-auto">
                            <div class="max-w-4xl mx-auto">
                            <ul>
                                <li class="mb-4 px-4 lg:px-12 py-8 bg-white rounded-2xl">
                                <button class="flex w-full text-left">
                                    <div class="w-auto mr-8">
                                    <span class="flex items-center justify-center w-12 h-12 text-lg font-bold bg-blue-100 rounded-full">1</span>
                                    </div>
                                    <div class="w-full mt-3">
                                        <div onClick = {() => setOpenQuestion({...openQuestion, "q1":getValue("q1")})} class="flex items-center justify-between">
                                            <h3 class="text-xl font-bold">How to search for locations?</h3>
                                        </div>
                                        {openQuestion.q1 &&
                                            <div class="mt-6 border-l-2 border-gray-50 pl-10">
                                                <p class="mb-5 text-xl">You can search attractions based on their location, their type (restaurants, shopping etc), their price, family friendly, and finally whether if it is inside or outside.</p>
                                                <p class="mb-2 text-lg">To search for an attraction, select the mode (described in the above paragraph) and search it.</p>
                                                <p class="mb-2 text-lg">To search with Location mode: Type the name of the location you want. For Example: Egg Harbor Township. Even if you don't write the full name, it would return all of the attractions that's address includes the input you have given. Example: Egg Harbor and Egg Harbor Township returns the same values</p>
                                                <p class="mb-2 text-lg">To search with Type of attraction: Type the name of the attraction you want. Full list can be <a className = "text-sky-600" href = "https://fbla-alan.github.io/locations" target = "_blank">found here </a> </p>
                                                <p class="mb-2 text-lg">To search with Price attribute: You can select free option, which would return all of the free options. If you decide to use Maximum and Minimum range you will have to fill at least one of them. You leave one of them empty if you desire.</p>
                                                <p class="mb-2 text-lg">To search with family friendly: You would need to select the option and click on the check button. After you check it, the program will return all of the results that are family friendly </p>
                                                <p class="mb-2 text-lg">To search with Outside/Inside: You You would check which one you would like to visit. However, it is possible to choose both of them. If you decide to choose both of them, the program will return all of the attractions. </p>
                                            </div>
                                        }
                                        </div>
                                </button>
                                </li>
                                <li class="mb-4 px-4 lg:px-12 py-8 bg-white rounded-2xl">
                                <button class="flex w-full text-left">
                                    <div class="w-auto mr-8">
                                    <span class="flex items-center justify-center w-12 h-12 text-lg font-bold bg-blue-100 rounded-full">2</span>
                                    </div>
                                    <div class="w-full mt-3">
                                        <div onClick = {() => setOpenQuestion({...openQuestion, "q2":getValue("q2")})} class="flex items-center justify-between">
                                            <h3 class="text-xl font-bold">Filter Options</h3>
                                        </div>
                                        {openQuestion.q2 &&
                                            <div class="mt-6 border-l-2 border-gray-50 pl-10">
                                                <p class="mb-5 text-xl">There are 4 options that you can use to filter the returned values. Number of stars, Outdoor/Indoor, price range and family friendly or not</p>
                                                <p class="mb-2 text-lg">Number of stars: You can choose the number of stars you want in an attraction. In addition to that, you can choose more than 1 star. For example if you choose 2 and 3 stars it will return all of the attractions that has either 2 or 3 stars. If you choose none of them, it will return all of the values</p>
                                                <p class="mb-2 text-lg">Outdoor/Indoor: You can choose to get all of the attractions that is in outdoors or indoors. You can also choose to get both indoor and outdoor attractions.</p>
                                                <p class="mb-2 text-lg">Price: Enter the range of the price you desire. You don't have to fill this option if you don't want to. However, you can also choose to fill one of them. For example you can leave minimum empty and fill maxiumum or vice versa.</p>
                                                <p class="mb-2 text-lg">Family Friendly: If you decide to choose it, the program will return the attractions that has family friendly tag</p>
                                            
                                            </div>
                                        }
                                        </div>
                                </button>
                                </li>
                                <li class="mb-4 px-4 lg:px-12 py-8 bg-white rounded-2xl">
                                    <button class="flex w-full text-left">
                                        <div class="w-auto mr-8">
                                        <span class="flex items-center justify-center w-12 h-12 text-lg font-bold bg-blue-100 rounded-full">3</span>
                                        </div>
                                        <div class="w-full mt-3">
                                            <div onClick = {() => setOpenQuestion({...openQuestion, "q3":getValue("q3")})} class="flex items-center justify-between">
                                                <h3 class="text-xl font-bold">Libraries used</h3>
                                            </div>
                                            {openQuestion.q3 &&
                                            <div class="container libContainer">
                                            <ul class="responsive-table">
                                                <li class="table-header">
                                                <div class="col col-1">Name</div>
                                                <div class="col col-2 mainCol">Purpose</div>
                                                <div class="col col-2 mainCol">Website</div>
                                                </li>
                                                <li class="table-row">
                                                <div class="col col-1" data-label="Job Id">Electron</div>
                                                <div class="col col-2" data-label="Customer Name">Converting html like webpages into dektop application</div>
                                                <div class="col col-3 text-blue-400" data-label="Amount"><a href = "https://www.electronjs.org/">https://www.electronjs.org/ </a></div>
                                                </li>
                                                <li class="table-row">
                                                <div class="col col-1" data-label="Job Id">React</div>
                                                <div class="col col-2" data-label="Customer Name">Used to write the front-end(user-interface) of the application. </div>
                                                <div class="col col-3 text-blue-400" data-label="Amount">https://reactjs.org/</div>
                                                </li>
                                                <li class="table-row">
                                                <div class="col col-1" data-label="Job Id">Redux</div>
                                                <div class="col col-2" data-label="Customer Name">Storing the found locations across all of the pages.</div>
                                                <div class="col col-3 text-blue-400" data-label="Amount"><a href="https://redux.js.org/">https://redux.js.org/</a></div>
                                                </li>
                                                <li class="table-row">
                                                <div class="col col-1" data-label="Job Id">electron-is-dev</div>
                                                <div class="col col-2" data-label="Customer Name">Checks whether or not the application is in development mode.</div>
                                                <div class="col col-3 text-blue-400" data-label="Amount"><a href = "https://www.npmjs.com/package/electron-is-dev">https://www.npmjs.com/package/electron-is-dev</a></div>
                                                </li>
                                                <li class="table-row">
                                                <div class="col col-1" data-label="Job Id">Font awesome</div>
                                                <div class="col col-2" data-label="Customer Name">Library that includes the icons used in this application.</div>
                                                <div class="col col-3 text-blue-400" data-label="Amount"><a href = "https://fontawesome.com/">https://fontawesome.com/</a></div>
                                                </li>
                                                <li class="table-row">
                                                <div class="col col-1" data-label="Job Id">Weather API</div>
                                                <div class="col col-2" data-label="Customer Name">When you click on a location, the application sends a request to this API and gets the current weather in that location.</div>
                                                <div class="col col-3 text-blue-400" data-label="Amount"><a href = "https://openweathermap.org/api">https://openweathermap.org/api</a></div>
                                                </li>
                                                <li class="table-row">
                                                <div class="col col-1" data-label="Job Id">fs</div>
                                                <div class="col col-2" data-label="Customer Name">Used to read and write into locations.json file, which contains the location database.</div>
                                                <div class="col col-3 text-blue-400" data-label="Amount"><a href = "https://nodejs.org/api/fs.html">https://nodejs.org/api/fs.html</a></div>
                                                </li>
                                            </ul>
                                            </div>
                                            }
                                            </div>
                                    </button>
                                </li>
  
                                <li class="mb-4 px-4 lg:px-12 py-8 bg-white rounded-2xl">
                                    <button class="flex w-full text-left">
                                        <div class="w-auto mr-8">
                                        <span class="flex items-center justify-center w-12 h-12 text-lg font-bold bg-blue-100 rounded-full">4</span>
                                        </div>
                                        <div class="w-full mt-3">
                                                                                    <div onClick = {() => setOpenQuestion({...openQuestion, "q4":getValue("q4")})} class="flex items-center justify-between">
                                                                                        <h3 class="text-xl font-bold">Copyright</h3>
                                                                                    </div>
                                                                                    {openQuestion.q4 &&
                                                                                    <div class="">
                                                                                    <div class = "flex items-center">
                                                    <i class=" ml-4 far copyRight "></i>
                                                </div>
                                                <div class = "copyrightContainer">
                                                    <div>
                                                        <h1 class = "subsubHeader">All of the data in this application are not real.</h1>  
                                                    </div>
                                                    <div class = "imageSource mt10">
                                                        <p class = "subsubHeader">
                                                            Image source: <a class = "text-blue-400" href = "https://unsplash.com/license">https://unsplash.com/license.</a>  CC
                                                        </p>
                                                        <p class = "mt-1 paragraph">“Unsplash grants you an irrevocable, nonexclusive, worldwide copyright license to download, copy, modify, distribute, perform, and use photos from Unsplash for free, including for commercial purposes, without permission from or attributing the photographer or Unsplash. This license does not include the right to compile photos from Unsplash to replicate a similar or competing service.”</p>
                                                    </div>

                                                    <div class = "imageSource mt10">
                                                        <p class = "subsubHeader">
                                                        Icon source: <a class = "text-blue-400" href = "https://fontawesome.com/license/free">https://fontawesome.com/license/free</a>  CC
                                                        </p>
                                                        <p class = "mt-1 paragraph">““Font Awesome Free is free, open source, and GPL friendly. You can use it for commercial projects, open source projects, or really almost whatever you want.””</p>
                                                    </div>


                                                    <div class = "imageSource mt10">
                                                    <p class = "subsubHeader">
                                                        Illustrations( blue images on the main screen): <a class = "text-blue-400" href = "https://undraw.co/license">https://undraw.co/license</a>  CC
                                                    </p>
                                                    <p class = "mt-1 paragraph">““All images, assets and vectors published on unDraw can be used for free. You can use them for noncommercial and commercial purposes. You do not need to ask permission from or provide credit to the creator or unDraw.””</p>
                                                </div>
                                            </div>
                                            </div>
                                            }
                                            </div>
                                    </button>
                                </li>

                            </ul>
                            </div>
                        </div>
                        </section>
                        </div>
                    
                    }
                </div>
            </section>

            <section className = {style.qaContainer}>
                
                <h1 className = {style.header}>Frequent Asked Questions</h1>

                <div className = {style.questionsContainer}>

                    <div className = {style.oneQuestion}>
                        {FAQ.map((question) => {
                            return(
                            <div className = "mt-4">
                                <div className = {style.questionContainer}>
                                    <p className = {style.questionText}>Question</p>
                                    <p className = {style.question}>{question.question}</p>
                                </div>
                                <div className = {style.answerContainer}>
                                    <p className = {style.answerText}>Answer</p>
                                    <p className = {style.answer}>{question.answer}</p>
                                </div>
                           </div>
                            )

                        })}
                    </div>
                    <div className = "flex justify-center mt-4">
                        <button onClick = {() => setAddQuestionBtn((prev) => !prev)} className = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Ask your own question!</button>
                    </div>
                    {addQuestionBtn &&
                       <div class = "w-full">
                            <div className = {style.addQuestion}>
                                <label className = {style.inputText}>Add Your Question Here!</label>
                                <div className = "w-full flex justify-center m-auto">
                                    <input value = {myQuestion} onChange = {(e) => setMyQuestion(e.target.value)} placeholder='Question' type = "text" className = {`${"bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mr-1"} ${style.questionInput}`}></input>
                                    <button className ="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick = {(e) => addNewQuestion(e)}  >Add!</button>
                                </div>
                            </div>
                        </div>
                    }

                </div>

            </section>
            <section className = {style.qaContainer}>
                <h1 className = {style.header}>Unanswered questions</h1>
                <div className = {style.questionsContainer}>

                    <div className = {style.oneQuestion}>
                        {newQuestions.map((question) => {
                            return(
                                <div>
                                    <div className = "flex items-center">
                                        <div className = {`${style.questionContainer} ${"ml-1"}`}>
                                            <p className = {style.questionText}>Question</p>
                                            <p className = {style.question}>{question.question}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </section>



</div>
)
}
