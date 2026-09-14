#!/usr/bin/env python3
import openpyxl
import json
import os # Added for directory handling
from datetime import datetime, timedelta
from pathlib import Path
import sys

# ... [generate_school_dates and list_available_classes remain the same] ...

def generate_school_dates(start_date_str='2025-09-11', num_days=260):
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    dates = []
    current = start_date
    while len(dates) < num_days:
        dates.append(current.strftime('%Y-%m-%d'))
        current += timedelta(days=1)
    return dates

def list_available_classes(excel_path):
    try:
        workbook = openpyxl.load_workbook(excel_path, read_only=True)
        skip_sheets = ['Feuil1', 'Feuil2']
        classes = [sheet for sheet in workbook.sheetnames if sheet not in skip_sheets]
        workbook.close()
        return classes
    except Exception as e:
        print(f"❌ Error reading Excel file: {e}")
        return []

def extract_class_data(worksheet, class_name, school_dates):
    header_row = None
    for row_idx in range(1, 10):
        if worksheet.cell(row=row_idx, column=1).value == 'Cef':
            header_row = row_idx
            break
    
    if not header_row:
        print(f"  ⚠️  Warning: No header row found in {class_name}")
        return None
    
    students = []
    row_idx = header_row + 1
    while row_idx <= worksheet.max_row:
        cef = worksheet.cell(row=row_idx, column=1).value
        if not cef: break
        
        student = {
            'cef': str(cef).strip() if cef else '',
            'nom': str(worksheet.cell(row=row_idx, column=2).value or '').strip(),
            'prenom': str(worksheet.cell(row=row_idx, column=3).value or '').strip(),
            'cin': str(worksheet.cell(row=row_idx, column=4).value or '').strip(),
            'email': str(worksheet.cell(row=row_idx, column=5).value or '').strip() if worksheet.cell(row=row_idx, column=5).value else None,
            'attendance': {}
        }
        
        attendance_start_col = 22
        date_idx = 0
        for session_offset in range(0, worksheet.max_column - attendance_start_col + 1):
            col_idx = attendance_start_col + session_offset
            session_num = (session_offset % 4) + 1
            if session_offset > 0 and session_offset % 4 == 0:
                date_idx += 1
            
            if date_idx < len(school_dates):
                current_date = school_dates[date_idx]
                if current_date not in student['attendance']:
                    student['attendance'][current_date] = {'s1': 'empty', 's2': 'empty', 's3': 'empty', 's4': 'empty'}
                
                status = worksheet.cell(row=row_idx, column=col_idx).value
                if status:
                    status = str(status).strip().upper()
                    if status in ['A', 'R', 'AJ', 'P']:
                        student['attendance'][current_date][f's{session_num}'] = status
            else:
                break
        students.append(student)
        row_idx += 1
    
    return {'class_name': class_name, 'total_students': len(students), 'students': students}

# --- UPDATED: Now accepts output_dir ---
def convert_single_class(excel_path, class_name, output_dir, start_date='2025-09-11'):
    print(f"🚀 Converting class: {class_name}")
    
    try:
        workbook = openpyxl.load_workbook(excel_path, data_only=True)
        school_dates = generate_school_dates(start_date, num_days=260)
        worksheet = workbook[class_name]
        class_data = extract_class_data(worksheet, class_name, school_dates)
        
        if not class_data: return None

        # Create filename and full path
        filename = f"{class_name.replace(' ', '_')}.json"
        save_path = os.path.join(output_dir, filename)

        with open(save_path, 'w', encoding='utf-8') as f:
            json.dump(class_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Saved to: {save_path}")
        return save_path
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

# --- UPDATED: Passes output_dir to individual conversion ---
def convert_all_classes(excel_path, output_dir, start_date='2025-09-11'):
    classes = list_available_classes(excel_path)
    if not classes: return

    print(f"🔄 Exporting {len(classes)} classes to: {output_dir}")
    success_count = 0
    
    for class_name in classes:
        result = convert_single_class(excel_path, class_name, output_dir, start_date)
        if result: success_count += 1

    print(f"\n✨ Completed: {success_count}/{len(classes)} successful.")

def interactive_mode(excel_path, output_dir, start_date='2025-09-11'):
    print("="*60)
    print("📚 EXCEL TO JSON CONVERTER")
    print(f"📂 Output Path: {output_dir}")
    print("="*60)
    
    classes = list_available_classes(excel_path)
    if not classes: return

    print(f"\n  99. EXPORT ALL CLASSES")
    for idx, class_name in enumerate(classes, 1):
        print(f"  {idx:2d}. {class_name}")
    print(f"   0. Exit")

    while True:
        choice = input("\nEnter choice: ").strip()
        if choice == '0': break
        if choice == '99':
            convert_all_classes(excel_path, output_dir, start_date)
            continue
            
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(classes):
                convert_single_class(excel_path, classes[idx], output_dir, start_date)
            else:
                print("❌ Invalid number.")
        except ValueError:
            print("❌ Enter a valid number.")

def main():
    # --- CONFIGURE YOUR PATHS HERE ---
    # Paths are relative to this script's own folder (gestion_absence-synthese/python/),
    # not the old absence2 folder — that folder gets archived off the live tree.
    _here = Path(__file__).resolve().parent
    EXCEL_FILE = str(_here / 'SUIVI ABSENCE DES STAGIAIRES 2.xlsx')

    # Change this to whatever folder you want!
    OUTPUT_DIR = str(_here / 'jsonfiles' / '1er annee') + '/'
    
    START_DATE = '2025-09-11'
    
    # 1. Check if Excel exists
    if not Path(EXCEL_FILE).exists():
        print(f"❌ File not found: {EXCEL_FILE}")
        sys.exit(1)

    # 2. Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"📁 Created new directory: {OUTPUT_DIR}")

    interactive_mode(EXCEL_FILE, OUTPUT_DIR, START_DATE)

if __name__ == "__main__":
    main()