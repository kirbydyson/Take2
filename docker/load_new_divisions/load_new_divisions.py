import pandas as pd
import pymysql
import os
import sys

# Setup project root and config
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.append(project_root)

from server import csi3335s2025 as cfg
import nls_teams as nls

file_path = os.path.abspath(os.path.join(project_root, 'docker', 'load_new_divisions'))

# Division mapping
division_map = {
    ('AL', 'east'): 'AL_E',
    ('AL', 'west'): 'AL_W',
    ('AL', 'central'): 'AL_C',
    ('NL', 'east'): 'NL_E',
    ('NL', 'west'): 'NL_W',
    ('NL', 'central'): 'NL_C'
}

# Replacement for old franchise codes
replacements = {
    'BRG': 'BGI', 'CLS': 'CST', 'HAR': 'SOH', 'SNS': 'SOH', 'SL3': 'SOH', 'AB3': 'SOH',
    'CC': 'IC', 'CCB': 'CBE', 'CBR': 'JRC', 'BCA': 'IAB', 'PC': 'TC', 'WEG': 'BEG',
    'CEG': 'BEG', 'BE': 'NE', 'AB2': 'ID', 'LOW': 'LVB', 'DM': 'DYM', 'WP': 'WMP',
    'CS': 'CSW', 'SLG': 'SLS'
}

def insert_division_history(con, csv_path):
    try:
        df = pd.read_csv(csv_path, encoding='latin-1')
        df = df.replace({float("NaN"): None})

        with con.cursor() as cursor:
            sql = """
                INSERT IGNORE INTO TeamDivisionHistory (yearID, teamID, divisionID)
                VALUES (%s, %s, %s)
            """
            count = 0
            for _, row in df.iterrows():
                year = int(row.get('Season', row.get('yearID')))
                lg = row.get('Lg', '').strip()[:2]
                div = str(row.get('Div', '')).strip().lower()

                team_code = row['Team'][:2] if row['Team'][:2] in nls.teams else row['Team'][:3]
                franch_id = replacements.get(team_code, team_code)

                if year < 1969:
                    division_id = 'ND'
                else:
                    division_id = division_map.get((lg, div), 'UNKNOWN')

                cursor.execute(sql, (year, franch_id, division_id))
                count += 1

            con.commit()
            print(f"Inserted {count} rows into TeamDivisionHistory.")

    except Exception as e:
        print(f"Error during division insert: {e}")
        con.rollback()
    finally:
        con.close()

# Entry point
if __name__ == '__main__':
    arg = sys.argv[1] if len(sys.argv) > 1 else 'none'

    if arg not in ['Divisions', 'all']:
        print("Usage: python load_new_divisions.py [Divisions|all]")
        sys.exit(1)

    con = pymysql.connect(
        host=cfg.mysql['location'],
        user=cfg.mysql['user'],
        password=cfg.mysql['password'],
        database=cfg.mysql['database']
    )

    team_batting_csv = os.path.join(file_path, 'nls_teams_batting.csv')

    if not os.path.exists(team_batting_csv):
        print(f"Missing file: {team_batting_csv}")
        sys.exit(1)

    insert_division_history(con, team_batting_csv)
