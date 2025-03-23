import base64
import argparse

def encode_base64(input_string):
    """Encodes a string to Base64."""
    input_bytes = input_string.encode('utf-8')
    base64_bytes = base64.b64encode(input_bytes)
    base64_string = base64_bytes.decode('utf-8')
    return base64_string

def decode_base64(base64_string):
    """Decodes a Base64 string."""
    base64_bytes = base64_string.encode('utf-8')
    input_bytes = base64.b64decode(base64_bytes)
    input_string = input_bytes.decode('utf-8')
    return input_string

def main():
    parser = argparse.ArgumentParser(description="Base64 string encoder/decoder.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-e", "--encode", help="String to encode.")
    group.add_argument("-d", "--decode", help="Base64 string to decode.")

    args = parser.parse_args()

    if args.encode:
        encoded_string = encode_base64(args.encode)
        print(encoded_string)
    elif args.decode:
        try:
            decoded_string = decode_base64(args.decode)
            print(decoded_string)
        except base64.binascii.Error:
            print("Error: Invalid Base64 string.")

if __name__ == "__main__":
    main()
