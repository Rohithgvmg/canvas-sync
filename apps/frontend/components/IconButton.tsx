import { ReactNode } from "react";


export function IconButton({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return <div
  className={`pointer rounded-md border p-2 bg-black hover:bg-gray transform scale-75 ${
    activated ? "bg-red-400" : ""
  }`}
  onClick={onClick}
>
  {icon}
</div>
}
