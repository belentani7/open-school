import os
desktop = r"C:\Users\USER\Desktop"
count = 0
for root, dirs, files in os.walk(desktop):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
            count += 1
            print(os.path.join(root, f))
print(f"Total: {count} imagenes")