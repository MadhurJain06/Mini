from pydantic import BaseModel
from typing import List, Optional

class ProtectConfig(BaseModel):
    allowBackground: bool = True
    allowColorGrade: bool = True
    allowFaceSwap: bool = False
    strength: float = 0.72

class JobStatus(BaseModel):
    job_id: str
    status: str
    phase: int
    phase_label: str
    progress: float
    error: Optional[str] = None

class AttackResult(BaseModel):
    name: str
    resistance: float

class JobResult(BaseModel):
    job_id: str
    drs: float
    psnr: float
    attacks_blocked: int
    total_attacks: int
    processing_time: float
    attack_results: List[AttackResult]
    protected_url: str