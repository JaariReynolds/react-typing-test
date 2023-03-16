import React from "react"

interface IProps {
    numbers: boolean,
    setNumbers: (prop: boolean) => void
}

const NumberSelector = ({numbers, setNumbers}: IProps) => {

    const renderOptions = () => {
        return (
            <>
                <label>
                    Numbers:
                    <input
                        type="checkbox"
                        checked={numbers}
                        onChange={() => setNumbers(!numbers)} 
                    />
                </label>
            </>
        )
    }
    return (
        <div>
            {renderOptions()}
        </div>
    )
}

export default NumberSelector