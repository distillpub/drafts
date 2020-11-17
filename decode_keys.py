from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey import RSA

passphrase = input()

with open("private.pem", "r") as fi:
    private_key = RSA.import_key(fi.read(), passphrase=passphrase)

# Paste a bytestring here to decode it.
encrypted_bytestring = eval(input())


def decrypt_data(data):
    decipher = PKCS1_v1_5.new(private_key)
    return decipher.decrypt(data, None).decode()


print(decrypt_data(encrypted_bytestring))
