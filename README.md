# tuft

page:
```json
{
  "head": {
    "title": "",
    "og": "",
    "ga": "",
    "tags": [
      ["name", { "key": "value" }, "text"]
    ]
  },
  "body": {
    "name": "",
    "avatar": "",
    "description": "",
    "links": [
      {
        "link": "",
        "img": "",
        "href": ""
      }
    ]
  }
}
```
config:
```json
{
  "source": ".put",
  "dest": ".out",
  "hostname": "http~",
  "lang": "",
  "ignored": [],
  "favicons": {},
  "watch": {}
}
```
shell:
```shell
  Usage: tuft [source] [dest: '.site'] [options]

  Options:

    -c, --config <jsonfile>  default: 'tuft.json' || packagejson.tuft
    -p, --product            build as production
    -q, --quiet              without log
    -v, --version            output the version number
    -h, --help               output usage information
```