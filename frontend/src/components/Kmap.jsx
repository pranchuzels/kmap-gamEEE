import React from 'react'

const Kmap = ({dont_cares, form, num_var, terms, groupings, globalState}) => {

    // console.log(groupings)

    const sizeMap = {
        5: "grid grid-cols-2 gap-6",
        6: "grid grid-cols-[8%_92%] grid-rows-[8%_92%] gap-4"
    }

    const sizeMapa = {
        5: "col-span-2 inline-grid grid-cols-2 grid-rows-1 gap-6",
        6: "inline-grid grid-cols-2 grid-rows-2 gap-6"
    }

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
        2: "B\\A",
        3: "C\\AB",
        4: "CD\\AB",
        5: "DE\\BC",
        6: "EF\\CD"
    }

    const borderOpts = {
        0: [""],
        1: ["border-l-0", "border-r-0"],
        2: ["border-t-0", "border-b-0"],
        3: ["border-b-0 border-r-0", "border-b-0 border-l-0", "border-t-0 border-r-0","border-t-0 border-l-0"],
    }

    const rowCount = (num_var === 4 || num_var === 5 || num_var === 6) ? 4 : 2;
    const colCount = num_var === 2 ? 2 : 4;

    const twos = ["0", "1"];
    const fours = ["00", "01", "11", "10"];

    const outerColumns = [varPrint[num_var]].concat((num_var == 3 || num_var == 4 || num_var == 5 || num_var == 6) ? fours : twos);
    const outerRows = (num_var == 2 || num_var == 3) ? twos : fours;


    const generateValueMatrix = ( dont_cares, form, num_var, terms ) => {
        const components = [];
        const newForm = [];
        const newDontCares = [];
        const mainVal = form === "min" ? "1" : "0";
        const otherVal = form === "min" ? "0" : "1";
        // console.log(terms)

        for (const term of terms){
            const binaryTerm = (term % 16).toString(2).padStart(Math.min(num_var, 4), '0');
            const daRows = binaryTerm.substring(0, rowCount / 2);
            const daColumns = binaryTerm.substring(rowCount/2, rowCount/2 + colCount/2);
            const indexRow = outerRows.indexOf(daRows);
            const indexCol = outerColumns.slice(1,).indexOf(daColumns);
            newForm.push((indexRow * (colCount) + indexCol))
            
        }

        for (const term of dont_cares){
            const binaryTerm = (term % 16).toString(2).padStart(Math.min(num_var, 4), '0');
            const daRows = binaryTerm.substring(0, rowCount / 2);
            const daColumns = binaryTerm.substring(rowCount/2, rowCount/2 + colCount/2);
            const indexRow = outerRows.indexOf(daRows);
            const indexCol = outerColumns.slice(1,).indexOf(daColumns);
            newDontCares.push((indexRow * (colCount) + indexCol))
            
        }

        for (let i = 0; i < Math.min(2 ** num_var, 16); i++) {
            const val = newDontCares.includes(i) ? "x" : newForm.includes(i) ? mainVal : otherVal;

            components.push(
            <div 
                key={i} 
                className="border-2 border-slate-600 aspect-square bg-slate-800/50 backdrop-blur-sm rounded-lg flex justify-center items-center text-2xl shadow-lg hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-200"
            >
                <span className={val === "1" ? "text-cyan-300" : val === "0" ? "text-slate-300" : "text-amber-100"}>
                    {val}
                </span>
            </div>
            );
        }

        return components;
    };

    const renderGroups = (groupings) => {
        if (!groupings) return  null;

        return groupings.map((group, i) => {
            const colors = [
                "59,130,246",   // Blue
                "239,68,68",    // Red
                "245,158,11",   // Amber
                "45,212,191",   // Teal
                "168,85,247",   // Purple
                "16,185,129",   // Green
                "249,115,22",   // Orange
                "14,165,233",   // Sky
                "236,72,153",   // Pink
                "251,191,36",   // Yellow
                "34,197,94",    // Emerald
                "132,204,22",   // Lime
            ];

            const color = colors[group[0] % colors.length];
            return (
            <div
                key={i}
                className={`border-[3px] rounded-xl ${borderOpts[group[1]][group[2]]}`}
                style={{
                    backgroundColor: `rgba(${color}, 0.15)`,
                    borderColor: `rgb(${color})`,
                    gridColumnStart: group[4] + 1,
                    gridRowStart: group[3] + 1,
                    gridColumnEnd: `span ${group[6]}`,
                    gridRowEnd: `span ${group[5]}`,
                    boxShadow: `0 0 20px rgba(${color}, 0.3), inset 0 0 20px rgba(${color}, 0.1)`
                }}
            />)
        })
    }

   const renderWholeMatrix = () => {
        const matrices = [];

        const layerCount = (num_var === 6 ? 4 : num_var === 5 ? 2 : 1);

        for (let layeridx = 0; layeridx < layerCount; layeridx++) {
            matrices.push(
                <div key={layeridx} className={`grid ${generateMatrix[num_var] ?? generateMatrix[4]} w-auto h-auto gap-2`}>
                    <div className={`${generateOuterColumn[num_var] ?? generateOuterColumn[4]}`}>
                        <div className={`grid ${generateInnerOuterColumn[num_var] ?? generateInnerOuterColumn[4]} gap-2 h-full w-full`}>
                            {outerColumns.map((vale, idx) => (
                                <div 
                                    key={idx} 
                                    className='border-2 border-cyan-500/40 aspect-square bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur rounded-lg flex justify-center items-center text-xl font-bold text-cyan-300 shadow-lg shadow-cyan-500/20'
                                >
                                    {vale}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`${generateOuterRow[num_var] ?? generateOuterRow[4]}`}>
                        <div className={`grid ${generateInnerOuterRow[num_var] ?? generateInnerOuterRow[4]} gap-2 h-full w-full`}>
                            {outerRows.map((vale, idx) => (
                                <div 
                                    key={idx} 
                                    className='border-2 border-cyan-500/40 aspect-square bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur rounded-lg flex justify-center items-center text-xl font-bold text-cyan-300 shadow-lg shadow-cyan-500/20'
                                >
                                    {vale}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`${generateIExpandMatrix[num_var] ?? generateIExpandMatrix[4]}`}>
                        <div className={`grid relative ${generateInnerMatrix[num_var] ?? generateInnerMatrix[4]} h-full w-full gap-2`}>
                            {generateValueMatrix(
                                dont_cares.filter(value => value >= (16 * layeridx) && value < (16 * layeridx + 16)),
                                form,
                                num_var,
                                terms.filter(value => value >= (16 * layeridx) && value < (16 * layeridx + 16))
                            )}
                            { (globalState === 'show') &&
                            <div className={`absolute inset-0 pointer-events-none grid ${generateInnerMatrix[num_var] ?? generateInnerMatrix[4]} gap-2`}>
                                {renderGroups(groupings.filter(group => group[7] === layeridx))}
                            </div>
                            }
                        </div>
                    </div>
                </div>
            );
        }

        return matrices;
    };

    return (
        <div className='w-full max-w-7xl mx-auto p-8 transition-all duration-150'>
            <div className={`${sizeMap[num_var] ?? ""}`}>
                {(num_var == 6) &&
                <>
                    <div className='flex items-center justify-center text-lg font-bold text-cyan-300 bg-slate-800/60 backdrop-blur rounded-xl shadow-lg border-2 border-cyan-500/30 p-3'>
                        B\A
                    </div>
                    <div className='bg-slate-800/60 backdrop-blur rounded-xl shadow-lg border-2 border-slate-700/50'>
                        <div className='grid grid-cols-2 justify-items-center gap-4'>
                            <div className='text-xl font-bold text-cyan-300 bg-cyan-900/30 px-6 py-2 rounded-lg border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20'>
                                0
                            </div>
                            <div className='text-xl font-bold text-cyan-300 bg-cyan-900/30 px-6 py-2 rounded-lg border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20'>
                                1
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-rows-2 gap-4 items-center bg-slate-800/60 backdrop-blur rounded-xl shadow-lg border-2 border-slate-700/50'>
                        <div className='text-xl font-bold text-cyan-300 bg-cyan-900/30 px-4 py-3 rounded-lg border-2 border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20'>
                            0
                        </div>
                        <div className='text-xl font-bold text-cyan-300 bg-cyan-900/30 px-4 py-3 rounded-lg border-2 border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20'>
                            1
                        </div>
                    </div>
                </>
                }
                {(num_var == 5) &&
                <>
                    <div className='flex items-center justify-center text-2xl font-bold text-cyan-300 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 backdrop-blur rounded-xl shadow-lg border-2 border-cyan-500/30 p-4'>
                        A=0
                    </div>
                    <div className='flex items-center justify-center text-2xl font-bold text-cyan-300 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur rounded-xl shadow-lg border-2 border-cyan-500/30 p-4'>
                        A=1
                    </div>
                </>
                }
                <div className={`${sizeMapa[num_var] ?? ""}`}>
                    {renderWholeMatrix()}
                </div>
            </div>
        </div>
    )
}

export default Kmap