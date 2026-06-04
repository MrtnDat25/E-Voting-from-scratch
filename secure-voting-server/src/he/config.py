import math
import os

# =====================
# ELECTION CONFIG
# =====================

MAX_CANDIDATES = 100

MAX_VOTERS = 100000

# =====================
# PAILLIER CONFIG
# =====================

KEY_SIZE = 2048

# vote encoding

NUM_BITS = math.ceil(
    math.log2(MAX_VOTERS + 1)
)

# max plaintext size

TOTAL_PLAINTEXT_BITS = (
    MAX_CANDIDATES *
    NUM_BITS
)

# =====================
# SECURITY
# =====================

TOKEN_EXPIRE_MINUTES = 30

NONCE_LENGTH = 32

# =====================
# BLOCKCHAIN
# =====================

CHAIN_ID = 11155111

# =====================
# MONGO
# =====================

MONGO_URI = os.getenv(
    "MONGO_URI"
)

# =====================
# DEBUG
# =====================

DEBUG = True