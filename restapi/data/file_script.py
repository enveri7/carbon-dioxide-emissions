import requests, zipfile, io, datetime, os, shutil, glob, json, csv, logging

# Download a zip file and unzip it to files dir
def get_zip_data_and_unzip(download_url):
        r = requests.get(download_url)
        z = zipfile.ZipFile(io.BytesIO(r.content))
        z.extractall('./files/')

# create a new csv file without metadata
def create_new_csv_files_without_metadata(read_file_name, output_file_name, line_count):
    with open(read_file_name,'r') as f:
        with open(output_file_name,'w') as f1:
            reader = csv.reader(f, delimiter=',')
            writer = csv.writer(f1, delimiter=',')
            for i in range(line_count):
                next(reader)
            for line in f:
                f1.write(line)

# Get csv file headers
def get_headers(file_name, count=1):
    with open(file_name, newline='') as f:
        headers = []
        reader = csv.reader(f)
        for i in range(count):
            row = next(reader)
        return row

# csv to json
def create_json_file_from_csv(csv_file_name, json_file_name, headers):
    csvfile = open(csv_file_name, 'r')
    jsonfile = open(json_file_name, 'w')

    reader = csv.DictReader( csvfile, headers)
    out = json.dumps( [ row for row in reader ] )
    jsonfile.write(out)

def timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def main():
    emissions_url = 'http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=csv'
    population_url = 'http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv'

    # create log file
    if not os.path.isfile("script.log"):
        open('script.log', 'a').close()

    logging.basicConfig(filename='script.log',level=logging.DEBUG)
    logging.debug("\n" + timestamp() + ": Script started");

    # create backup directory if it does not exist
    if not os.path.exists('./backup/'):
        os.mkdir('./backup/')

    files = glob.glob("./files/*")

    # backup files if files directory exists and it contains any files
    if os.path.exists('./files/') and files:
        shutil.move('./files/', './backup/' + timestamp())

    # create a new files directory after backup
    if not os.path.exists('./files/'):
        os.mkdir('./files/')

    # Download zipped data and unzip it to files dir
    get_zip_data_and_unzip(emissions_url)
    get_zip_data_and_unzip(population_url)

    files = glob.glob("./files/*")

    # Remove metadata rows from csv and get headers
    for file in files:
        if "Metadata" not in file and "API_EN.ATM.CO2E" in file: # find the correct file
            headers = get_headers(file, 5)
            create_new_csv_files_without_metadata(file, './files/emissions.csv', 5)
        elif "Metadata" not in file and "API_SP.POP.TOTL" in file: # find the correct file
            create_new_csv_files_without_metadata(file, './files/population.csv', 5)

    # Turn csv files to json files
    create_json_file_from_csv('./files/emissions.csv', './files/emissions.json', headers)
    create_json_file_from_csv('./files/population.csv', './files/population.json', headers)

if __name__ == "__main__":
    main()
