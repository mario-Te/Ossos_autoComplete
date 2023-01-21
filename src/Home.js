import React from 'react'
import useAutoComplete from './use-autocomplete'

export default function Home() {

const getHighlightedText =(text, highlight ) =>{
    // Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span>{parts.map((part,i) => part.toLowerCase() === highlight.toLowerCase() ? <b key={i}>{part}</b> : part)}</span>;
}
const [firstRender,setFirstRender] = React.useState(true);
const [options,setOptions] = React.useState([]);
     const { bindInput, bindOptions,suggestions, selectedIndex} = useAutoComplete({
        onChange: value => console.log(value),
        source:(search) => {
               return options.filter((option) => option.text.includes(search)).slice(0,4)
       }
    })

    React.useEffect(()=> 
    {
        const firstRenderEvent=()=>
        {
            if(firstRender) {
            fetch(`https://type.fit/api/quotes`).then((res)=>res.json()).then((data)=>setOptions(data));
            setFirstRender(false);
            } 
        }
            firstRenderEvent();
    })
       return (
        <div className="p-2 border col-8 offset-2 my-5" >
            <div className="flex items-center w-full">
                  <h2 className='text-center'> Select your quotes </h2>
                <input
                    placeholder='Search'
                    className="flex-grow px-1 outline-none w-100"
                    {...bindInput}
                />
              
            </div>
            <ul {...bindOptions} className="overflow-x-hidden overflow-y-auto list-group" >
                { 
                suggestions.map((_, index) => (
                        <li
                            className={`flex items-cente rp-1  list-group-item ` + (selectedIndex === index && "bg-primary text-white")}
                            key={index}
                         
                        >
                            <div className="flex items-center space-x-1">
                               
                                <div>{getHighlightedText(suggestions[index].text,bindInput.value)}</div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}