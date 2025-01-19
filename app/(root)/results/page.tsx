'use client';

import ResultNo from '@/app/components/ResultNo';
import ResultYes from '@/app/components/ResultYes';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const Results = () => {
    const searchParams = useSearchParams();
    const diseaes = searchParams.get('result');
    const pass = searchParams.get('disease');
    //outer.push(`/results?result=${result}?disease=${disease}`);
    const[loading,setLoading] = useState(false);

    console.log('diseaes', diseaes, pass)


    const [disc, setDisc] = useState('');
    const [prevention, setPrevetion] = useState<string[]>([]);
    //const [other, setOther] = useState<Record<string, boolean> | null>(null);

    const displayResult = async () => {
        if (diseaes == 'No_Matching') {
            const res = 'No_Matching';
            updateAllergy(res);
        } else {
            const res = await fetch('http://127.0.0.1:5000/getpreventions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diseases: diseaes,
                    //predicted_disease : diseaes
                }),
            });
    
            const data = await res.json();
            console.log('data.description', data.description);
            setDisc(data.desc);
            setPrevetion(data.prevntion_list);
    
            // Ensure 'pass' is a string before calling updateAllergy
            if (pass) {
                updateAllergy(pass);  // Only call if 'pass' is not null
            } else {
                console.log('pass is null, skipping updateAllergy');
            }
    
            console.log('prevention', data.prevntion_list);
            setLoading(true);
        }
    };
    

    useEffect(() => {
        // Only runs on the client side
        //const savedDetails = JSON.parse(localStorage.getItem('details'));
        //setOther(savedDetails);

        displayResult();
    }, [displayResult]);

    const updateAllergy = (resl: string) => {  
        // Retrieve the current details from localStorage and ensure it's an object
        const savedDetails = JSON.parse(localStorage.getItem('details') || '{}');  // Default to '{}' if null
        
        if (resl === "No_Matching") {
            // Handle the case when resl is "No_Matching"
        } else {
            // Update the 'Allergy' value to false without losing other values
            savedDetails[resl] = false;
        }
    
        console.log('savedDetails', savedDetails, resl);
    
        // Save the updated details back to localStorage
        localStorage.setItem('details', JSON.stringify(savedDetails));
    
        // Update the state to reflect changes
        //setOther(savedDetails);
    };
    
    

    return (
        <div>
            {!loading ? (
                <>
                 {/* <div>
                {other && Object.entries(other).map(([key, value]) => (
                  <>
                    <p key={key} style={{ color: value ? 'green' : 'red' }}>
                        {key}: {value ? 'True' : 'False'}
                    </p>
                  </>
                ))}
            </div> */}
                <ResultNo pass={pass || ''} />
                </>
            ) : (
                <>
                

            {/* <div>
                {other && Object.entries(other).map(([key, value]) => (
                    <p key={key} style={{ color: value ? 'green' : 'red' }}>
                        {key}: {value ? 'True' : 'False'}
                    </p>
                ))}
            </div> */}
<ResultYes diseaes={[diseaes || '']} disc={disc} prevention={prevention} />

</>
            )}

            {/* <button onClick={updateAllergy}>Update Allergy to False</button> */}
        </div>
    );
};

export default Results;
