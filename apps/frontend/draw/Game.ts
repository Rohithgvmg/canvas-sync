import { getExistingShapes } from "./http";

type Shape = {
    type:"rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type:"circle";
    centerX: number;
    centerY: number;
    radius: number;
}

type Tool= "circle" | "pencil" | "rect";
export class Game{
       private canvas:HTMLCanvasElement;
       private ctx:CanvasRenderingContext2D;
       private existingShapes:Shape[];
       private roomId:string;
       private socket:WebSocket;
       private clicked:boolean;
       private startX=0;
       private startY=0;
       private selectedTool:Tool="circle";

       constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
        this.canvas=canvas;
        const ctx=canvas.getContext("2d")!;
        this.existingShapes=[];
        this.roomId=roomId;
        this.ctx=ctx;
        this.socket=socket;
        this.clicked=false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
       }

       async init(){
          this.existingShapes=await getExistingShapes(this.roomId);
          this.clearCanvas();
            
       }

       destroy(){
        this.canvas.removeEventListener("mousedown",this.mousedownHandler);
        this.canvas.removeEventListener("mouseup",this.mouseupHandler);
        this.canvas.removeEventListener("mousemove",this.mousemoveHandler);
             
       }

       setTool(tool:Tool){
            this.selectedTool=tool;

       }
       initHandlers(){
             this.socket.onmessage=(event)=>{
                          const message=JSON.parse(event.data);

                          if(message.type==="chat"){
                            const parsedShape=JSON.parse(message.message);
                            this.existingShapes.push(parsedShape.shape);
                            this.clearCanvas();
                     }
                    }
       }

       clearCanvas(){
               this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle="rgba(0,0,0)";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
         
        this.existingShapes.map((shape)=>{
            if(shape.type==="rect"){
                this.ctx.strokeStyle="rgba(255,255,255)";
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
            } else if(shape.type=="circle"){
                            this.ctx.beginPath();
                            this.ctx.arc(shape.centerX, shape.centerY,shape.radius, 0, Math.PI * 2);
                            this.ctx.stroke();
                            this.ctx.closePath();
            }
        })

       }

       mousedownHandler=(e:any)=>{
                        this.clicked=true;
                        this.startX=e.clientX;
                        this.startY=e.clientY;
                        
                    }

        mouseupHandler=(e:any)=>{
                      this.clicked=false;
                        const width=e.clientX-this.startX;
                        const height=e.clientY-this.startY;

                        let shape:Shape | null=null;
                        //@ts-ignore
                        const selectedTool=this.selectedTool;

                        

                        if(selectedTool=="rect"){
                                shape={
                            type:"rect",
                            x:this.startX,
                            y:this.startY,
                            width:width,
                            height:height
                        };

                        }else if(selectedTool=="circle"){
                            let radius=Math.max(Math.abs(e.clientX - this.startX), Math.abs(e.clientY - this.startY)) / 2;
                            let centerX=(this.startX + e.clientX) / 2;
                            let centerY=(this.startY + e.clientY) / 2;
                            shape={
                                type:"circle",
                                radius,
                                centerX,
                                centerY
                            }
                        }
                        if(!shape){
                            return;
                        }
                       
                        this.existingShapes.push(shape);
                        this.clearCanvas();

                        this.socket.send(

                            JSON.stringify({
                                type:"chat",
                                roomId:this.roomId,
                                message:JSON.stringify({shape})
                            })
                        );
        }

         mousemoveHandler=(e:any)=>{
                    if(this.clicked){
                            //  console.log(e.clientX+" "+e.clientY);
                        const width=e.clientX-this.startX;
                        const height=e.clientY-this.startY;
                        this.clearCanvas();
                        this.ctx.strokeStyle="rgba(255,255,255)";
                        //@ts-ignore
                        const selectedTool=this.selectedTool;
                        if(selectedTool === "rect"){
                                this.ctx.strokeRect(this.startX,this.startY,width,height);
                        }else if(selectedTool === "circle"){
                            const centerX=(this.startX + e.clientX) / 2;
                            const centerY=(this.startY + e.clientY) / 2;
                            const radius=Math.max(Math.abs(e.clientX - this.startX), Math.abs(e.clientY - this.startY)) / 2;
                            this.ctx.beginPath();
                            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                            this.ctx.stroke();
                            this.ctx.closePath();
                        }
}
         }


       initMouseHandlers(){
              this.canvas.addEventListener("mousedown",this.mousedownHandler);

            this.canvas.addEventListener("mouseup",this.mouseupHandler);


            this.canvas.addEventListener("mousemove",this.mousemoveHandler);

       }

}