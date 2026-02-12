import tkinter as tk
from tkinter import filedialog, messagebox
import sqlite3
import json
import os
from pathlib import Path

CONFIG_FILE = "config.json"

class DatabaseManagerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Gestor de Base de Datos - Residencia")
        self.root.geometry("450x300")
        self.root.configure(bg="#f3f4f6")
        self.root.resizable(False, False)

        self.last_path = self.load_config()

        self.setup_ui()

    def load_config(self):
        """Carga la última ruta utilizada desde config.json."""
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r") as f:
                    config = json.load(f)
                    return config.get("db_path", "")
            except Exception:
                return ""
        return ""

    def save_config(self, path):
        """Guarda la ruta actual en config.json."""
        try:
            with open(CONFIG_FILE, "w") as f:
                json.dump({"db_path": str(path)}, f, indent=4)
            self.last_path = str(path)
            self.update_status_label()
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo guardar la configuración: {e}")

    def validate_db(self, path):
        """Valida si el archivo es una base de datos SQLite válida."""
        if not os.path.exists(path):
            return False
        
        try:
            conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            conn.close()
            return True
        except sqlite3.DatabaseError:
            return False
        except Exception:
            return False

    def setup_ui(self):
        """Configura la interfaz gráfica profesional."""
        # Header
        header = tk.Label(
            self.root, 
            text="Configuración de Datos", 
            font=("Segoe UI", 16, "bold"),
            bg="#f3f4f6",
            fg="#1f2937",
            pady=20
        )
        header.pack()

        # Botones Principales
        btn_frame = tk.Frame(self.root, bg="#f3f4f6")
        btn_frame.pack(pady=10)

        self.btn_create = tk.Button(
            btn_frame,
            text="Crear Base de Datos",
            command=self.create_database,
            bg="#3b82f6",
            fg="white",
            font=("Segoe UI", 10, "bold"),
            width=20,
            relief="flat",
            pady=8
        )
        self.btn_create.pack(pady=5)

        self.btn_select = tk.Button(
            btn_frame,
            text="Seleccionar Existente",
            command=self.select_database,
            bg="#10b981",
            fg="white",
            font=("Segoe UI", 10, "bold"),
            width=20,
            relief="flat",
            pady=8
        )
        self.btn_select.pack(pady=5)

        # Estado/Ruta actual
        self.status_label = tk.Label(
            self.root,
            text="No hay base de datos seleccionada",
            font=("Segoe UI", 8, "italic"),
            bg="#f3f4f6",
            fg="#6b7280",
            wraplength=400,
            pady=20
        )
        self.status_label.pack()

        if self.last_path:
            self.update_status_label()

    def update_status_label(self):
        if self.last_path:
            filename = os.path.basename(self.last_path)
            self.status_label.config(
                text=f"Ruta activa: .../{filename}",
                fg="#059669"
            )
        else:
            self.status_label.config(
                text="Sin base de datos activa",
                fg="#6b7280"
            )

    def create_database(self):
        """Crea un nuevo archivo .db en la ruta elegida por el usuario."""
        path = filedialog.asksaveasfilename(
            defaultextension=".db",
            filetypes=[("SQLite Database", "*.db"), ("All Files", "*.*")],
            title="Guardar nueva base de datos"
        )
        
        if path:
            try:
                # Inicializar el archivo SQLite
                conn = sqlite3.connect(path)
                # Opcional: Crear tablas iniciales aquí
                conn.execute("CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)")
                conn.commit()
                conn.close()
                
                self.save_config(path)
                messagebox.showinfo("Éxito", "Base de datos creada y sincronizada correctamente.")
            except Exception as e:
                messagebox.showerror("Error", f"Fallo al crear el archivo: {e}")

    def select_database(self):
        """Permite navegar y seleccionar un archivo .db existente."""
        path = filedialog.askopenfilename(
            filetypes=[("SQLite Database", "*.db"), ("All Files", "*.*")],
            title="Seleccionar base de datos"
        )

        if path:
            if self.validate_db(path):
                self.save_config(path)
                messagebox.showinfo("Conectado", "Conexión establecida con éxito.")
            else:
                messagebox.showerror(
                    "Error de Validación", 
                    "El archivo seleccionado no es una base de datos SQLite válida o está dañado."
                )

if __name__ == "__main__":
    root = tk.Tk()
    app = DatabaseManagerApp(root)
    root.mainloop()
