# This script is important to retrieve every possible category available through
# the API and for the autocomplete later on. It is a tool I used to automate the
# process of discovering valid and invalid categories and then storing them to a
# json file. It took about 20 minutes to make about 20,000 requests, but I saved
# many hours

import requests
import json
import sys

urls = [f"http://jservice.io/api/category/?id={c}" for c in range(1,20000)]
data = []

# Just in case I want to stop the program
try:
    for url in urls:
        # Just in case I want to stop the program mid-loop
        try:
            response = requests.get(url)

            if response.status_code != 200:
                print(f"Error {response.status_code} in '{url}'!!")
            else:
                temp = response.json()
                data.append((temp["title"], temp["id"]))
        except KeyboardInterrupt:
            sys.exit()
        except:
            print(f"Could not retrieve '{url}'!!")
except KeyboardInterrupt:
    sys.exit()


categories = dict()

for datum in data:
    categories[datum[0]] = datum[1]

with open("categories.json", "w+") as fp:
    json.dump(categories, fp)
