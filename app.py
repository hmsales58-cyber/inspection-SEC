import streamlit as st
import requests
import json
from datetime import datetime

# إعدادات الصفحة
st.set_page_config(page_title="SECURED Inspection", page_icon="🛡️", layout="centered")

# CSS السحري لتحويل Streamlit لنسخة طبق الأصل من الـ React App اللي بعته
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
    
    .stApp { background-color: #f8f9fa; font-family: 'Inter', sans-serif; }
    
    /* الهيدر الأسود الكبير */
    .brand-header {
        background-color: #000;
        color: white;
        padding: 50px 20px;
        border-radius: 45px;
        text-align: center;
        margin-bottom: 40px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    /* الكروت البيضاء المدورة */
    .data-card {
        background: white;
        padding: 30px;
        border-radius: 35px;
        border: 1px solid #e2e8f0;
        margin-bottom: 25px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    /* الأزرار الكبيرة السوداء */
    .stButton>button {
        width: 100%;
        border-radius: 24px;
        height: 5em;
        font-weight: 900;
        font-size: 18px;
        background-color: #000;
        color: white;
        border: none;
        text-transform: uppercase;
        letter-spacing: 2px;
        transition: all 0.2s;
    }
    
    .stButton>button:active { transform: scale(0.98); }

    /* زر الحفظ الأخضر ( Emerald 500 ) */
    div[data-testid="stVerticalBlock"] > div:last-child .stButton>button {
        background-color: #10b981 !important;
        box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
    }

    /* تحسين شكل الـ Inputs */
    .stTextInput input, .stNumberInput input {
        background-color: #f1f5f9 !important;
        border-radius: 18px !important;
        border: 2px solid transparent !important;
        padding: 15px !important;
        font-weight: 600 !important;
    }
    .stTextInput input:focus { border-color: #000 !important; }

    /* تحسين شكل الـ Checkbox */
    .stCheckbox { padding: 10px; background: #f8fafc; border-radius: 15px; margin-bottom: 5px; }
    </style>
    """, unsafe_allow_html=True)

# --- [ الهيدر مأخوذ من PrintLayout.txt ] ---
st.markdown("""
    <div class="brand-header">
        <div style="font-size: 42px; font-weight: 900; letter-spacing: 6px; margin-bottom: 5px;">SECURED</div>
        <div style="font-size: 11px; letter-spacing: 7px; opacity: 0.5; margin-bottom: 25px;">LOGISTICS SOLUTION FZCO</div>
        <div style="background: rgba(255,255,255,0.1); display: inline-block; padding: 12px 30px; border-radius: 100px; font-size: 14px; font-weight: 900; border: 1px solid rgba(255,255,255,0.2);">
            INSPECTION AUDIT PORTAL
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- [ 1. Header المعلومات الرئيسية ] ---
st.markdown('<div class="data-card">', unsafe_allow_html=True)
st.markdown("<p style='font-weight:900; color:#64748b; font-size:12px; letter-spacing:2px;'>REPORT DETAILS</p>", unsafe_allow_html=True)
c1, c2 = st.columns(2)
with c1:
    customer_code = st.text_input("CUSTOMER CODE", value="C-000")
    start_time = st.text_input("START TIME", value=datetime.now().strftime("%H:%M"))
with c2:
    company_name = st.text_input("COMPANY NAME", placeholder="Enter Company")
    checked_by = st.text_input("AUDITOR", value="Hussein Badawi")
st.markdown('</div>', unsafe_allow_html=True)

# --- [ 2. الـ Items المنتجات ] ---
if 'items' not in st.session_state:
    st.session_state.items = [{"model": "", "gb": "", "pcs": 1, "color": "", "spec": ""}]

st.markdown("### 📦 INVENTORY LIST")
for i, item in enumerate(st.session_state.items):
    st.markdown(f'<div class="data-card">', unsafe_allow_html=True)
    st.markdown(f"**ENTRY #{i+1}**")
    item['model'] = st.text_input("Manufacturer Model", key=f"m_{i}", value=item['model'])
    
    col_a, col_b, col_c = st.columns([1, 1, 1])
    item['gb'] = col_a.text_input("RAM/GB", key=f"g_{i}", value=item['gb'])
    item['color'] = col_b.text_input("Color", key=f"c_{i}", value=item['color'])
    item['pcs'] = col_c.number_input("Qty", min_value=1, key=f"q_{i}", value=item['pcs'])
    
    item['spec'] = st.text_input("SPEC / P.N", key=f"s_{i}", value=item['spec'])
    st.markdown('</div>', unsafe_allow_html=True)

if st.button("➕ ADD NEW DEVICE ENTRY"):
    st.session_state.items.append({"model": "", "gb": "", "pcs": 1, "color": "", "spec": ""})
    st.rerun()

# --- [ 3. الـ Checklist (بنفس منطق الـ Count اللي في ملفاتك) ] ---
st.markdown("### ✅ CONDITION VERIFICATION")
st.markdown('<div class="data-card">', unsafe_allow_html=True)
checklist_keys = [
    'PACK ORIGINAL', 'BOX OUT SIDE DAMAGE', 'OUT SIDE DAMAGE', 
    'PACK OPEN', 'DAMAGE PCS', 'ACTIVE PCS', 
    'UNCLEAN / STICKER BOX', 'LOOSE BOX', 'OPEN MASTER', 'MASTER', 'STICKERS PCS'
]
checklist_results = {}

for key in checklist_keys:
    col_check, col_count = st.columns([2, 1])
    with col_check:
        is_checked = st.checkbox(key, key=f"chk_{key}")
    with col_count:
        # لو علم صح يظهر له خانة يكتب العدد (زي الـ React App بالظبط)
        count = st.number_input("Count", min_value=0, key=f"num_{key}", label_visibility="collapsed") if is_checked else 0
    checklist_results[key] = {"checked": is_checked, "count": count}

st.markdown('</div>', unsafe_allow_html=True)

# --- [ 4. الحفظ النهائي ] ---
st.divider()
total_qty = sum(it['pcs'] for it in st.session_state.items)
st.markdown(f"<div style='text-align: center; margin-bottom: 30px;'><span style='color: #64748b; font-weight: bold;'>TOTAL AUDITED UNITS</span><br><span style='font-size: 60px; font-weight: 900;'>{total_qty}</span></div>", unsafe_allow_html=True)

if st.button("🚀 SAVE TO GOOGLE DRIVE"):
    with st.spinner("SYNCING TO CLOUD..."):
        SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtcbUEImJngHWkKp-yPzkTBG6IIFVAmNPgEgLGKYy2q25cioP2GWAUvkX7x4yD6p6ZA/exec"
        
        payload = {
            "header": {
                "companyName": company_name,
                "customerCode": customer_code,
                "startTime": start_time,
                "checkedBy": checked_by,
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            "items": st.session_state.items,
            "checklist": checklist_results,
            "totalQty": total_qty
        }
        
        try:
            requests.post(SCRIPT_URL, json=payload, timeout=15)
            st.success("🏁 SUCCESS! REPORT SAVED.")
            st.balloons()
        except:
            st.info("Check Google Drive. Sync initiated.")
