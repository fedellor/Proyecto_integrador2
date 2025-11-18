from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from typing import List
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def call_model(url, payload):
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=payload)
        return r.json()

class ProteinLigandPair(BaseModel):
    protein_sequence: str
    ligand_smiles: str

class PredictionRequest(BaseModel):
    data: List[ProteinLigandPair]
    options: List[str]

class PredictionResult(BaseModel):
    protein_sequence: str
    ligand_smiles: str
    model1_result: dict
    model2_result: dict
    status: str


@app.post("/get_predictions", response_model=dict)
async def get_predictions(request: PredictionRequest):
    if not request.data:
        raise HTTPException(status_code=400, detail="No data provided")
    
    results = []
    errors = []
    
    try:
        for i, pair in enumerate(request.data):
            try:
                payload = {
                        "protein_sequence": pair.protein_sequence,
                        "ligand_smiles": pair.ligand_smiles
                    }
                model1_task = asyncio.create_task(
                    call_model("http://modelo1:5001/get_prediction",payload)
                )
                model2_task = asyncio.create_task(
                    call_model("http://modelo2:5002/get_prediction", payload)
                 )
                
                model1_result, model2_result = await asyncio.gather(model1_task, model2_task)


                
                result = {
                    "protein_sequence": pair.protein_sequence,
                    "ligand_smiles": pair.ligand_smiles,
                    "model1_result": model1_result,
                    "model2_result": model2_result,
                    "status": "success"
                }
                results.append(result)
                
            except Exception as e:
                error_result = {
                    "protein_sequence": pair.protein_sequence,
                    "ligand_smiles": pair.ligand_smiles,
                    "error": str(e),
                    "status": "error"
                }
                results.append(error_result)
                errors.append(f"Row {i}: {str(e)}")
        print({
            "status": "completed",
            "total_processed": len(request.data),
            "successful": len([r for r in results if r.get("status") == "success"]),
            "errors": len(errors),
            "results": results,
            "error_details": errors if errors else None
        })
        
        return {
            "status": "completed",
            "total_processed": len(request.data),
            "successful": len([r for r in results if r.get("status") == "success"]),
            "errors": len(errors),
            "results": results,
            "error_details": errors if errors else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
