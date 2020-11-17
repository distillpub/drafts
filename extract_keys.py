try:
    import os

    from Crypto.Cipher import PKCS1_v1_5
    from Crypto.PublicKey import RSA

    with open("public.pem", "r") as fi:
        public_key = RSA.import_key(fi.read())

    SECRET_NAMES = [
        "GITHUB_USERNAME",
        "GITHUB_HOOK_SECRET",
        "GITHUB_TOKEN",
        "FIREBASE_PRODUCTION_TOKEN",
    ]

    def encrypt_data(data):
        cipher = PKCS1_v1_5.new(public_key)
        return cipher.encrypt(data.encode())

    for secret_name in SECRET_NAMES:
        secret_value = os.environ.get(secret_name)
        if secret_value:
            print(f"Encrypted value for {secret_name}")
            print(encrypt_data(secret_value))
        else:
            print(f"No value for {secret_name}")
except:
    pass
