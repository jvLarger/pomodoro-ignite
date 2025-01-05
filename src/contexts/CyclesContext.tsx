import { createContext, ReactNode, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducers } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (cycle:CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode;
}

export function CyclesContextProvider({children} : CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(
        cyclesReducers, {
        cycles: [],
        activeCycleId: null,
    }, () => {
        const storedStateAsJSON = localStorage.getItem("@pomodoro-ignite:cycles-state-1.0.0");
        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON);
        }
    });
    
    const { cycles, activeCycleId} = cyclesState;        
    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        
        if (activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
        }

        return 0;
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);
        localStorage.setItem("@pomodoro-ignite:cycles-state-1.0.0", stateJSON);
    }, [cyclesState]);

    
    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinished());  
    }

    function createNewCycle(data: CreateCycleData) {
       
        const newCycle: Cycle = {
          id: String(new Date().getTime()),
          task: data.task,
          minutesAmount: data.minutesAmount,
          startDate: new Date(),
        };
    
        dispatch(addNewCycleAction(newCycle));  
    
        setAmountSecondsPassed(0);
    
    }
    
    function interruptCurrentCycle() {
        
        dispatch(interruptCurrentCycleAction());  

    }

    return (
        <CyclesContext.Provider value={{
            cycles,
            activeCycle, 
            activeCycleId, 
            amountSecondsPassed, 
            markCurrentCycleAsFinished, 
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
        }}>
            {children}
        </CyclesContext.Provider>
    );
}