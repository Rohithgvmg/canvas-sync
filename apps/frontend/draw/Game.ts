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
} | {
    type:"line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type:"pencil";
    path:{x:number;y:number}[];
}

type Tool= "circle" | "line" | "rect" | "pencil"|"eraser";
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
       private path:{x:number;y:number}[];

       constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
        this.canvas=canvas;
        const ctx=canvas.getContext("2d")!;
        this.existingShapes=[];
        this.roomId=roomId;
        this.ctx=ctx;
        this.socket=socket;
        this.clicked=false;
        this.path=[];
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
                            // if external message of some shape comes, it adds it to existing shapes array and repaints everything
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
            } else if(shape.type=="line"){
                   this.ctx.beginPath();
                   this.ctx.moveTo(shape.startX,shape.startY);
                   this.ctx.lineTo(shape.endX,shape.endY);
                   this.ctx.stroke();
                   this.ctx.closePath();
            } else if(shape.type=="pencil"){
                   this.ctx.beginPath();
                   if(shape.path.length>0){
                         this.ctx.moveTo(shape.path[0].x,shape.path[0].y);
                         for(let i=1;i<shape.path.length;i++){
                         this.ctx.lineTo(shape.path[i].x,shape.path[i].y);
                          }
                   this.ctx.stroke();
                   }
                    this.ctx.closePath();
            }
        })
       }

       mousedownHandler=(e:any)=>{
                        this.clicked=true;
                        this.startX=e.clientX;
                        this.startY=e.clientY; 
                        if(this.selectedTool=="pencil"){
                             this.path.push({x:this.startX,y:this.startY});
                             this.ctx.beginPath();
                             this.ctx.moveTo(this.startX, this.startY);
                        }
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
                        } else if(selectedTool=="line"){
                               shape={
                                    type:"line",
                                    startX:this.startX,
                                    startY:this.startY,
                                    endX:e.clientX,
                                    endY:e.clientY
                               }
                        } else if(selectedTool=="pencil"){
                            this.ctx.closePath();
                               if(this.path.length>1){
                                   shape={
                                        type:"pencil",
                                        path:this.path
                                   }
                               }
                            this.path=[];
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
                        if (this.selectedTool !== "pencil") {
                          this.clearCanvas(); 
}
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
                        } else if(selectedTool==="line"){
                            this.ctx.beginPath();
                            this.ctx.moveTo(this.startX, this.startY);
                            this.ctx.lineTo(e.clientX, e.clientY);
                            this.ctx.stroke();
                            this.ctx.closePath();
                        } else if(selectedTool ==="pencil"){
                            this.path.push({x:e.clientX,y:e.clientY});
                            this.ctx.lineTo(e.clientX,e.clientY);
                            this.ctx.stroke();
                        }

}
         }


       initMouseHandlers(){
              this.canvas.addEventListener("mousedown",this.mousedownHandler);
            this.canvas.addEventListener("mouseup",this.mouseupHandler);
            this.canvas.addEventListener("mousemove",this.mousemoveHandler);

       }

}
