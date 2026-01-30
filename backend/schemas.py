from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    class Config:
        orm_mode = True

class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: str # "Present" or "Absent"

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    class Config:
        orm_mode = True
