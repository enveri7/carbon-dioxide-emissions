import requests, zipfile, io, datetime, os, shutil, glob, json, csv

def get_zip_file_and_unzip(download_url):
    r = requests.get(download_url)
    z = zipfile.ZipFile(io.BytesIO(r.content))
    z.extractall('./data/csv/')

# remove number of lines from csv file and create a new file without those lines
def remove_lines(read_file_name, output_file_name, line_count):
    with open(read_file_name,'r') as f:
        with open(output_file_name,'w') as f1:
            reader = csv.reader(f, delimiter=',')
            writer = csv.writer(f1, delimiter=',')
            for i in range(line_count):
                next(reader)
            for line in f:
                f1.write(line)

def get_headers(file_name):
    with open(file_name, newline='') as f:
        reader = csv.reader(f)
        row = next(reader)  # gets the first line
        return row

def create_json_file_from_csv(csv_file_name, json_file_name, headers):
    csvfile = open(csv_file_name, 'r')
    jsonfile = open(json_file_name, 'w')

    reader = csv.DictReader( csvfile, headers)
    out = json.dumps( [ row for row in reader ] )
    jsonfile.write(out)

emissions_url = 'http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=csv'
population_url = 'http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv'

files = glob.glob("./data/csv/*")

# backup old files is directory exists and it contains files
if os.path.exists('./data/csv/') and files:
    shutil.move('./data/csv/', './data/old/' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

# create a new directory after backup
if not os.path.exists('./data/csv/'):
    os.mkdir('./data/csv/')

# Download zipped data and unzip it
get_zip_file_and_unzip(emissions_url)
get_zip_file_and_unzip(population_url)

for file in files:
    if "Metadata" not in file and "API_EN.ATM.CO2E" in file:
        print(file + " löytyi")
        remove_lines(file, './data/csv/emissions.csv', 4)
    elif "Metadata" not in file and "API_SP.POP.TOTL" in file:
        print(file + " löytyi")
        remove_lines(file, './data/csv/population.csv', 4)

headers = get_headers('./data/csv/emissions.csv')
create_json_file_from_csv('./data/csv/emissions.csv', './data/json/emissions.json', headers)
create_json_file_from_csv('./data/csv/population.csv', './data/json/population.json', headers)

# remove_lines('./data/csv/API_SP.POP.TOTL_DS2_en_csv_v2_10224786.csv', './data/csv/asd.csv', 4)
# headers = get_headers('./data/csv/asd.csv')
# create_json_file_from_csv('./data/csv/asd.csv', './data/csv/asd.json', headers)
