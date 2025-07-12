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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Research Platform
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Research Files
              </span>
              <br />
              Into Conversations
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your deep research documents, store them securely, and
              interact with them through intelligent AI conversations. Your
              knowledge, amplified.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
              >
                Get Started Free
                <Zap className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Upload & Connect
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Seamlessly upload your research files, PDFs, and documents.
                Connect multiple sources in one centralized hub.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Secure Storage
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your research is safely stored and organized in our secure
                database with full API access for integration.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                AI Conversations
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Chat with your documents using advanced AI. Ask questions, get
                insights, and discover connections in your research.
              </p>
            </Card>
          </div>

          {/* Visual Preview */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Research Platform
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        research-paper-1.pdf
                      </div>
                      <div className="text-sm text-slate-500">
                        2.4 MB • Uploaded
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        analysis-report.docx
                      </div>
                      <div className="text-sm text-slate-500">
                        1.8 MB • Processing
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded-lg text-sm">
                      "What are the key findings in the research paper about
                      climate change?"
                    </div>
                    <div className="bg-white dark:bg-slate-600 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
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
