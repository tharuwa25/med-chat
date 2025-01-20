'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import intenseData from './intense.json';
import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group';

const MySymptoms = () => {
  const [disease, setDisease] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const symptomsData = intenseData.symptoms;
  const router = useRouter();

  useEffect(() => {
    const diseaseFromParams = searchParams.get('disease');
    if (diseaseFromParams) {
      setDisease(diseaseFromParams);
    }
  }, [searchParams]);

  const GetSymptoms = useCallback(async () => {
    if (disease) {
      const res = await fetch('https://tharudila245.pythonanywhere.com/get_illess_name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diseases_input: disease }),
      });
      const data = await res.json();
      setSymptoms(data.symptoms);
    }
  }, [disease]);

  useEffect(() => {
    if (disease) {
      GetSymptoms();
    }
  }, [disease, GetSymptoms]);

  const handleToggle = (symptom: string) => {
    setSelectedSymptoms((prevSelected) =>
      prevSelected.includes(symptom)
        ? prevSelected.filter((s) => s !== symptom)
        : [...prevSelected, symptom]
    );
  };

  const handleSubmit = async () => {
    const cleanedSymptoms = selectedSymptoms.join(", ");
    const res = await fetch('https://tharudila245.pythonanywhere.com/predictthediseases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms: cleanedSymptoms }),
    });
    const data = await res.json();
    handleResultPage(data.predicted_disease, disease || 'Unknown Disease');
  };

  const handleResultPage = (result: string, disease: string) => {
    router.push(`/results?result=${result}&disease=${disease}`);
  };

  const getSymptomDescription = (symptom: string) => {
    const symptomData = symptomsData.find((item) => item.name === symptom);
    return symptomData ? symptomData.description : "Description not available.";
  };

  if (!disease) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-bgColor-700 h-screen py-16">
      <div className="bg-white p-6 m-4 rounded-lg">
        <h1 className="text-3xl font-bold text-center mt-8 mb-5">
          Let us check if you have: {disease}
        </h1>
        <h4 className="text-xl font-bold text-center mt-8 mb-16">
          Click all the symptoms that you experience right now
        </h4>

        <ToggleGroup type="multiple" className="mt-6 grid grid-cols-5 gap-4 items-center">
          {symptoms.map((symptom) => (
            <ToggleGroupItem key={symptom} value={symptom} className="mb-8">
              <div className="relative">
                <button
                  className={`bg-blue-500 text-white p-4 text-xl border-r-2 rounded-xl hover:text-white ${
                    selectedSymptoms.includes(symptom) ? 'bg-blue-950 text-white' : ''
                  }`}
                  onClick={() => handleToggle(symptom)}
                >
                  {symptom.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
                </button>
                <div className="w-60 absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-x p-2 rounded-md">
                  {getSymptomDescription(symptom)}
                </div>
              </div>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex justify-center w-full mt-8">
          <button
            onClick={handleSubmit}
            className="text-xl mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-10 rounded"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrap the page component with Suspense
const MySymptomsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MySymptoms />
  </Suspense>
);

export default MySymptomsPage;
