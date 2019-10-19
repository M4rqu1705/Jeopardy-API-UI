import requests
import json
import sys

urls = [f"http://jservice.io/api/category/?id={c}" for c in range(1,20000)]
data = []

try:
    for url in urls:
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
