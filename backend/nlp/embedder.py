# backend/nlp/embedder.py
from sentence_transformers import SentenceTransformer
import numpy as np

print("Loading SBERT model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("SBERT model ready.")

def get_query_embedding(query: str) -> np.ndarray:
    return model.encode(query)

def get_text_embedding(text: str) -> list:
    return model.encode(text).tolist()