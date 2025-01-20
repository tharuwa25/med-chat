'use client';  // Add this line at the top

import { Suspense } from 'react';
import ResultNo from '@/app/components/ResultNo';
import ResultYes from '@/app/components/ResultYes';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const Results = () => {
    const searchParams = useSearchParams();
    const diseaes = searchParams.get('result');
    const pass = searchParams.get('disease');
    const [loading, setLoading] = useState(false);

    console.log('diseaes', diseaes, pass);

    const [disc, setDisc] = useState('');
    const [prevention, setPrevetion] = useState<string[]>([]);

    const displayResult = useCallback(async () => {
        if (diseaes === 'No_Matching') {
            const res = 'No_Matching';
            updateAllergy(res);
        } else {
            const res = await fetch('https://tharudila245.pythonanywhere.com/getpreventions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diseases: diseaes,
                }),
            });

            const data = await res.json();
            console.log('data.description', data.description);
            setDisc(data.desc);
            setPrevetion(data.prevntion_list);

            // Ensure 'pass' is a string before calling updateAllergy
            if (pass) {
                updateAllergy(pass);
            } else {
                console.log('pass is null, skipping updateAllergy');
            }

            console.log('prevention', data.prevntion_list);
            setLoading(true);
        }
    }, [diseaes, pass]);

    useEffect(() => {
        displayResult();
    }, [displayResult]);

    const updateAllergy = (resl: string) => {
        const savedDetails = JSON.parse(localStorage.getItem('details') || '{}');
        
        if (resl !== "No_Matching") {
            savedDetails[resl] = false;
        }

        console.log('savedDetails', savedDetails, resl);

        localStorage.setItem('details', JSON.stringify(savedDetails));
    };

    return (
        <div>
            {!loading ? (
                <>
                    <ResultNo pass={pass || ''} />
                </>
            ) : (
                <>
                    <ResultYes diseaes={[diseaes || '']} disc={disc} prevention={prevention} />
                </>
            )}
        </div>
    );
};

// Wrap the Results component in Suspense to handle async hooks
const ResultsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Results />
  </Suspense>
);

export default ResultsPage;
