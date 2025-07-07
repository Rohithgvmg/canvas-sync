import { ReactNode } from "react";


export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return <div className={`m-1 pointer rounded-md border p-2 bg-black hover:bg-gray ${activated ? "bg-red-400" : ""}`} onClick={onClick}>
        {icon}
    </div>
}