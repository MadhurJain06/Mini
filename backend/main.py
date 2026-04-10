import uuid, json, time, asyncio
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from models import ProtectConfig, JobStatus, JobResult
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
RESULT_DIR = Path("results")
UPLOAD_DIR.mkdir(exist_ok=True)
RESULT_DIR.mkdir(exist_ok=True)

app.mount("/results", StaticFiles(directory="results"), name="results")

jobs: dict = {}

PHASE_LABELS = [
    "Face detection & masking",
    "Golden timestep analysis",
    "Adversarial noise synthesis",
    "EOT robustness hardening",
    "Adaptive semantic calibration",
    "Red team validation",
    "DRS scoring & report",
]

@app.post("/protect")
async def protect(
    image: UploadFile = File(...),
    config: str = Form(...)
):
    job_id = str(uuid.uuid4())
    cfg = ProtectConfig(**json.loads(config))

    img_path = UPLOAD_DIR / f"{job_id}_{image.filename}"
    with open(img_path, "wb") as f:
        f.write(await image.read())

    jobs[job_id] = {
        "status": "running",
        "phase": 0,
        "phase_label": PHASE_LABELS[0],
        "progress": 0.0,
        "error": None,
        "result": None,
        "img_path": str(img_path),
        "config": cfg.dict(),
    }

    asyncio.create_task(run_mock_pipeline(job_id))

    return {"job_id": job_id}


@app.get("/status/{job_id}")
async def status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return JobStatus(
        job_id=job_id,
        status=job["status"],
        phase=job["phase"],
        phase_label=job["phase_label"],
        progress=job["progress"],
        error=job["error"],
    )


@app.get("/result/{job_id}")
async def result(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    if job["status"] != "done":
        raise HTTPException(400, "Job not complete yet")
    return job["result"]



COLAB_URL: dict = {"url": None}

@app.post("/register-colab")
async def register_colab(payload: dict):
    COLAB_URL["url"] = payload["url"]
    return {"registered": True}

@app.get("/colab-url")
async def get_colab_url():
    return {"url": COLAB_URL["url"]}

async def run_mock_pipeline(job_id: str):
    job = jobs[job_id]

    if COLAB_URL["url"]:
        try:
            async with httpx.AsyncClient(timeout=600) as client:
                with open(job["img_path"], "rb") as f:
                    files = {"image": f}
                    data = {"job_id": job_id, "config": json.dumps(job["config"])}
                    await client.post(f"{COLAB_URL['url']}/run", files=files, data=data)
            return
        except Exception as e:
            job["error"] = str(e)
            job["status"] = "error"
            return

    total = len(PHASE_LABELS)
    for i, label in enumerate(PHASE_LABELS):
        job["phase"] = i
        job["phase_label"] = label
        job["progress"] = round((i / total) * 100, 1)
        await asyncio.sleep(2)

    import shutil
    out_path = RESULT_DIR / f"{job_id}_protected.png"
    shutil.copy(job["img_path"], out_path)

    job["status"] = "done"
    job["progress"] = 100.0
    job["result"] = {
        "job_id": job_id,
        "drs": 0.84,
        "psnr": 38.2,
        "attacks_blocked": 6,
        "total_attacks": 7,
        "processing_time": 14.0,
        "attack_results": [
            {"name": "Stable Diffusion inpainting", "resistance": 92},
            {"name": "ControlNet pose transfer", "resistance": 88},
            {"name": "FaceSwap (SimSwap)", "resistance": 79},
            {"name": "DDIM re-encode attack", "resistance": 85},
            {"name": "JPEG compression bypass", "resistance": 54},
        ],
        "protected_url": f"http://localhost:8000/results/{job_id}_protected.png",
    }