import React, { useState } from 'react';
import { 
  Camera, Trash2, Loader2, AlertCircle, Share2, Download, PackageCheck, 
  ShieldAlert, Smartphone, Power, SmartphoneNfc, AlertTriangle, 
  PackageOpen, Sticker, Sparkles, Package, FolderOpen, Archive, CheckCircle2 
} from 'lucide-react';
import { DEFAULT_HEADER, DEFAULT_CHECKLIST } from './types';
import { PrintLayout } from './components/PrintLayout';

export default function App() {
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [items, setItems] = useState<any[]>([]);
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), model: '', gb: '', pcs: 1, color: '', spec: '' }]);
  };

  const handleSave = async () => {
    setLoading(true);
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtcbUEImJngHWkKp-yPzkTBG6IIFVAmNPgEgLGKYy2q25cioP2GWAUvkX7x4yD6p6ZA/exec";
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ header, items, checklist })
      });
      alert("✅ Data Sent Successfully!");
    } catch (e) {
      alert("❌ Error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* BRANDING */}
        <div className="bg-black text-white p-10 rounded-[45px] text-center shadow-2xl">
          <h1 className="text-4xl font-black tracking-widest">SECURED</h1>
          <p className="text-[10px] tracking-[0.5em] opacity-50 uppercase mt-2">Logistics Solution FZCO</p>
        </div>

        {/* HEADER FORM */}
        <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-100">
          <input 
            className="w-full text-2xl font-black mb-4 outline-none" 
            placeholder="COMPANY NAME"
            value={header.companyName}
            onChange={e => setHeader({...header, companyName: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input className="bg-slate-100 p-4 rounded-2xl font-bold" placeholder="CUSTOMER CODE" value={header.customerCode} onChange={e => setHeader({...header, customerCode: e.target.value})}/>
            <input className="bg-slate-100 p-4 rounded-2xl font-bold text-center" type="time" value={header.startTime} onChange={e => setHeader({...header, startTime: e.target.value})}/>
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-slate-800">INSPECTION ITEMS</h2>
            <button onClick={addItem} className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm">+ ADD</button>
          </div>
          
          {items.map((item, index) => (
            <div key={item.id} className="bg-white p-6 rounded-[30px] border-2 border-slate-100 shadow-sm relative">
              <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="absolute top-4 right-4 text-rose-500"><Trash2 size={20} /></button>
              <input className="w-full text-lg font-bold mb-3 outline-none" placeholder="Model Name" value={item.model} onChange={e => {const n=[...items]; n[index].model=e.target.value; setItems(n);}}/>
              <div className="grid grid-cols-3 gap-3">
                <input className="bg-slate-50 p-3 rounded-xl text-sm font-bold" placeholder="GB" value={item.gb} onChange={e => {const n=[...items]; n[index].gb=e.target.value; setItems(n);}}/>
                <input className="bg-slate-50 p-3 rounded-xl text-sm font-bold" placeholder="Color" value={item.color} onChange={e => {const n=[...items]; n[index].color=e.target.value; setItems(n);}}/>
                <input className="bg-slate-50 p-3 rounded-xl text-sm font-bold text-center" type="number" value={item.pcs} onChange={e => {const n=[...items]; n[index].pcs=parseInt(e.target.value); setItems(n);}}/>
              </div>
            </div>
          ))}
        </div>

        {/* SAVE */}
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-6 rounded-[30px] font-black text-xl shadow-xl flex justify-center items-center gap-4 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={28} />}
          SAVE TO GOOGLE DRIVE
        </button>

      </div>
      <PrintLayout header={header} items={items} checklist={checklist} />
    </div>
  );
}
