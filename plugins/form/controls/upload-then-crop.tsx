"use client";

import React, { memo, useCallback, useContext, useRef, useState } from "react";

import { default as NextImage } from "next/image";

import { FormContext } from "@/plugins/form/form";

import { ImageIcon } from "lucide-react";
import Cropper, { Area } from "react-easy-crop";

import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Separator } from "../../../components/ui/separator";
import { FieldType } from "../types/control";

interface UploadThenCropControlProps {
  value: FieldType["value"];
  onChange: FieldType["onChange"];
  placeholder?: string;
  autoSubmit?: boolean;
}

function UploadThenCropControl({
  value,
  onChange,
  placeholder,
  autoSubmit,
}: UploadThenCropControlProps) {
  const { triggerSubmit, isSubmitting } = useContext(FormContext) || {};

  const [imageSource, setImageSource] = useState<string>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(
    value as string | null
  );
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCrop = useCallback(async () => {
    if (imageSource && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          imageSource,
          croppedAreaPixels
        );
        const previewUrl = URL.createObjectURL(croppedImage);
        setCroppedImage(previewUrl);
        onChange(croppedImage);

        if (autoSubmit && triggerSubmit) {
          await triggerSubmit();
        }
      } catch {}

      setIsOpen(false);
    }
  }, [imageSource, croppedAreaPixels, onChange, autoSubmit, triggerSubmit]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCroppedImage(null);
        setCroppedAreaPixels(undefined);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setImageSource(reader.result as string);
      });
      reader.readAsDataURL(file);
      onChange();
      setIsOpen(true);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleSelectImage = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <div className="flex flex-col flex-wrap items-center justify-between gap-x-3 gap-y-3 rounded-lg border border-dashed p-3 sm:flex-row">
        <div className="flex flex-col items-center gap-x-4 gap-y-2 sm:flex-row">
          <div className="relative size-16">
            {croppedImage ? (
              <NextImage
                src={croppedImage}
                alt="Cropped image"
                width={64}
                height={64}
                className="size-16 rounded-full"
              />
            ) : (
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                <ImageIcon className="text-primary" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {placeholder || "Upload billede"}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleSelectImage}
          className="h-8"
        >
          Gennemse
        </Button>
      </div>

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {imageSource && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent data-testid="crop-image-dialog" className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{"Beskær billede"}</DialogTitle>

              <DialogDescription>
                {"Juster størrelsen på gitteret for at beskære dit billede"}
              </DialogDescription>
            </DialogHeader>

            <Separator />

            <div className="relative h-64 w-full">
              <Cropper
                image={imageSource}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
                minZoom={0.2}
                restrictPosition={false}
              />
            </div>

            <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
              <Button type="button" variant="outline" onClick={handleClose}>
                {"Annuller"}
              </Button>

              <Button
                data-testid="crop-image-submit"
                type="button"
                variant="default"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? "0.5" : "1",
                }}
                onClick={handleCrop}
              >
                {isSubmitting ? "Indlæser..." : "Anvend"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

const getCroppedImg = (imageSource: string, pixelCrop: Area): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSource;
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const MAX_WIDTH = 2500;
      const scale = Math.min(1, MAX_WIDTH / pixelCrop.width);

      const targetWidth = pixelCrop.width * scale;
      const targetHeight = pixelCrop.height * scale;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          const file = new File([blob], `image-${Date.now()}.webp`, {
            type: "image/webp",
          });
          resolve(file);
        },
        "image/webp",
        0.8
      );
    };

    image.onerror = () => reject(new Error("Image loading failed"));
  });
};

const MemorizedUploadThenCropControl = memo(UploadThenCropControl);

export default MemorizedUploadThenCropControl;
