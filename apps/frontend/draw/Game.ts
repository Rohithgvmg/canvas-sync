import { getExistingShapes } from "./http";

type Shape = {
    id:string;
    type:"rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id:string;
    type:"circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    id:string;
    type:"line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    id:string;
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

                      if (message.type === 'shape-delete') {
                const { id } = JSON.parse(message.message);
                this.existingShapes = this.existingShapes.filter(shape => shape.id !== id);
                this.clearCanvas();
            }
                    }
       }

       private pointToLineSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2;
        if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const nearestX = x1 + t * (x2 - x1);
        const nearestY = y1 + t * (y2 - y1);
        return Math.sqrt((px - nearestX) ** 2 + (py - nearestY) ** 2);
    }
        

    private getShapeAtPosition(x: number, y: number): Shape | undefined {
      
        for (let i = this.existingShapes.length - 1; i >= 0; i--) {
            const shape = this.existingShapes[i];
            const tolerance = 5; 
            let hit = false;

            if (shape.type === 'rect') {
                hit = (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height);
            } else if (shape.type === 'circle') {
                const distance = Math.sqrt((x - shape.centerX) ** 2 + (y - shape.centerY) ** 2);
                hit = distance <= shape.radius;
            } else if (shape.type === 'line') {
                hit = this.pointToLineSegmentDistance(x, y, shape.startX, shape.startY, shape.endX, shape.endY) < tolerance;
            } else if (shape.type === 'pencil') {
                for (let j = 0; j < shape.path.length - 1; j++) {
                    if (this.pointToLineSegmentDistance(x, y, shape.path[j].x, shape.path[j].y, shape.path[j + 1].x, shape.path[j + 1].y) < tolerance) {
                        hit = true;
                        break;
                    }
                }
            }
            if (hit) return shape;
        }
        return undefined;
    }

     private deleteShape(shapeId: string) {
        this.existingShapes = this.existingShapes.filter(s => s.id !== shapeId);
        this.socket.send(JSON.stringify({
            type: 'shape-delete', 
            roomId: this.roomId,
            message: JSON.stringify({ id: shapeId })
        }));
        this.clearCanvas();
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
                         const newId = `${Date.now()}-${Math.random()}`;
                        //@ts-ignore
                        const selectedTool=this.selectedTool;
                        if(selectedTool=="rect"){
                                shape={
                            id:newId,
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
                                id:newId,
                                type:"circle",
                                radius,
                                centerX,
                                centerY
                            }
                        } else if(selectedTool=="line"){
                               shape={
                                id:newId,
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
                                       id:newId,
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

                            if (this.selectedTool === 'eraser') {
                         const shapeToDelete = this.getShapeAtPosition(e.clientX, e.clientY);
                        if (shapeToDelete) {
                              this.deleteShape(shapeToDelete.id);
                        }
                         return; 
                         }


                       
                        if (this.selectedTool !== "pencil") {
                          this.clearCanvas(); 
                        }
                         const width=e.clientX-this.startX;
                        const height=e.clientY-this.startY;
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
