import sys
from pathlib import Path
import datetime

def mkdate(date):
    Path(date).mkdir()
    Path(date+"/input.txt").touch()
    Path(date+"/part1.py").touch()
    Path(date+"/part2.py").touch()

def mktoday():
    date = datetime.date.today().strftime("%Y_%m_%d")
    mkdate(date)
