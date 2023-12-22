import sys
import uvicorn
from app import create_app

if __name__ == "__main__":
    uvicorn.run(app=create_app(sys.argv[1]), host="0.0.0.0", port=8080)
