import ResultNo from "@/app/components/ResultNo";
import ResultYes from "@/app/components/ResultYes";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Results = () => {

    const searchParams = useSearchParams();
    const diseaes = searchParams.get('result');
    const pass = searchParams.get('disease');

    const[loading, setLoading] = useState(false);
    const [disc, setDisc] = useState('');
    const [prevention, setPrevetion] = useState<string[]>([]);

    const displayResult = async () => {
        if(diseaes == 'No_Mathcing'){
            const res = 'No_Matching'
            updateAllergy(res)
        }else{
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
            setDisc(data.desc);
            setPrevetion(data.prevntion_list);
            updateAllergy(pass);
            setLoading(true)
        }
    }

    useEffect(() => {
        const savedDetails = JSON.parse(localStorage.getItem('details'));
        displayResult();
    })

    const  updateAllergy = (resl) => {
        const savedDetails= JSON.parse(localStorage.getItem('details')) || {};

        if(resl = "No_Matching"){

        }else{
            savedDetails[resl] = false;
        }

        localStorage.setItem('details', JSON.stringify(savedDetails));

        

    };

    return(
        <div>
            {!loading ? (
                <ResultNo pass={pass}/>
            ) : (
              <ResultYes diseaes={diseaes} disc={disc} prevention={prevention}/>  
            )}
        </div>
    )

};
export default Results;