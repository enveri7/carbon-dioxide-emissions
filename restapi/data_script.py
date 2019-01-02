import requests, zipfile, io, datetime, os, shutil, glob, json, csv, logging

dirname = os.path.dirname(__file__)

# Download a zip file and unzip it to files dir
def get_zip_data_and_unzip(download_url):
    response = requests.get(download_url)
    response.raise_for_status()
    z = zipfile.ZipFile(io.BytesIO(response.content))
    filename = os.path.join(dirname, 'data/temp/')
    z.extractall(filename)

# Create a new csv file without metadata
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

# Csv to json
def create_json_file_from_csv(csv_file_name, json_file_name, headers):
    csvfile = open(csv_file_name, 'r')
    jsonfile = open(json_file_name, 'w')

    reader = csv.DictReader( csvfile, headers)
    out = json.dumps( [ row for row in reader ] )
    jsonfile.write(out)

def timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Main function
def main():
    emissions_url = 'http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=csv'
    population_url = 'http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv'

    # create data directory if it does not exist
    filename = os.path.join(dirname, 'data/')
    if not os.path.exists(filename):
        os.mkdir(filename)

    # create log file
    logging.basicConfig(filename=os.path.join(dirname, 'data/debug.log'),level=logging.DEBUG,format='%(asctime)s,%(msecs)d %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S')

    logging.debug("!!!Script started!!!")

    # create backup directory if it does not exist
    filename = os.path.join(dirname, 'data/backup/')
    if not os.path.exists(filename):
        os.mkdir(filename)

    # create temp directory for new files
    filename = os.path.join(dirname, 'data/temp/')
    if os.path.exists(filename):
        shutil.rmtree(filename)
    if not os.path.exists(filename):
        os.mkdir(filename)

    # Get temp dir files
    filename = os.path.join(dirname, 'data/temp/*')
    files = glob.glob(filename)

    # create a new files directory after backup
    filename = os.path.join(dirname, 'data/temp/')
    if not os.path.exists(filename):
        os.mkdir(filename)

    # download zipped data and unzip it to files dir
    try:
        get_zip_data_and_unzip(emissions_url)
        get_zip_data_and_unzip(population_url)
    except ConnectionError as error:
        logging.error(error)
        raise
    except zipfile.BadZipFile as error:
        logging.error(error)
        raise
    except Exception as error:
        logging.error(error)
        raise

    # Get temp dir files
    filename = os.path.join(dirname, 'data/temp/*')
    files = glob.glob(filename)

    # remove metadata rows from csv and get headers
    try:
        for file in files:
            if "Metadata" not in file and "API_EN.ATM.CO2E" in file: # find the correct file
                headers = get_headers(file, 5) # headers are in fifth row
                filename = os.path.join(dirname, 'data/temp/emissions.csv')
                create_new_csv_files_without_metadata(file, filename, 5)
            elif "Metadata" not in file and "API_SP.POP.TOTL" in file: # find the correct file
                filename = os.path.join(dirname, 'data/temp/population.csv')
                create_new_csv_files_without_metadata(file, filename, 5)
    except FileNotFoundError as error:
        logging.error(error)
        raise
    except Exception as error:
        logging.error(error)
        raise

    # turn csv files to json files
    create_json_file_from_csv(os.path.join(dirname, 'data/temp/emissions.csv'), os.path.join(dirname, 'data/temp/emissions.json'), headers)
    create_json_file_from_csv(os.path.join(dirname, 'data/temp/population.csv'), os.path.join(dirname, 'data/temp/population.json'), headers)

    # backup files if files directory exists and it contains files
    filename = os.path.join(dirname, 'data/files/')
    backup = os.path.join(dirname, 'data/backup/')
    if os.path.exists(filename) and files:
        shutil.move(filename, backup + timestamp())

    # Everything seems to be successfull until this so rename "temp" to "files"
    files = os.path.join(dirname, 'data/files/')
    temp = os.path.join(dirname, 'data/temp/')
    os.rename(temp,files)

    logging.debug(" Script ended successfully.")

if __name__ == "__main__":
    main()
