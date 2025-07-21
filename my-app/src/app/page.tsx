import {
  Upload,
  Database,
  MessageCircle,
  Zap,
  FileText,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Research Platform
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-primary to-chart-5 bg-clip-text text-transparent">
                {" "}
                Research Files
              </span>
              <br />
              Into Conversations
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your deep research documents, store them securely, and
              interact with them through intelligent AI conversations. Your
              knowledge, amplified.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started Free
                <Zap className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent border-border"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Upload & Connect
              </h3>
              <p className="text-muted-foreground">
                Seamlessly upload your research files, PDFs, and documents.
                Connect multiple sources in one centralized hub.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur">
              <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-chart-2" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Secure Storage
              </h3>
              <p className="text-muted-foreground">
                Your research is safely stored and organized in our secure
                database with full API access for integration.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur">
              <div className="w-16 h-16 bg-chart-5/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-chart-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                AI Conversations
              </h3>
              <p className="text-muted-foreground">
                Chat with your documents using advanced AI. Ask questions, get
                insights, and discover connections in your research.
              </p>
            </Card>
          </div>

          {/* Visual Preview */}
          <div className="relative">
            <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Research Platform
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">
                        research-paper-1.pdf
                      </div>
                      <div className="text-sm text-muted-foreground">
                        2.4 MB • Uploaded
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <FileText className="w-6 h-6 text-chart-2" />
                    <div>
                      <div className="font-medium text-foreground">
                        analysis-report.docx
                      </div>
                      <div className="text-sm text-muted-foreground">
                        1.8 MB • Processing
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg text-sm">
                      &quot;What are the key findings in the research paper about
                      climate change?&quot;
                    </div>
                    <div className="bg-card p-3 rounded-lg text-sm text-card-foreground">
                      Based on your uploaded research, the key findings include
                      three major climate trends...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
