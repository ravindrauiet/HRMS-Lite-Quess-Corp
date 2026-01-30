from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, database

router = APIRouter(
    prefix="/attendance",
    tags=["attendance"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Attendance)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Optional: Check if employee exists first
    employee = crud.get_employee(db, attendance.employee_id)
    if not employee:
         raise HTTPException(status_code=404, detail="Employee not found")
    return crud.create_attendance(db=db, attendance=attendance)

@router.get("/{employee_id}", response_model=List[schemas.Attendance])
def read_attendance(employee_id: int, db: Session = Depends(get_db)):
    return crud.get_attendance(db, employee_id=employee_id)
