import os
import sys
import struct

HEADER_SIZE = 4377
NAME_SIZE = 255
SIZE_SIZE = 14
MTIME_SIZE = 12
PATH_SIZE = 4096

def read_null_terminated(data):
    idx = data.find(b'\x00')
    if idx == -1:
        return data.decode('utf-8', errors='replace').strip()
    return data[:idx].decode('utf-8', errors='replace').strip()

def extract(wpress_file, output_dir='extracted'):
    file_size = os.path.getsize(wpress_file)
    print(f"File size: {file_size / 1024 / 1024:.2f} MB")

    os.makedirs(output_dir, exist_ok=True)

    file_count = 0
    with open(wpress_file, 'rb') as f:
        while True:
            header = f.read(HEADER_SIZE)
            if len(header) < HEADER_SIZE:
                print("Reached end of file (incomplete header).")
                break

            name = read_null_terminated(header[0:NAME_SIZE])
            size_str = read_null_terminated(header[NAME_SIZE:NAME_SIZE + SIZE_SIZE])
            mtime_str = read_null_terminated(header[NAME_SIZE + SIZE_SIZE:NAME_SIZE + SIZE_SIZE + MTIME_SIZE])
            file_path = read_null_terminated(header[NAME_SIZE + SIZE_SIZE + MTIME_SIZE:NAME_SIZE + SIZE_SIZE + MTIME_SIZE + PATH_SIZE])

            try:
                content_size = int(size_str) if size_str else 0
            except ValueError:
                content_size = 0

            if not name and content_size == 0:
                print("Reached end-of-archive marker.")
                break

            full_path = os.path.join(output_dir, file_path, name)
            dir_name = os.path.dirname(full_path)
            os.makedirs(dir_name, exist_ok=True)

            if content_size > 0:
                CHUNK = 1024 * 1024
                with open(full_path, 'wb') as out:
                    remaining = content_size
                    while remaining > 0:
                        to_read = min(CHUNK, remaining)
                        chunk = f.read(to_read)
                        if not chunk:
                            break
                        out.write(chunk)
                        remaining -= len(chunk)
            else:
                with open(full_path, 'wb') as out:
                    pass

            file_count += 1
            if file_count % 100 == 0:
                pos = f.tell()
                pct = (pos / file_size) * 100
                print(f"Extracted {file_count} files ({pct:.1f}%)...")

    print(f"\nDone! Extracted {file_count} files to {output_dir}/")

if __name__ == '__main__':
    wpress_file = sys.argv[1] if len(sys.argv) > 1 else None
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'extracted'

    if not wpress_file:
        print("Usage: python extract_wpress.py <file.wpress> [output-dir]")
        sys.exit(1)

    extract(wpress_file, output_dir)
