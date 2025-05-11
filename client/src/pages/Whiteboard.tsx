import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Point = {
  x: number;
  y: number;
};

type DrawingPath = {
  points: Point[];
  color: string;
  width: number;
  type: 'pen' | 'eraser';
};

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [history, setHistory] = useState<DrawingPath[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingPath[][]>([]);

  // Colors for the color picker
  const colors = [
    "#000000", // Black
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      // Redraw everything after resize
      drawPaths(ctx, paths);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [paths]);

  useEffect(() => {
    // Redraw the canvas whenever paths change
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawPaths(ctx, paths);
  }, [paths]);

  const drawPaths = (ctx: CanvasRenderingContext2D, pathsToDraw: DrawingPath[]) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw all paths
    pathsToDraw.forEach(path => {
      if (path.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }

      ctx.strokeStyle = path.type === 'eraser' ? '#FFFFFF' : path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    let x, y;
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      const rect = canvas.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return { x, y };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    
    const newPath: DrawingPath = {
      points: [coords],
      color: color,
      width: strokeWidth,
      type: tool
    };
    
    setCurrentPath(newPath);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentPath) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    // Update the current path with the new point
    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, coords]
    };
    
    setCurrentPath(updatedPath);
    
    // Draw the current stroke
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw all existing paths
    drawPaths(ctx, paths);
    
    // Draw the current path
    ctx.beginPath();
    ctx.moveTo(updatedPath.points[0].x, updatedPath.points[0].y);
    
    for (let i = 1; i < updatedPath.points.length; i++) {
      ctx.lineTo(updatedPath.points[i].x, updatedPath.points[i].y);
    }
    
    ctx.strokeStyle = updatedPath.type === 'eraser' ? '#FFFFFF' : updatedPath.color;
    ctx.lineWidth = updatedPath.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentPath) return;
    
    // Add the completed path to the paths array
    const newPaths = [...paths, currentPath];
    setPaths(newPaths);
    
    // Add to undo history
    setHistory([...history, paths]);
    setRedoStack([]);
    
    // Reset the current path
    setCurrentPath(null);
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (paths.length === 0) return;
    
    // Add current state to history before clearing
    setHistory([...history, paths]);
    setRedoStack([]);
    setPaths([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    // Get the last state from history
    const lastState = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    
    // Add current state to redo stack
    setRedoStack([...redoStack, paths]);
    
    // Restore the last state
    setPaths(lastState);
    setHistory(newHistory);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    // Get the last state from redo stack
    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, redoStack.length - 1);
    
    // Add current state to history
    setHistory([...history, paths]);
    
    // Restore the next state
    setPaths(nextState);
    setRedoStack(newRedoStack);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Interactive Whiteboard</h1>
        <p className="text-neutral-dark">
          Use this whiteboard to sketch out ideas, teach concepts, or collaborate with others.
        </p>
        
        {/* Toolbar */}
        <div className="bg-white p-4 border rounded-md shadow-sm flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setTool('pen')}
              variant={tool === 'pen' ? 'default' : 'outline'}
              className={tool === 'pen' ? 'bg-primary text-white' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <path d="M11 11l2 2"></path>
              </svg>
              Pen
            </Button>
            
            <Button 
              onClick={() => setTool('eraser')}
              variant={tool === 'eraser' ? 'default' : 'outline'}
              className={tool === 'eraser' ? 'bg-primary text-white' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <path d="M15.5 2H18a2 2 0 0 1 2 2v2.5"></path>
                <path d="M22 14L21 13"></path>
                <path d="m16 6 6 6"></path>
                <path d="m8 16 4-4"></path>
              </svg>
              Eraser
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-dark">Color:</span>
            <div className="flex items-center space-x-1">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-neutral-dark' : 'border-gray-200'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 min-w-[180px]">
            <span className="text-sm text-neutral-dark">Width:</span>
            <Slider
              value={[strokeWidth]}
              min={1}
              max={20}
              step={1}
              onValueChange={(value) => setStrokeWidth(value[0])}
              className="w-24"
            />
            <span className="text-sm text-neutral-dark">{strokeWidth}px</span>
          </div>
          
          <div className="flex-grow"></div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={handleUndo} variant="outline" disabled={history.length === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6"></path>
                <path d="M21 17a9 9 0 0 0-9-9H3"></path>
              </svg>
              <span className="sr-only">Undo</span>
            </Button>
            
            <Button onClick={handleRedo} variant="outline" disabled={redoStack.length === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 7v6h-6"></path>
                <path d="M3 17a9 9 0 0 1 9-9h9"></path>
              </svg>
              <span className="sr-only">Redo</span>
            </Button>
            
            <Button onClick={handleClear} variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16"></path>
                <path d="M6 8l.99 12h10.02L18 8"></path>
                <path d="M9 6V4h6v2"></path>
              </svg>
              <span className="sr-only">Clear</span>
            </Button>
            
            <Button onClick={handleSave} variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span className="sr-only">Save</span>
            </Button>
          </div>
        </div>
        
        {/* Canvas Container */}
        <div className="relative bg-white border rounded-md shadow-sm w-full" style={{ height: '70vh' }}>
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />
        </div>
        
        <div className="text-sm text-neutral-mid">
          <p>Tip: Use the pen tool to draw and the eraser to remove mistakes. You can adjust the color and line width using the controls above.</p>
        </div>
      </div>
    </div>
  );
}