import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, FabricText, FabricImage, Shadow } from "fabric";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ImagePlus,
  Type,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eraser,
  Plus,
  Minus,
} from "lucide-react";
import { removeBackground } from "@/lib/imageProcessing";
import { toast } from "sonner";

interface CanvasEditorProps {
  initialImage?: string;
  initialTitle?: string;
  initialContent?: string;
  format: string;
  onSave?: (dataUrl: string) => void;
}

const FORMAT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "1:1": { width: 600, height: 600 },
  "4:5": { width: 480, height: 600 },
  "9:16": { width: 337, height: 600 },
  "16:9": { width: 600, height: 337 },
  "3:4": { width: 450, height: 600 },
};

export function CanvasEditor({
  initialImage,
  initialTitle,
  initialContent,
  format,
  onSave,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [fontSize, setFontSize] = useState([32]);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [padding, setPadding] = useState([20]);
  const [removingBg, setRemovingBg] = useState(false);

  const dimensions = FORMAT_DIMENSIONS[format] || FORMAT_DIMENSIONS["1:1"];

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: "#1a1a2e",
      selection: true,
    });

    canvas.on("selection:created", (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on("selection:updated", (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    setFabricCanvas(canvas);

    // Add initial background if provided
    if (initialImage) {
      FabricImage.fromURL(initialImage, { crossOrigin: "anonymous" }).then((img) => {
        img.scaleToWidth(dimensions.width);
        img.set({
          left: 0,
          top: 0,
          selectable: true,
          evented: true,
        });
        canvas.add(img);
        canvas.sendObjectToBack(img);
        canvas.renderAll();
      });
    }

    // Add initial texts
    if (initialTitle) {
      const title = new FabricText(initialTitle, {
        left: dimensions.width / 2,
        top: dimensions.height / 3,
        fontSize: 36,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#ffffff",
        textAlign: "center",
        originX: "center",
        originY: "center",
        shadow: new Shadow({ color: "rgba(0,0,0,0.5)", blur: 4, offsetX: 2, offsetY: 2 }),
      });
      canvas.add(title);
    }

    if (initialContent) {
      const content = new FabricText(initialContent, {
        left: dimensions.width / 2,
        top: dimensions.height / 2,
        fontSize: 20,
        fontFamily: "Inter",
        fill: "#ffffff",
        textAlign: "center",
        originX: "center",
        originY: "center",
        shadow: new Shadow({ color: "rgba(0,0,0,0.5)", blur: 3, offsetX: 1, offsetY: 1 }),
      });
      canvas.add(content);
    }

    canvas.renderAll();

    return () => {
      canvas.dispose();
    };
  }, [format]);

  // Add text element
  const addText = useCallback(() => {
    if (!fabricCanvas) return;

    const text = new FabricText("Clique para editar", {
      left: dimensions.width / 2,
      top: dimensions.height / 2,
      fontSize: fontSize[0],
      fontFamily: "Inter",
      fill: "#ffffff",
      textAlign: textAlign,
      originX: "center",
      originY: "center",
      shadow: new Shadow({ color: "rgba(0,0,0,0.5)", blur: 4, offsetX: 2, offsetY: 2 }),
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  }, [fabricCanvas, fontSize, textAlign, dimensions]);

  // Add background image
  const addBackgroundImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!fabricCanvas || !e.target.files?.[0]) return;

      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        FabricImage.fromURL(dataUrl).then((img) => {
          img.scaleToWidth(dimensions.width);
          img.set({
            left: 0,
            top: 0,
            selectable: true,
            evented: true,
          });
          fabricCanvas.add(img);
          fabricCanvas.sendObjectToBack(img);
          fabricCanvas.renderAll();
          toast.success("Imagem adicionada!");
        });
      };
      reader.readAsDataURL(file);
    },
    [fabricCanvas, dimensions]
  );

  // Add object/element
  const addElement = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!fabricCanvas || !e.target.files?.[0]) return;

      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        FabricImage.fromURL(dataUrl).then((img) => {
          img.scaleToWidth(dimensions.width / 3);
          img.set({
            left: dimensions.width / 2,
            top: dimensions.height / 2,
            originX: "center",
            originY: "center",
          });
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          toast.success("Elemento adicionado!");
        });
      };
      reader.readAsDataURL(file);
    },
    [fabricCanvas, dimensions]
  );

  // Remove background from selected image
  const handleRemoveBackground = useCallback(async () => {
    if (!fabricCanvas || !selectedObject || selectedObject.type !== "image") {
      toast.error("Selecione uma imagem primeiro");
      return;
    }

    setRemovingBg(true);
    try {
      const imgElement = selectedObject.getElement() as HTMLImageElement;
      const blob = await removeBackground(imgElement);
      const url = URL.createObjectURL(blob);

      FabricImage.fromURL(url).then((newImg) => {
        newImg.set({
          left: selectedObject.left,
          top: selectedObject.top,
          scaleX: selectedObject.scaleX,
          scaleY: selectedObject.scaleY,
          originX: selectedObject.originX,
          originY: selectedObject.originY,
        });

        fabricCanvas.remove(selectedObject);
        fabricCanvas.add(newImg);
        fabricCanvas.setActiveObject(newImg);
        fabricCanvas.renderAll();
        toast.success("Fundo removido com sucesso!");
      });
    } catch (error) {
      console.error("Erro ao remover fundo:", error);
      toast.error("Erro ao remover fundo da imagem");
    } finally {
      setRemovingBg(false);
    }
  }, [fabricCanvas, selectedObject]);

  // Delete selected object
  const deleteSelected = useCallback(() => {
    if (!fabricCanvas || !selectedObject) return;
    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
    fabricCanvas.renderAll();
  }, [fabricCanvas, selectedObject]);

  // Update text properties
  const updateTextAlign = useCallback(
    (align: "left" | "center" | "right") => {
      setTextAlign(align);
      if (selectedObject && selectedObject.type === "text") {
        selectedObject.set("textAlign", align);
        fabricCanvas?.renderAll();
      }
    },
    [fabricCanvas, selectedObject]
  );

  const updateFontSize = useCallback(
    (value: number[]) => {
      setFontSize(value);
      if (selectedObject && selectedObject.type === "text") {
        selectedObject.set("fontSize", value[0]);
        fabricCanvas?.renderAll();
      }
    },
    [fabricCanvas, selectedObject]
  );

  // Scale selected object
  const scaleSelected = useCallback(
    (delta: number) => {
      if (!fabricCanvas || !selectedObject) return;
      const currentScale = selectedObject.scaleX || 1;
      const newScale = Math.max(0.1, currentScale + delta);
      selectedObject.set({
        scaleX: newScale,
        scaleY: newScale,
      });
      fabricCanvas.renderAll();
    },
    [fabricCanvas, selectedObject]
  );

  // Export canvas
  const exportCanvas = useCallback(() => {
    if (!fabricCanvas) return;
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 3,
    });
    onSave?.(dataUrl);
    return dataUrl;
  }, [fabricCanvas, onSave]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 flex justify-center items-start bg-card/50 rounded-xl p-4 overflow-auto"
      >
        <div className="border border-border rounded-lg overflow-hidden shadow-lg">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="w-full lg:w-72 space-y-4 p-4 bg-card rounded-xl border border-border">
        <h3 className="font-semibold text-foreground">Ferramentas</h3>

        {/* Add Elements */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Adicionar</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={addText} className="gap-2">
              <Type className="w-4 h-4" />
              Texto
            </Button>
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={addElement}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild className="w-full gap-2">
                <span>
                  <ImagePlus className="w-4 h-4" />
                  Objeto
                </span>
              </Button>
            </label>
          </div>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={addBackgroundImage}
              className="hidden"
            />
            <Button variant="outline" size="sm" asChild className="w-full gap-2">
              <span>
                <ImagePlus className="w-4 h-4" />
                Imagem de Fundo
              </span>
            </Button>
          </label>
        </div>

        {/* Text Controls */}
        {selectedObject?.type === "text" && (
          <div className="space-y-3 border-t border-border pt-4">
            <Label className="text-sm text-muted-foreground">Texto</Label>
            <div>
              <Label className="text-xs">Tamanho: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={updateFontSize}
                min={12}
                max={72}
                step={1}
                className="mt-1"
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={textAlign === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => updateTextAlign("left")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={textAlign === "center" ? "default" : "outline"}
                size="sm"
                onClick={() => updateTextAlign("center")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={textAlign === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => updateTextAlign("right")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Object Controls */}
        {selectedObject && (
          <div className="space-y-3 border-t border-border pt-4">
            <Label className="text-sm text-muted-foreground">Selecionado</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => scaleSelected(0.1)}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => scaleSelected(-0.1)}>
                <Minus className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={deleteSelected}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {selectedObject.type === "image" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={handleRemoveBackground}
                disabled={removingBg}
              >
                <Eraser className="w-4 h-4" />
                {removingBg ? "Removendo..." : "Remover Fundo"}
              </Button>
            )}
          </div>
        )}

        {/* Padding */}
        <div className="space-y-2 border-t border-border pt-4">
          <Label className="text-sm text-muted-foreground">
            Margem de Respiro: {padding[0]}px
          </Label>
          <Slider
            value={padding}
            onValueChange={setPadding}
            min={0}
            max={60}
            step={5}
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border">
          <Button className="w-full" onClick={exportCanvas}>
            Aplicar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
