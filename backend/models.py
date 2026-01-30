from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    department = Column(String)

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, index=True) # Ideally a ForeignKey, keeping it simple for now or adding ForeignKey
    date = Column(Date)
    status = Column(String) # Present / Absent

    # To add foreign key properly:
    # employee_id = Column(Integer, ForeignKey("employees.id"))
    # employee = relationship("Employee")
