"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  TrendingUp, 
  UserCheck,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";

export default function ChatbotLeadsPage() {
  const leads = useQuery(api.leads.listLeads);
  const updateStatus = useMutation(api.leads.updateLeadStatus);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  if (leads === undefined) {
    return <div className="flex items-center justify-center h-screen text-slate-500 font-medium">Loading chatbot leads...</div>;
  }

  // Filter only leads registered via conversational chatbot onboarding
  const chatbotLeads = leads.filter(
    (lead) => lead.chatTranscript !== undefined || lead.chatSummary !== undefined
  );

  const activeLead = chatbotLeads.find(
    (l) => l._id === (selectedLeadId || chatbotLeads[0]?._id)
  ) || chatbotLeads[0];

  const handleStatusChange = async (id: any, status: string) => {
    await updateStatus({ id, status });
  };

  // Timeline transcript string parser
  const parseTranscript = (transcriptText: string | undefined) => {
    if (!transcriptText) return [];
    return transcriptText.split("\n\n").map((msgBlock, idx) => {
      const isUser = msgBlock.startsWith("Client:");
      const senderName = isUser ? "Client" : "Synergy AI";
      const cleanText = msgBlock.replace(/^(?:Client|Synergy AI):\s*/, "").trim();
      return {
        id: idx,
        sender: senderName,
        isUser,
        text: cleanText,
      };
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">AI Chatbot Leads</h1>
            <p className="text-sm text-slate-500">Conversational sales funnels & live client summaries</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 px-3 py-1 text-sm font-semibold">
          Total Conversions: {chatbotLeads.length}
        </Badge>
      </div>

      {chatbotLeads.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Chatbot Leads Yet</h3>
          <p className="text-slate-500 max-w-sm mt-1 text-sm">
            Once a visitor completes the conversational onboarding inside our AI widget, their profile and transcript summary will appear here.
          </p>
        </div>
      ) : (
        /* Split Pane Desktop Interface */
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          {/* Left Panel: Master List */}
          <div className="w-1/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-semibold text-slate-800 text-sm">Prospect Conversion Pipeline</h3>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {chatbotLeads.map((lead) => {
                const isSelected = activeLead?._id === lead._id;
                const creationDate = new Date(lead._creationTime).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <button
                    key={lead._id}
                    onClick={() => setSelectedLeadId(lead._id)}
                    className={`w-full text-left p-4 flex items-start justify-between transition-all hover:bg-slate-50/80 ${
                      isSelected ? "bg-orange-50/40 border-l-4 border-orange-500" : ""
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="font-semibold text-slate-900 truncate text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-500 truncate flex items-center">
                        <MapPin className="w-3. h-3 mr-1 shrink-0 text-slate-400" />
                        {lead.message.replace(/Lead collected via 100% conversational AI chat flow. City:\s*/, "") || "Enquiry"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1 text-slate-300" />
                        {creationDate}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full space-y-2 shrink-0">
                      <Badge
                        className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 ${
                          lead.status === "new" ? "bg-orange-100 text-orange-700 hover:bg-orange-100" :
                          lead.status === "contacted" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                          lead.status === "qualified" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                          "bg-slate-100 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {lead.status}
                      </Badge>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? "translate-x-1" : ""}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Detail Viewer */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {activeLead ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 1. Detail Header Info Card */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start shrink-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{activeLead.name}</h2>
                        <p className="text-xs text-slate-500">Captured on {new Date(activeLead._creationTime).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Contact Pills Grid */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs font-medium text-slate-600">
                      <a href={`mailto:${activeLead.email}`} className="flex items-center hover:text-orange-600 transition-colors">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {activeLead.email}
                      </a>
                      {activeLead.phone && (
                        <a href={`tel:${activeLead.phone}`} className="flex items-center hover:text-orange-600 transition-colors">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          {activeLead.phone}
                        </a>
                      )}
                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {activeLead.message.replace(/Lead collected via 100% conversational AI chat flow. City:\s*/, "") || "Online Client"}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Status</span>
                    <select
                      className="block w-40 px-3 py-1.5 text-xs border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white font-medium text-slate-700"
                      value={activeLead.status}
                      onChange={(e) => handleStatusChange(activeLead._id, e.target.value)}
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified Partner</option>
                      <option value="closed">Closed / Archive</option>
                    </select>
                  </div>
                </div>

                {/* 2. Scrollable Analysis Panels */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* AI SUMMARY BOX */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1.5 text-orange-500" />
                      🤖 AI Sales Analysis & Call Strategy
                    </h3>
                    <div className="border-l-4 border-orange-500 bg-orange-500/5 rounded-r-xl p-5 text-slate-700 text-sm leading-relaxed border border-y-slate-200/50 border-r-slate-200/50">
                      {activeLead.chatSummary ? (
                        <div className="space-y-2 whitespace-pre-line">
                          {activeLead.chatSummary}
                        </div>
                      ) : (
                        <div className="italic text-slate-500 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          DeepSeek has skipped summary generation for this lead. Take standard conversation reference below.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TRANSCRIPT VISUAL TIMELINE */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1.5 text-slate-500" />
                      💬 Chat Transcript Timeline
                    </h3>
                    
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-4 max-h-[350px] overflow-y-auto">
                      {activeLead.chatTranscript ? (
                        parseTranscript(activeLead.chatTranscript).map((chatBubble) => (
                          <div 
                            key={chatBubble.id} 
                            className={`flex ${chatBubble.isUser ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-xs leading-relaxed ${
                              chatBubble.isUser 
                                ? "bg-slate-800 text-white rounded-tr-none" 
                                : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                            }`}>
                              <div className={`font-semibold mb-1 text-[10px] uppercase tracking-wider ${
                                chatBubble.isUser ? "text-slate-400" : "text-orange-500"
                              }`}>
                                {chatBubble.sender}
                              </div>
                              <div className="whitespace-pre-line">
                                {chatBubble.text}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-400 italic text-xs">
                          No conversational transcript was recorded.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 italic">
                Select a chatbot lead to inspect details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
