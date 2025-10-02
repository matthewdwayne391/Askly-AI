import { createContext, useContext, useState } from 'react';

interface ModelContextType {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelContext = createContext({} as ModelContextType);

export const ModelProvider = (props: { children: React.ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {props.children}
    </ModelContext.Provider>
  );
};

export const useModel = () => {
  return useContext(ModelContext);
};
