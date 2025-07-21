"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import Navbar from "@/components/navbar";

export default function Dashboard() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const mdFile = files.find((file) =>
      file.name.toLowerCase().endsWith(".md")
    );

    if (mdFile) {
      setSelectedFile(mdFile);
    } else {
      alert("Please select a Markdown (.md) file");
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith(".md")) {
      setSelectedFile(file);
    } else {
      alert("Please select a Markdown (.md) file");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Read file content
      const fileContent = await selectedFile.text();

      // Create FormData or JSON payload
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedFile.name.replace(".md", ""),
          content: fileContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      alert(result.message || "Upload completed successfully!");

      // Reset after upload
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Upload Your Research
              </h1>
              <p className="text-lg text-muted-foreground">
                Upload your Markdown files to start analyzing and chatting with
                your research documents
              </p>
            </div>

            {/* Upload Area */}
            <Card className="p-8 border-2 border-dashed border-border bg-card/50 backdrop-blur">
              <div
                className={`relative transition-all duration-200 ${
                  isDragOver
                    ? "bg-primary/10 border-primary/30"
                    : "hover:bg-muted/50"
                } border-2 border-dashed rounded-lg p-12 cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isDragOver
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Upload
                      className={`w-8 h-8 ${
                        isDragOver
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isDragOver
                      ? "Drop your file here"
                      : "Upload Markdown File"}
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    Drag and drop your .md file here, or click to browse
                  </p>

                  <div className="text-sm text-muted-foreground">
                    Supported format: .md (Markdown)
                  </div>
                </div>
              </div>
            </Card>

            {/* Selected File Display */}
            {selectedFile && (
              <Card className="mt-6 p-6 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-chart-2" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {selectedFile.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)} • Markdown file
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-muted-foreground bg-transparent border-border"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isUploading ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Instructions */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Once uploaded, you&apos;ll be able to chat with your research
                documents using our AI assistant
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
