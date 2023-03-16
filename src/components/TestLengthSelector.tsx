import React from "react"


interface IProps {
    testLength: number,
    setTestLength: (prop: number) => void
}

const TestLengthSelector = ({testLength, setTestLength}: IProps) => {
    const testLengthWords: number[] = [5, 25, 50, 100]
    
    //TODO: add a timer before trying to implement this
    const testLengthSeconds: number[] = [15, 30, 60]

    const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setTestLength(parseInt(event.target.value))
    }

    const renderOptions = () => {
        return (
           <>
                Words:
                {testLengthWords.map(length => {
                    return (
                        <label>
                            {length}
                            <input
                            type="radio"
                            value={length}
                            checked={testLength===length}
                            onChange={handleOptionChange}
                            />
                        </label>
                    )
                })}
           </>
        )
    }

    return (
        <div>
           {renderOptions()}
        </div>
      
    )

}

export default TestLengthSelector