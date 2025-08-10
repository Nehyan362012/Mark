import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DrawingCanvasModalProps } from '../types';
import { ICONS } from '../constants';

export const DrawingCanvasModal: React.FC<DrawingCanvasModalProps> = ({ isOpen, onClose, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#0F172A');
    const [lineWidth, setLineWidth] = useState(3);

    const getContext = () => canvasRef.current?.getContext('2d');

    useEffect(() => {
        if (isOpen) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    }, [isOpen]);

    const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        if ('touches' in e.nativeEvent) {
            return {
                x: e.nativeEvent.touches[0].clientX - rect.left,
                y: e.nativeEvent.touches[0].clientY - rect.top,
            };
        }
        const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
        return { 
            x: mouseEvent.clientX - rect.left, 
            y: mouseEvent.clientY - rect.top 
        };
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const ctx = getContext();
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = getContext();
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = getContext();
        if (!ctx) return;
        ctx.closePath();
        setIsDrawing(false);
    };
    
    const handleSave = () => {
        const canvas = canvasRef.current;
        if (canvas) onSave(canvas.toDataURL('image/png'));
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[4000] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl p-6 w-full max-w-2xl animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create a Diagram</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">{ICONS.close}</button>
                </div>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="bg-white rounded-lg cursor-crosshair border border-border-light"
                />
                <div className="flex items-center justify-between mt-4">
                     <div className="flex items-center gap-4">
                        <button type="button" onClick={clearCanvas} className="px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Clear</button>
                     </div>
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                        <button type="button" onClick={handleSave} className="px-4 py-2 rounded-lg font-semibold text-white bg-primary-light dark:bg-primary-dark transition-colors">Save & Insert</button>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal-container')!
    );
};