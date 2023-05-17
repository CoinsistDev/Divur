import { useLocation } from "react-router-dom";

export default function useQurey(){
    return new URLSearchParams(useLocation().search);
}