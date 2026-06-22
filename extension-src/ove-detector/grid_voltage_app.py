import pandas as pd
import tkinter as tk
from tkinter import filedialog, messagebox
import os

# Global storage for saving results
result_text_content = ""


# -------------------------------
# PROCESS FILE FUNCTION
# -------------------------------
def process_file(file_path):
    global result_text_content
    result_text_content = ""

    try:
        ext = file_path.lower().split('.')[-1]

        # Read file
        if ext == "csv":
            try:
                df = pd.read_csv(file_path, encoding='utf-8')
            except:
                df = pd.read_csv(file_path, encoding='latin1')
        elif ext in ["xlsx", "xls"]:
            df = pd.read_excel(file_path, engine='openpyxl')
        else:
            messagebox.showerror("Error", "Unsupported file type")
            return

        output_text.delete(1.0, tk.END)

        def add_line(text):
            global result_text_content
            output_text.insert(tk.END, text)
            result_text_content += text

        # ✅ Total rows
        add_line(f"📊 Total Rows: {len(df)}\n\n")

        # --- Clean RMS Voltage ---
        df['rms_voltage'] = (
            df['rms_voltage']
            .astype(str)
            .str.replace(' V', '', regex=False)
        )

        df['rms_voltage'] = pd.to_numeric(df['rms_voltage'], errors='coerce')

        # --- Fix date ---
        df['time'] = pd.to_datetime(df['time'], errors='coerce', dayfirst=True)

        # Drop invalid rows
        df = df.dropna(subset=['time', 'rms_voltage'])

        add_line(f"✅ Valid Rows: {len(df)}\n\n")

        # --- Create timestamp ---
        if 'time_microseconds' in df.columns:
            df['timestamp'] = df['time'] + pd.to_timedelta(df['time_microseconds'], unit='us', errors='coerce')
        else:
            df['timestamp'] = df['time']

        # ✅ PRINT ALL RMS VOLTAGES
        add_line("📊 RMS VOLTAGE VALUES:\n\n")

        for _, row in df.iterrows():
            add_line(f"{row['timestamp']}  →  {row['rms_voltage']} V\n")

        # --- Detect OVE ---
        ove_df = df[df['rms_voltage'] > 312]

        add_line("\n⚡ OVE RESULT:\n\n")

        if ove_df.empty:
            add_line("✅ No Grid Voltage Event (OVE) detected\n")
        else:
            add_line(f"⚡ OVE Events Found: {len(ove_df)}\n\n")
            for _, row in ove_df.iterrows():
                add_line(f"{row['timestamp']}  →  {row['rms_voltage']} V\n")

    except Exception as e:
        messagebox.showerror("Error", str(e))


# -------------------------------
# FILE SELECT
# -------------------------------
def select_file():
    file_path = filedialog.askopenfilename(
        filetypes=[("CSV files", "*.csv"), ("Excel files", "*.xlsx *.xls")]
    )
    if file_path:
        process_file(file_path)


# -------------------------------
# SAVE RESULTS
# -------------------------------
def save_to_txt():
    global result_text_content

    if not result_text_content:
        messagebox.showwarning("Warning", "No data to save!")
        return

    file_path = filedialog.asksaveasfilename(
        defaultextension=".txt",
        filetypes=[("Text files", "*.txt")]
    )

    if file_path:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(result_text_content)

        messagebox.showinfo("Success", "✅ Results saved successfully!")


# -------------------------------
# GUI SETUP
# -------------------------------
root = tk.Tk()
root.title("Grid Voltage Detector ⚡")
root.geometry("800x600")

# Buttons frame
frame = tk.Frame(root)
frame.pack(pady=10)

# Select File button
btn_select = tk.Button(
    frame,
    text="Select File",
    command=select_file,
    font=("Arial", 12)
)
btn_select.grid(row=0, column=0, padx=10)

# Save button
btn_save = tk.Button(
    frame,
    text="Download Results (.txt)",
    command=save_to_txt,
    font=("Arial", 12)
)
btn_save.grid(row=0, column=1, padx=10)

# Output box
output_text = tk.Text(root, wrap=tk.WORD)
output_text.pack(expand=True, fill=tk.BOTH)

# Run App
root.mainloop()
