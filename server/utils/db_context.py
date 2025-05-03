def get_db_context():
    with open('mlb_schema_subset.csv', 'r') as file:
        return file.read()
