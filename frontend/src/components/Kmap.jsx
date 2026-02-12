import React from 'react'

const Kmap = ({dont_cares, form, num_var, terms, groupings}) => {

    

    console.log(groupings)

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

    const varPrint = {
        2: "A\\B",
        3: "A\\BC",
        4: "AB\\CD"
    }

    const rowCount = num_var === 4 ? 4 : 2;
    const colCount = num_var === 2 ? 2 : 4;

    const twos = ["0", "1"];
    const fours = ["00", "01", "11", "10"];

    const outerColumns = [varPrint[num_var]].concat((num_var == 3 || num_var == 4) ? fours : twos);
    const outerRows = (num_var == 2 || num_var == 3) ? twos : fours;


    const generateValueMatrix = ( dont_cares, form, num_var, terms ) => {
        const components = [];
        const newForm = [];
        const newDontCares = [];
        const mainVal = form === "min" ? "1" : "0";
        const otherVal = form === "min" ? "0" : "1";

        for (const term of terms){
            const binaryTerm = (term).toString(2).padStart(num_var, '0');
            const daRows = binaryTerm.substring(0, rowCount / 2);
            const daColumns = binaryTerm.substring(rowCount/2, rowCount/2 + colCount/2);
            const indexRow = outerRows.indexOf(daRows);
            const indexCol = outerColumns.slice(1,).indexOf(daColumns);
            newForm.push((indexRow * (colCount) + indexCol))
            
        }

        for (const term of dont_cares){
            const binaryTerm = (term).toString(2).padStart(num_var, '0');
            const daRows = binaryTerm.substring(0, rowCount / 2);
            const daColumns = binaryTerm.substring(rowCount/2, rowCount/2 + colCount/2);
            const indexRow = outerRows.indexOf(daRows);
            const indexCol = outerColumns.slice(1,).indexOf(daColumns);
            newDontCares.push((indexRow * (colCount) + indexCol))
            
        }
        // console.log(newForm);

        for (let i = 0; i < 2 ** num_var; i++) {
            const val = newDontCares.includes(i) ? "x" : newForm.includes(i) ? mainVal : otherVal;

            components.push(
            <div key={i} className="border aspect-square bg-amber-100 rounded flex justify-center items-center text-2xl">
                <span>{val}</span>
            </div>
            );
        }

        return components;
    };

    

    
    

    

    const renderGroups = () => {
        if (!groupings) return  null;

        return groupings.map((group, i) => {
            console.log("row-start-" + String(group[3] + 1) + " col-start-"+ String(group[4] + 1) + " col-span-"+String(group[6]) + " row-span-"+String(group[5]));
            const colors = [
    "59,130,246",   // blue-500
    "239,68,68",    // red-500
    // "234,179,8",    // yellow-500
    // "249,115,22",   // orange-500
    "245,158,11",   // amber-500
    "45,212,191",   // teal-ish mint
  ];
            // console.log(colors[group[0] % colors.length])
            // console.log(<div className={`border-4 border-${colors[group[0] % colors.length]}-500 col-start-${group[4]+1} row-start-${group[3]+1} row-span-${group[5]} col-span-${group[6]}`}/>)
            // return (
            //     <div className={`border-4 border-${colors[group[0] % colors.length]}-500 col-start-${group[4]+1} row-start-${group[3]+1} row-span-${group[5]} col-span-${group[6]}`}/>
            // )
            const color = colors[group[0] % colors.length];
            return (
            <div
                key={i}
                className="border-4"
                style={{
                backgroundColor: `rgba(${color}, 0.3)`,
                borderColor: `rgba(${color})`,
                gridColumnStart: group[4] + 1,
                gridRowStart: group[3] + 1,
                gridColumnEnd: `span ${group[6]}`,
                gridRowEnd: `span ${group[5]}`,
                }}
            />)
        })
    }
    


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
                    <div className={`grid relative ${generateInnerMatrix[num_var]} h-full w-full gap-1`}>
                       {generateValueMatrix(dont_cares, form, num_var, terms)}
                       <div className={`absolute inset-0 pointer-events-none grid ${generateInnerMatrix[num_var]}`}>
                        {renderGroups()}

                        </div>           
                    </div>
                </div>
            </div>
          

        </div>
    )
}

export default Kmap