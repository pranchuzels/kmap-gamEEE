import React from 'react'

const Kmap = ({dont_cares, form, num_var, terms}) => {

     const generateMatrix = {
        2: "grid-cols-3 grid-rows-3",
        3: "grid-cols-5 grid-rows-3",
        4: "grid-cols-5 grid-cols-5"
    }

    const generateOuterColumn = {
        2: "col-span-3",
        3: "col-span-5",
        4: "col-span-5"
    }

    const generateInnerOuterColumn = {
        2: "grid-cols-3",
        3: "grid-cols-5",
        4: "grid-cols-5",
    }

    const generateOuterRow = {
        2: "row-span-2",
        3: "row-span-2",
        4: "row-span-4"
    }

    const generateInnerOuterRow = {
        2: "grid-rows-2",
        3: "grid-rows-2",
        4: "grid-rows-4",
    }

    const generateIExpandMatrix = {
        2: "col-span-2 row-span-2",
        3: "col-span-4 row-span-2",
        4: "col-span-4 row-span-4"
    }

    const generateInnerMatrix = {
        2: "grid-cols-2 grid-rows-2",
        3: "grid-cols-4 grid-rows-2",
        4: "grid-cols-4 grid-rows-4"
    }


    const generateValueMatrix = ( dont_cares, form, num_var, terms ) => {
        const components = [];
        const mainVal = form === "min" ? "1" : "0";
        const otherVal = form === "min" ? "0" : "1";

        for (let i = 0; i < 2 ** num_var; i++) {
            const val = dont_cares.includes(i) ? "x" : terms.includes(i) ? mainVal : otherVal;

            components.push(
            <div key={i} className="border aspect-square bg-amber-300 rounded flex justify-center items-center text-2xl">
                <span>{val}</span>
            </div>
            );
        }

        return components;
    };

    const twos = [0, 1];
    const fours = ["00", "01", "11", "10"];

    const varPrint = {
        2: "A\\B",
        3: "A\\BC",
        4: "AB\\CD"
    }
    const outerColumns = [varPrint[num_var]].concat((num_var == 3 || num_var == 4) ? fours : twos);
    const outerRows = (num_var == 2 || num_var == 3) ? twos : fours;
    


    return (
        <div>
            <div className={`grid ${generateMatrix[num_var]} w-100 h-auto gap-1`}>
                <div className={`${generateOuterColumn[num_var]}  `}>
                    <div className={`grid ${generateInnerOuterColumn[num_var]} gap-1 h-full w-full `}>
                    {outerColumns.map((vale, i) => (
                        <a key={i} className='border aspect-square bg-amber-400 rounded flex justify-center items-center text-2xl'>{vale}</a>
                    ))}
                   </div>
                </div>
                <div className={`${generateOuterRow[num_var]} `}>
                    <div className={`grid ${generateInnerOuterRow[num_var]} gap-1 h-full w-full`}>
                    {outerRows.map((vale, i) => (
                        <a key={i} className='border aspect-square bg-amber-400 rounded flex justify-center items-center text-2xl'>{vale}</a>
                    ))}
                   </div>
                </div>
                <div className={`${generateIExpandMatrix[num_var]} `}>
                    <div className={`grid ${generateInnerMatrix[num_var]} h-full w-full gap-1`}>
                       {generateValueMatrix(dont_cares, form, num_var, terms)}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Kmap