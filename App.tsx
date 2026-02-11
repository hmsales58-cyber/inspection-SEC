import streamlit as st
import requests
import json
from datetime import datetime

# إعدادات الصفحة
st.set_page_config(page_title="SECURED Inspection", page_icon="🛡️", layout="centered")

# تأمين الـ Session State (حل مشكلة الـ TypeError)
if 'items' not in st.session_state:
    st.session_state.items = [{"model": "", "gb": "", "pcs": 1, "color": "", "spec": ""}]

if 'checklist' not in st.session_state:
    checklist_keys = [
        'PACK ORIGINAL', 'BOX OUT SIDE DAMAGE', 'OUT SIDE DAMAGE', 
        'PACK OPEN', 'DAMAGE PCS', 'ACTIVE PCS', 
        'UNCLEAN / STICKER BOX', 'LOOSE BOX', 'OPEN MASTER', 'MASTER', 'STICKERS PCS'
    ]
    st.session_state.checklist = {key: {"checked": False, "count": 0} for key in checklist_keys}

# --- [ التنسيق الاحترافي - الألوان السوداء ] ---
st.markdown("""
    <style>
    .stApp { background-color: #f8f9fa; }
    .brand-header {
        background-color: #000; color: white; padding: 40px;
        border-radius: 40px; text-align: center; margin-bottom: 30px;
    }
    .data-card {
        background: white; padding: 25px; border-radius: 30px;
        border: 1px solid #eee; margin-bottom: 20px;
    }
    .stButton>button {
        width: 100%; border-radius: 20px; height: 4.5em;
        font-weight: 900; background-color: #000; color: white;
    }
    div[data-testid="stVerticalBlock"] > div:last-child .stButton>button {
        background-color: #10b981 !important;
    }
    </style>
    """, unsafe_allow_html=True)

# --- [ الهيدر ] ---
st.markdown("""
    <div class="brand-header">
        <div style="font-size: 32px; font-weight: 900; letter-spacing: 4px;">SECURED</div>
        <div style="font-size: 10px; letter-spacing: 6px; opacity: 0.6;">LOGISTICS SOLUTION FZCO</div>
    </div>
    """, unsafe_allow_html=True)

# --- [ 1. Header المعلومات ] ---
st.markdown('<div class="data-card">', unsafe_allow_html=True)
c1, c2 = st.columns(2)
with c1:
    customer_code = st.text_input("CUSTOMER CODE", value="C-000")
    start_time = st.text_input("START TIME", value=datetime.now().strftime("%H:%M"))
with c2:
    company_name = st.text_input("COMPANY NAME", placeholder="Client Name")
    checked_by = st.text_input("AUDITOR", value="Hussein Badawi")
st.markdown('</div>', unsafe_allow_html=True)

# --- [ 2. الـ Items (الجزء اللي كان فيه الخطأ) ] ---
st.markdown("### 📦 INVENTORY LIST")
# عرض العناصر الموجودة في الـ session_state بأمان
for i in range(len(st.session_state.items)):
    st.markdown(f'<div class="data-card">', unsafe_allow_html=True)
    st.markdown(f"**ITEM #{i+1}**")
    st.session_state.items[i]['model'] = st.text_input(f"Model", key=f"m_{i}", value=st.session_state.items[i]['model'])
    
    col_a, col_b, col_c = st.columns([1, 1, 1])
    st.session_state.items[i]['gb'] = col_a.text_input("GB", key=f"g_{i}", value=st.session_state.items[i]['gb'])
    st.session_state.items[i]['color'] = col_b.text_input("Color", key=f"c_{i}", value=st.session_state.items[i]['color'])
    st.session_state.items[i]['pcs'] = col_c.number_input("Qty", min_value=1, key=f"q_{i}", value=st.session_state.items[i]['pcs'])
    st.markdown('</div>', unsafe_allow_html=True)

if st.button("➕ ADD NEW DEVICE"):
    st.session_state.items.append({"model": "", "gb": "", "pcs": 1, "color": "", "spec": ""})
    st.rerun()

# --- [ 3. Checklist ] ---
st.markdown("### ✅ CONDITION VERIFICATION")
st.markdown('<div class="data-card">', unsafe_allow_html=True)
for key in st.session_state.checklist.keys():
    col_check, col_count = st.columns([2, 1])
    with col_check:
        is_checked = st.checkbox(key, key=f"chk_ui_{key}", value=st.session_state.checklist[key]['checked'])
        st.session_state.checklist[key]['checked'] = is_checked
    with col_count:
        if is_checked:
            count = st.number_input("Qty", min_value=0, key=f"num_ui_{key}", value=st.session_state.checklist[key]['count'], label_visibility="collapsed")
            st.session_state.checklist[key]['count'] = count
st.markdown('</div>', unsafe_allow_html=True)

# --- [ 4. SAVE ] ---
total_qty = sum(it['pcs'] for it in st.session_state.items)
st.markdown(f"<h2 style='text-align: center;'>Total: {total_qty}</h2>", unsafe_allow_html=True)

if st.button("🚀 SAVE TO GOOGLE DRIVE"):
    SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtcbUEImJngHWkKp-yPzkTBG6IIFVAmNPgEgLGKYy2q25cioP2GWAUvkX7x4yD6p6ZA/exec"
    payload = {
        "header": {"companyName": company_name, "customerCode": customer_code, "startTime": start_time, "checkedBy": checked_by, "date": datetime.now().strftime("%Y-%m-%d")},
        "items": st.session_state.items,
        "checklist": st.session_state.checklist,
        "totalQty": total_qty
    }
    try:
        requests.post(SCRIPT_URL, json=payload, timeout=15)
        st.success("🏁 DONE!")
        st.balloons()
    except:
        st.error("Connection Error")
