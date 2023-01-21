import { useState } from 'react'

const KEY_CODES = {
    "DOWN": 40,
    "UP": 38,
    "PAGE_DOWN": 34,
    "ESCAPE": 27,
    "PAGE_UP": 33,
    "ENTER": 13,
}

export default function useAutoComplete({ source, onChange }) {
    
    const [myTimeout, setMyTimeOut] = useState(setTimeout(() => { }, 0))
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [textValue, setTextValue] = useState("")

    function delayInvoke(cb) {
        if (myTimeout) {
            clearTimeout(myTimeout)
        }
        setMyTimeOut(setTimeout(cb, 500));
    }

    function selectOption(index) {
        if (index > -1) {
            onChange(suggestions[index])
            setTextValue(suggestions[index].text)  
        }
        clearSuggestions()
    }

    async function getSuggestions(searchTerm) {
        if (searchTerm && source) {
            const options = await source(searchTerm)
          
            setSuggestions(options)
        }
    }

    function clearSuggestions() {
        setSuggestions([])
        setSelectedIndex(-1)
    }

    function onTextChange(searchTerm) {
       
        setTextValue(searchTerm)
        clearSuggestions();
        delayInvoke(() => {
            getSuggestions(searchTerm)
           
        });
    }


  

    function scrollUp() {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
        }
        else setSelectedIndex(suggestions.length - 1)
    }

    function scrollDown() {
        if (selectedIndex < suggestions.length - 1) {
            setSelectedIndex(selectedIndex + 1)
        }
       else setSelectedIndex(0)
    }

    function onKeyDown(e) {
        const keyOperation = {
            [KEY_CODES.DOWN]: scrollDown,
            [KEY_CODES.UP]: scrollUp,
            [KEY_CODES.ENTER]: () => selectOption(selectedIndex),
            [KEY_CODES.ESCAPE]: clearSuggestions,
        }
        if (keyOperation[e.keyCode]) {
            keyOperation[e.keyCode]()
        } else {
            setSelectedIndex(-1)
        }
    }

    return {
        bindInput: {
            value: textValue,
            onChange: e => {
                 onTextChange(e.target.value);
            },
            onKeyDown
        },
      
        suggestions,
        selectedIndex,
    }
}